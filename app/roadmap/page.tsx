import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";

export const metadata = { title: "Roadmap" };
export const revalidate = 300;

const COLUMNS = [
  { status: "NOW", label: "Now", color: "text-cyan" },
  { status: "NEXT", label: "Next", color: "text-violet" },
  { status: "LATER", label: "Later", color: "text-ink-dim" },
  { status: "SHIPPED", label: "Shipped", color: "text-ink-faint" },
] as const;

export default async function RoadmapPage() {
  const items = await prisma.roadmapItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Roadmap</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">What we&apos;re building</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">A live look at what&apos;s shipping now, next, and later.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-4 gap-5">
          {COLUMNS.map((col) => {
            const colItems = items.filter((i) => i.status === col.status);
            return (
              <div key={col.status}>
                <h2 className={`font-display text-[1rem] mb-4 uppercase tracking-wider ${col.color}`}>
                  {col.label} <span className="text-ink-faint font-mono text-xs">({colItems.length})</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {colItems.length === 0 ? (
                    <p className="text-ink-faint text-sm">Nothing here yet.</p>
                  ) : (
                    colItems.map((i) => (
                      <div key={i.id} className="glass p-5">
                        <h3 className="font-display text-[0.94rem] mb-2">{i.title}</h3>
                        <p className="text-ink-dim text-xs">{i.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
}
