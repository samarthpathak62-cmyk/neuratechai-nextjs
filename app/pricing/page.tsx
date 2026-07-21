"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PLANS = [
  {
    tier: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    highlighted: false,
    features: [
      "20 requests / min",
      "40,000 tokens / min",
      "Community support",
      "Neuron 4B access",
    ],
  },
  {
    tier: "STARTER",
    name: "Starter",
    price: "$9",
    period: "/ month",
    highlighted: false,
    features: [
      "80 requests / min",
      "150,000 tokens / min",
      "Email support",
      "Neuron 4B & 14B access",
      "1 API key",
    ],
  },
  {
    tier: "PRO",
    name: "Pro",
    price: "$29",
    period: "/ month",
    highlighted: true,
    features: [
      "300 requests / min",
      "1,000,000 tokens / min",
      "Priority support",
      "All models incl. Nexa AI",
      "3 API keys",
    ],
  },
  {
    tier: "BUSINESS",
    name: "Business",
    price: "$99",
    period: "/ month",
    highlighted: false,
    features: [
      "1,000 requests / min",
      "5,000,000 tokens / min",
      "Priority support + Slack",
      "All models + early access",
      "10 API keys",
      "Usage analytics",
    ],
  },
  {
    tier: "ENTERPRISE",
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlighted: false,
    features: [
      "Custom rate limits",
      "Dedicated capacity",
      "SSO & audit logs",
      "Custom contract & SLA",
    ],
  },
] as const;

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleUpgrade(tier: string) {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }
    if (tier === "ENTERPRISE") {
      router.push("/contact");
      return;
    }
    if (tier === "FREE") return;

    setLoadingTier(tier);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    setLoadingTier(null);

    if (data.url) window.location.href = data.url;
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Pricing</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Simple, usage-based pricing</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Start free. Upgrade when you need higher throughput.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.08}>
              <div className={`glass p-8 h-full flex flex-col ${plan.highlighted ? "border-cyan/40 relative" : ""}`}>
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-grad-brand text-[#04121a] text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-[1.2rem] mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-display font-bold">{plan.price}</span>
                  <span className="text-ink-dim text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-dim">
                      <Check size={16} className="text-cyan flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "primary" : "ghost"}
                  className="w-full justify-center"
                  disabled={loadingTier === plan.tier}
                  onClick={() => handleUpgrade(plan.tier)}
                >
                  {loadingTier === plan.tier
                    ? "Redirecting…"
                    : plan.tier === "FREE"
                    ? session
                      ? "Current plan"
                      : "Get started"
                    : plan.tier === "ENTERPRISE"
                    ? "Contact sales"
                    : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-center text-ink-faint text-sm mt-10">
          Need something custom? <Link href="/contact" className="text-cyan hover:underline">Talk to us</Link>.
        </p>
      </section>
      <Footer />
    </>
  );
}
