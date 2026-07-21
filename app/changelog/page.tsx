import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "Changelog" };
export const revalidate = 300;

const TAG_COLORS: Record<string, string> = {
  Feature: "bg-cyan/10 text-cyan border-cyan/25",
  Fix: "bg-red-500/10 text-red-400 border-red-500/25",
  Improvement: "bg-violet/10 text-violet border-violet/25",
  Breaking: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
};

export default async function ChangelogPage() {
  const entries = await prisma.changelogEntry.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Changelog</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">What&apos;s new</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Every release, fix, and improvement — in order.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[760px] mx-auto px-6">
          {entries.length === 0 ? (
            <p className="text-ink-dim text-center">No changelog entries yet.</p>
          ) : (
            <div className="relative pl-8">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-gradient-to-b from-cyan to-violet opacity-40" />
              {entries.map((e, i) => (
                <Reveal key={e.id} delay={Math.min(i * 0.05, 0.3)}>
                  <div className="relative pb-10 last:pb-0">
                    <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-void border-2 border-cyan shadow-[0_0_12px_rgba(53,212,255,0.5)]" />
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-cyan text-sm">{e.version}</span>
                      <span className={`text-[0.68rem] px-2 py-0.5 rounded-full border ${TAG_COLORS[e.tag] ?? "bg-white/5 text-ink-dim border-white/10"}`}>{e.tag}</span>
                      <span className="text-ink-faint text-xs">{new Date(e.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-display text-[1.1rem] mb-2">{e.title}</h3>
                    <p className="text-ink-dim text-sm">{e.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
