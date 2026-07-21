import { auth } from "@/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "You must be signed in to upgrade." }, { status: 401 });
  }

  const { tier } = (await req.json().catch(() => ({}))) as { tier?: string };
  const plan = PLANS.find((p) => p.tier === tier);

  if (!plan || !plan.priceId) {
    return Response.json({ error: "Invalid or non-purchasable plan." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  if (!user) {
    return Response.json({ error: "User not found." }, { status: 404 });
  }

  // Reuse an existing Stripe customer if we already created one.
  let customerId = user.subscription?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/pricing?checkout=canceled`,
    metadata: { userId: user.id, tier: plan.tier },
    subscription_data: {
      metadata: { userId: user.id, tier: plan.tier },
    },
  });

  return Response.json({ url: checkoutSession.url });
}
