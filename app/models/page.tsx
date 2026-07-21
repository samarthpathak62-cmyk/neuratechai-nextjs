import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Models",
  description: "Explore Neuron 4B, Neuron 14B, Neuron MoE, and Nexa AI.",
};

interface ModelDef {
  name: string;
  status: "live" | "soon";
  statusLabel: string;
  desc: string;
  meta: { label: string; value: string }[];
  actions: { label: string; href: string }[];
}

const MODELS: ModelDef[] = [
  {
    name: "Neuron 4B",
    status: "live",
    statusLabel: "Live",
    desc: "Compact dense model tuned for fast, low-cost inference, on-device deployment, and edge use cases.",
    meta: [
      { label: "Parameters", value: "4.1B" },
      { label: "Context", value: "32K tokens" },
      { label: "License", value: "Apache 2.0" },
      { label: "Modalities", value: "Text" },
    ],
    actions: [
      { label: "Download", href: "#" },
      { label: "API", href: "/playground" },
      { label: "Benchmarks", href: "/research" },
    ],
  },
  {
    name: "Neuron 14B",
    status: "live",
    statusLabel: "Live",
    desc: "Balanced mid-size dense model for general reasoning, coding assistance, and long-context retrieval.",
    meta: [
      { label: "Parameters", value: "14.2B" },
      { label: "Context", value: "128K tokens" },
      { label: "License", value: "Apache 2.0" },
      { label: "Modalities", value: "Text, Code" },
    ],
    actions: [
      { label: "Download", href: "#" },
      { label: "API", href: "/playground" },
      { label: "Benchmarks", href: "/research" },
    ],
  },
  {
    name: "Neuron MoE",
    status: "soon",
    statusLabel: "Research Preview",
    desc: "Sparse mixture-of-experts architecture — frontier-level reasoning with a fraction of active parameters.",
    meta: [
      { label: "Parameters", value: "132B (12B active)" },
      { label: "Context", value: "256K tokens" },
      { label: "License", value: "Research only" },
      { label: "Modalities", value: "Text, Code" },
    ],
    actions: [
      { label: "Request access", href: "/contact" },
      { label: "Paper", href: "/research" },
    ],
  },
  {
    name: "Nexa AI",
    status: "soon",
    statusLabel: "Preview",
    desc: "Our flagship multi-modal assistant unifying text, vision, and voice through a single endpoint.",
    meta: [
      { label: "Parameters", value: "Undisclosed" },
      { label: "Context", value: "200K tokens" },
      { label: "License", value: "Proprietary API" },
      { label: "Modalities", value: "Text, Vision, Audio" },
    ],
    actions: [
      { label: "Try in Playground", href: "/playground" },
      { label: "Overview", href: "/research" },
    ],
  },
  {
    name: "Neuron Embed",
    status: "live",
    statusLabel: "Live",
    desc: "High-throughput embedding model for semantic search, retrieval, and clustering pipelines.",
    meta: [
      { label: "Dimensions", value: "1024" },
      { label: "Context", value: "8K tokens" },
      { label: "License", value: "Apache 2.0" },
      { label: "Modalities", value: "Text" },
    ],
    actions: [
      { label: "Download", href: "#" },
      { label: "API", href: "/playground" },
    ],
  },
  {
    name: "Future Models",
    status: "soon",
    statusLabel: "Roadmap",
    desc: "Native voice generation, real-time vision reasoning, and a distilled on-device MoE line are in active development.",
    meta: [
      { label: "Parameters", value: "TBA" },
      { label: "Context", value: "TBA" },
      { label: "License", value: "TBA" },
      { label: "Modalities", value: "Text, Vision, Audio" },
    ],
    actions: [{ label: "Get notified", href: "/contact" }],
  },
];

export default function ModelsPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />

      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Model Catalog</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Models built for every workload</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">
            Dense, mixture-of-experts, and multi-modal — open weights or hosted API, your choice.
          </p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-3 gap-6">
          {MODELS.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 0.08}>
              <div className="glass p-7 flex flex-col gap-4 h-full">
                <div className="flex justify-between items-start">
                  <h3 className="font-display text-[1.25rem]">{m.name}</h3>
                  <Badge variant={m.status}>{m.statusLabel}</Badge>
                </div>
                <p className="text-ink-dim text-[0.92rem]">{m.desc}</p>
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/[0.08]">
                  {m.meta.map((row) => (
                    <div key={row.label}>
                      <span className="block text-ink-faint text-[0.7rem] uppercase tracking-wider">{row.label}</span>
                      <span className="font-mono text-[0.88rem]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap mt-auto">
                  {m.actions.map((a) => (
                    <Link key={a.label} href={a.href}>
                      <Button variant="ghost" size="sm">{a.label}</Button>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
