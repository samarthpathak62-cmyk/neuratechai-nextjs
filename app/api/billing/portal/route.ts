import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    return Response.json({ error: "No billing account found for this user yet." }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${baseUrl}/dashboard`,
  });

  return Response.json({ url: portalSession.url });
}
