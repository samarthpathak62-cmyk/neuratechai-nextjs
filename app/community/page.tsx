import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { MessageCircle, Github, Twitter } from "lucide-react";

export const metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Community</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Join the community</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Talk to the team, share what you&apos;re building, and get help from other developers.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-3 gap-6 mb-14">
          <Reveal>
            <div className="glass p-8 h-full flex flex-col">
              <div className="w-11 h-11 rounded-md bg-gradient-to-br from-cyan/15 to-violet/15 flex items-center justify-center text-cyan mb-5">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-display text-[1.1rem] mb-2.5">Discord</h3>
              <p className="text-ink-dim text-sm mb-6 flex-1">Real-time chat with the team and other builders — support, feedback, and early access announcements.</p>
              <a href="https://discord.gg/neuratech" target="_blank" rel="noreferrer"><Button variant="primary" size="sm">Join Discord →</Button></a>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass p-8 h-full flex flex-col">
              <div className="w-11 h-11 rounded-md bg-gradient-to-br from-cyan/15 to-violet/15 flex items-center justify-center text-cyan mb-5">
                <Github size={20} />
              </div>
              <h3 className="font-display text-[1.1rem] mb-2.5">GitHub Discussions</h3>
              <p className="text-ink-dim text-sm mb-6 flex-1">Longer-form technical discussion, feature requests, and issue tracking for our open-source repos.</p>
              <a href="https://github.com/neuratech-ai" target="_blank" rel="noreferrer"><Button variant="ghost" size="sm">View on GitHub →</Button></a>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="glass p-8 h-full flex flex-col">
              <div className="w-11 h-11 rounded-md bg-gradient-to-br from-cyan/15 to-violet/15 flex items-center justify-center text-cyan mb-5">
                <Twitter size={18} />
              </div>
              <h3 className="font-display text-[1.1rem] mb-2.5">X / Twitter</h3>
              <p className="text-ink-dim text-sm mb-6 flex-1">Release announcements, research highlights, and behind-the-scenes updates.</p>
              <a href="https://twitter.com/neuratechai" target="_blank" rel="noreferrer"><Button variant="ghost" size="sm">Follow @neuratechai →</Button></a>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="glass p-10 text-center max-w-[700px] mx-auto">
            <h3 className="font-display text-[1.2rem] mb-3">Community guidelines</h3>
            <p className="text-ink-dim text-sm">
              Be respectful, keep discussion on-topic, and no spam or self-promotion outside the
              designated channels. Full guidelines are pinned in the Discord server.
            </p>
          </div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}
