"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Github, MessageCircle, Twitter, Linkedin, Mail } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire this up to an email service (Resend, SendGrid) or a
    // dedicated /api/contact route — this template only simulates success.
    setStatus("sent");
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Contact</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Let&apos;s talk</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Questions about the API, partnerships, or careers — reach out and we&apos;ll get back to you.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10">
          <Reveal>
            <div className="glass p-10">
              <h3 className="font-display text-[1.15rem] mb-6">Send a message</h3>
              {status === "sent" ? (
                <p className="text-cyan">Thanks — this is a template, wire the form up to your email service to receive it for real.</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <FormField label="Name"><input type="text" required placeholder="Your full name" className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40" /></FormField>
                  <FormField label="Email"><input type="email" required placeholder="you@company.com" className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40" /></FormField>
                  <FormField label="Topic">
                    <select className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40">
                      <option>General inquiry</option>
                      <option>API / technical support</option>
                      <option>Partnerships</option>
                      <option>Careers</option>
                      <option>Press</option>
                    </select>
                  </FormField>
                  <FormField label="Message"><textarea required placeholder="How can we help?" className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40 min-h-[130px]" /></FormField>
                  <Button variant="primary" className="w-full justify-center">Send message</Button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass p-8 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan"><Mail size={16} /></div>
              <div>
                <h3 className="text-[1.05rem]">Email</h3>
                <p className="text-ink-dim text-[0.9rem]">hello@neuratech.ai</p>
              </div>
            </div>
            <div className="glass p-8">
              <h3 className="text-[1.05rem] mb-4">Find us elsewhere</h3>
              <SocialRow icon={<Github size={16} />} label="GitHub" handle="github.com/neuratech-ai" />
              <SocialRow icon={<MessageCircle size={16} />} label="Discord" handle="discord.gg/neuratech" />
              <SocialRow icon={<Twitter size={15} />} label="X / Twitter" handle="@neuratechai" />
              <SocialRow icon={<Linkedin size={15} />} label="LinkedIn" handle="linkedin.com/company/neuratech-ai" last />
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.82rem] uppercase tracking-wider text-ink-faint mb-2">{label}</label>
      {children}
    </div>
  );
}

function SocialRow({ icon, label, handle, last }: { icon: React.ReactNode; label: string; handle: string; last?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 py-4 ${last ? "" : "border-b border-white/[0.08]"}`}>
      <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan flex-shrink-0">{icon}</div>
      <div>
        <strong className="text-[0.92rem]">{label}</strong>
        <div className="text-ink-faint text-[0.85rem]">{handle}</div>
      </div>
    </div>
  );
}
