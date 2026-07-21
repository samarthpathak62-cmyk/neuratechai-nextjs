import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";

export const metadata = { title: "Benchmarks" };
export const revalidate = 300; // refresh every 5 minutes

export default async function BenchmarksPage() {
  const benchmarks = await prisma.benchmark.findMany({ orderBy: [{ modelName: "asc" }, { score: "desc" }] });

  const byModel = benchmarks.reduce<Record<string, typeof benchmarks>>((acc, b) => {
    (acc[b.modelName] ??= []).push(b);
    return acc;
  }, {});

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Live Benchmarks</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">How our models perform</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Scores are pulled directly from our evaluation database — updated as new runs complete.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1000px] mx-auto px-6 md:px-8">
          {Object.keys(byModel).length === 0 ? (
            <p className="text-ink-dim text-center">No benchmark scores published yet.</p>
          ) : (
            Object.entries(byModel).map(([model, rows]) => (
              <div key={model} className="glass p-7 mb-6">
                <h2 className="font-display text-[1.2rem] mb-5">{model}</h2>
                <div className="flex flex-col gap-4">
                  {rows.map((b) => (
                    <div key={b.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-ink-dim">{b.suite}</span>
                        <span className="font-mono text-cyan">{b.score.toFixed(1)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-grad-brand" style={{ width: `${Math.min(b.score, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
