import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Boxes, Eye, Zap, Shield, Rocket } from "lucide-react";

const TIMELINE = [
  { year: "2023", title: "Lab founded", body: "Neura Tech AI started as a small research team focused on efficient transformer architectures." },
  { year: "2024", title: "Neuron 4B released", body: "Our first open-weight model, tuned for on-device and edge inference." },
  { year: "2025", title: "Neuron 14B & API platform", body: "Launched enterprise API access, hosted inference, and the developer playground." },
  { year: "2026", title: "Nexa AI & MoE research", body: "Introduced mixture-of-experts research line and multi-modal Nexa AI assistant." },
];

const MODELS_PREVIEW = [
  { name: "Neuron 4B", desc: "Compact dense model tuned for fast, low-cost inference and on-device deployment.", status: "live" as const },
  { name: "Neuron 14B", desc: "Balanced mid-size model for general reasoning, coding, and long-context tasks.", status: "live" as const },
  { name: "Nexa AI", desc: "Our flagship multi-modal assistant — text, vision, and voice in one endpoint.", status: "soon" as const },
];

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col justify-center text-center pt-16">
        <div className="max-w-[860px] mx-auto px-6 relative z-10">
          <div className="eyebrow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot shadow-[0_0_8px_#35d4ff]" />
            NEURON MoE now in research preview
          </div>

          <h1 className="font-display font-semibold leading-[1.08] text-[clamp(2.4rem,6vw,4.6rem)] mt-6 mb-5 -tracking-[0.02em]">
            Building the{" "}
            <span className="bg-grad-brand bg-clip-text text-transparent">Future</span> of
            <br />
            Artificial Intelligence
          </h1>

          <p className="text-ink-dim text-[clamp(1rem,1.3vw,1.2rem)] max-w-[620px] mx-auto mb-10">
            Neura Tech AI develops open-source and enterprise AI models, research, tools, and
            intelligent systems for the next generation.
          </p>

          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link href="/models">
              <Button variant="primary">Explore Models →</Button>
            </Link>
            <Link href="/playground">
              <Button variant="ghost">Try Playground</Button>
            </Link>
          </div>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] rounded-lg overflow-hidden mt-20">
              <StatCounter target={12} label="Models Released" />
              <StatCounter target={4.8} suffix="M" label="Downloads" />
              <StatCounter target={310} suffix="K" label="Active Users" />
              <StatCounter target={27.4} suffix="K" label="GitHub Stars" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Company */}
      <section className="relative z-10 py-28 md:py-32">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          <Reveal className="max-w-[640px] mb-14">
            <div className="eyebrow">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
              Company
            </div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] mt-3.5 mb-3.5">
              Intelligence, built in the open
            </h2>
            <p className="text-ink-dim text-[1.05rem]">
              We&apos;re a research lab and product company building frontier and open models —
              designed to be inspected, adapted, and deployed anywhere.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-7 mb-7">
            <Reveal>
              <div className="glass p-8 h-full">
                <IconWrap><Boxes size={22} /></IconWrap>
                <h3 className="text-[1.1rem] mb-2.5 font-display">Our Mission</h3>
                <p className="text-ink-dim text-[0.94rem]">
                  Make capable, trustworthy AI systems available to every developer and
                  enterprise — not locked behind a handful of closed platforms. We build models
                  that can be run, audited, and improved by the people who use them.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass p-8 h-full">
                <IconWrap><Eye size={22} /></IconWrap>
                <h3 className="text-[1.1rem] mb-2.5 font-display">Our Vision</h3>
                <p className="text-ink-dim text-[0.94rem]">
                  A future where intelligent systems are a shared foundation — open enough to
                  build on, safe enough to depend on, and fast enough to keep pace with the
                  problems worth solving.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Reveal>
              <ValueCard icon={<Rocket size={20} />} title="Open by default" body="Weights, benchmarks, and research published so the community can verify our claims — not take them on faith." />
            </Reveal>
            <Reveal delay={0.1}>
              <ValueCard icon={<Shield size={20} />} title="Safety as engineering" body="Alignment and evaluation are treated as core infrastructure, not an afterthought bolted on before ship." />
            </Reveal>
            <Reveal delay={0.2}>
              <ValueCard icon={<Zap size={20} />} title="Speed with rigor" body="We ship fast because our evaluation pipeline is faster — every release is benchmarked before it's public." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline / Roadmap */}
      <section className="relative z-10 py-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10">
          <Reveal>
            <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Timeline</div>
            <h2 className="font-display text-[1.8rem] mt-3.5 mb-8">How we got here</h2>
            <div className="relative pl-8">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-gradient-to-b from-cyan to-violet opacity-40" />
              {TIMELINE.map((t) => (
                <div key={t.year} className="relative pb-11 last:pb-0">
                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-void border-2 border-cyan shadow-[0_0_12px_rgba(53,212,255,0.5)]" />
                  <span className="font-mono text-cyan text-[0.85rem]">{t.year}</span>
                  <h4 className="font-display text-[1.05rem] mt-1.5 mb-2">{t.title}</h4>
                  <p className="text-ink-dim text-[0.92rem]">{t.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> What&apos;s next</div>
            <h2 className="font-display text-[1.8rem] mt-3.5 mb-8">Future roadmap</h2>
            <div className="flex flex-col gap-4">
              <div className="glass p-8">
                <h3 className="font-display text-[1.05rem] mb-2">Neuron MoE — general availability</h3>
                <p className="text-ink-dim text-[0.92rem]">Scaling our mixture-of-experts architecture to production with lower latency per active parameter.</p>
              </div>
              <div className="glass p-8">
                <h3 className="font-display text-[1.05rem] mb-2">Native voice &amp; vision pipeline</h3>
                <p className="text-ink-dim text-[0.92rem]">Unified multi-modal endpoint for real-time audio and image understanding through the same API.</p>
              </div>
              <div className="glass p-8">
                <h3 className="font-display text-[1.05rem] mb-2">Self-hosted deployment kit</h3>
                <p className="text-ink-dim text-[0.92rem]">One-command deploy for vLLM / llama.cpp backends behind the same LiteLLM gateway contract.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Models preview */}
      <section className="relative z-10 py-28">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          <Reveal className="max-w-[640px] mb-14">
            <div className="eyebrow"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Models</div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] mt-3.5 mb-3.5">A model for every workload</h2>
            <p className="text-ink-dim text-[1.05rem]">From lightweight on-device models to frontier mixture-of-experts systems.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {MODELS_PREVIEW.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="glass p-7 flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-[1.25rem]">{m.name}</h3>
                    <Badge variant={m.status}>{m.status === "live" ? "Live" : "Preview"}</Badge>
                  </div>
                  <p className="text-ink-dim text-[0.92rem]">{m.desc}</p>
                  <Link href="/models" className="mt-auto">
                    <Button variant="ghost" size="sm">Details</Button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-9">
            <Link href="/models">
              <Button variant="primary">View all models →</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[46px] h-[46px] rounded-md bg-gradient-to-br from-cyan/15 to-violet/15 flex items-center justify-center text-cyan mb-5">
      {children}
    </div>
  );
}

function ValueCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass p-8 h-full">
      <IconWrap>{icon}</IconWrap>
      <h3 className="text-[1.1rem] mb-2.5 font-display">{title}</h3>
      <p className="text-ink-dim text-[0.94rem]">{body}</p>
    </div>
  );
}
