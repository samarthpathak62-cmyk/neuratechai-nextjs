import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Team" };

function Member({ initials, name, role, body }: { initials: string; name: string; role: string; body: string }) {
  return (
    <Reveal>
      <div className="glass p-6 text-center h-full">
        <div className="w-[72px] h-[72px] rounded-full mx-auto mb-4 bg-gradient-to-br from-cyan/25 to-violet/25 flex items-center justify-center font-display font-bold text-cyan">
          {initials}
        </div>
        <h3 className="text-[1rem] mb-1">{name}</h3>
        <div className="text-ink-faint text-[0.8rem] uppercase tracking-wider mb-3">{role}</div>
        <p className="text-ink-dim text-[0.86rem]">{body}</p>
      </div>
    </Reveal>
  );
}

export default function TeamPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Team</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">The people building Neura Tech AI</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">A small, focused team of researchers and engineers from labs and companies across the industry.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          <Reveal><h2 className="font-display text-[1.5rem] mb-6">Founder</h2></Reveal>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Member initials="AK" name="Aarav Khanna" role="Founder & CEO" body="Previously led applied research on efficient transformers; founded Neura Tech AI in 2023." />
          </div>

          <Reveal><h2 className="font-display text-[1.5rem] mb-6">Researchers</h2></Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Member initials="SP" name="Sara Park" role="Research Lead" body="Mixture-of-experts & sparse routing." />
            <Member initials="DM" name="Daniel Moreau" role="Research Scientist" body="Long-context & retrieval." />
            <Member initials="RI" name="Riya Iyer" role="Research Scientist" body="Alignment & evaluation." />
            <Member initials="TC" name="Tomás Cruz" role="Research Scientist" body="Multi-modal learning." />
          </div>

          <Reveal><h2 className="font-display text-[1.5rem] mb-6">Engineers</h2></Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Member initials="LW" name="Liam Walsh" role="Infra Lead" body="Inference & serving systems." />
            <Member initials="NF" name="Nadia Farouk" role="Platform Engineer" body="API gateway & LiteLLM integration." />
            <Member initials="JK" name="Jin Kim" role="Frontend Engineer" body="Playground & developer tools." />
            <Member initials="EM" name="Elena Marchetti" role="DevOps Engineer" body="Deployment & observability." />
          </div>

          <Reveal><h2 className="font-display text-[1.5rem] mb-6">Contributors</h2></Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Member initials="+" name="Open Source" role="Community" body="120+ contributors across our public repositories." />
          </div>
        </div>
      </section>

      <section id="hiring" className="relative z-10 py-16 border-t border-white/[0.08]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          <Reveal>
            <div className="glass p-12 text-center">
              <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> We&apos;re hiring</div>
              <h2 className="font-display text-[1.7rem] mt-4 mb-3.5">Come build frontier models with us</h2>
              <p className="text-ink-dim max-w-[520px] mx-auto mb-7">
                We&apos;re looking for research scientists, infra engineers, and product-minded
                builders who want to work on open, inspectable AI.
              </p>
              <Link href="/contact"><Button variant="primary">View open roles →</Button></Link>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
