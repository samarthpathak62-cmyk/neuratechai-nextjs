import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";

function tierFromPriceId(priceId: string | null | undefined): "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE" {
  if (!priceId) return "FREE";
  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) return "STARTER";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_ID_BUSINESS) return "BUSINESS";
  return "FREE";
}

function mapStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "ACTIVE" as const;
    case "trialing":
      return "TRIALING" as const;
    case "past_due":
      return "PAST_DUE" as const;
    case "canceled":
    case "unpaid":
      return "CANCELED" as const;
    default:
      return "INCOMPLETE" as const;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return Response.json({ error: "Missing Stripe signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] signature verification failed:", err);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        if (!userId || !checkoutSession.subscription || !checkoutSession.customer) break;

        const stripeSub = await stripe.subscriptions.retrieve(checkoutSession.subscription as string);
        const priceId = stripeSub.items.data[0]?.price.id ?? null;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            tier: tierFromPriceId(priceId),
            status: mapStatus(stripeSub.status),
            stripeCustomerId: checkoutSession.customer as string,
            stripeSubscriptionId: stripeSub.id,
            stripePriceId: priceId ?? undefined,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          },
          update: {
            tier: tierFromPriceId(priceId),
            status: mapStatus(stripeSub.status),
            stripeCustomerId: checkoutSession.customer as string,
            stripeSubscriptionId: stripeSub.id,
            stripePriceId: priceId ?? undefined,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const userId = stripeSub.metadata?.userId;
        const priceId = stripeSub.items.data[0]?.price.id ?? null;
        const status = mapStatus(stripeSub.status);
        const tier = status === "CANCELED" ? "FREE" : tierFromPriceId(priceId);

        if (userId) {
          await prisma.subscription.updateMany({
            where: { userId },
            data: {
              tier,
              status,
              stripePriceId: priceId ?? undefined,
              currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            },
          });
        } else {
          // Fallback: match by customer ID if metadata wasn't propagated.
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: stripeSub.customer as string },
            data: {
              tier,
              status,
              stripePriceId: priceId ?? undefined,
              currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            },
          });
        }
        break;
      }

      default:
        break; // ignore events we don't act on
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] handler error:", err);
    return Response.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
