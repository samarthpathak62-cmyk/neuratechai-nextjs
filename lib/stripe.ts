import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export interface PlanDef {
  tier: "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE";
  name: string;
  priceId: string | null; // Stripe Price ID — null for Free / "contact us" plans
  monthlyUsd: number | null;
  features: string[];
}

export const PLANS: PlanDef[] = [
  {
    tier: "FREE",
    name: "Free",
    priceId: null,
    monthlyUsd: 0,
    features: ["20 requests / min", "40,000 tokens / min", "Community support", "Neuron 4B access"],
  },
  {
    tier: "STARTER",
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_ID_STARTER ?? "",
    monthlyUsd: 9,
    features: ["80 requests / min", "150,000 tokens / min", "Email support", "Neuron 4B & 14B access", "1 API key"],
  },
  {
    tier: "PRO",
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_ID_PRO ?? "",
    monthlyUsd: 29,
    features: ["300 requests / min", "1,000,000 tokens / min", "Priority support", "All models incl. Nexa AI", "3 API keys"],
  },
  {
    tier: "BUSINESS",
    name: "Business",
    priceId: process.env.STRIPE_PRICE_ID_BUSINESS ?? "",
    monthlyUsd: 99,
    features: ["1,000 requests / min", "5,000,000 tokens / min", "Priority support + Slack channel", "All models + early access", "10 API keys", "Usage analytics"],
  },
  {
    tier: "ENTERPRISE",
    name: "Enterprise",
    priceId: null,
    monthlyUsd: null,
    features: ["Custom rate limits", "Dedicated capacity", "SSO & audit logs", "Custom contract & SLA"],
  },
];
