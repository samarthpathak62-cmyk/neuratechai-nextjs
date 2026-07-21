import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "Datasets" };
export const revalidate = 300;

export default async function DatasetsPage() {
  const datasets = await prisma.dataset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Datasets</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Open datasets we publish</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Curated for training and evaluation — free to use under their listed license.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-3 gap-6">
          {datasets.length === 0 ? (
            <p className="text-ink-dim col-span-3 text-center">No datasets published yet.</p>
          ) : (
            datasets.map((d, i) => (
              <Reveal key={d.id} delay={(i % 3) * 0.08}>
                <div className="glass p-7 h-full flex flex-col">
                  <h3 className="font-display text-[1.1rem] mb-2.5">{d.name}</h3>
                  <p className="text-ink-dim text-sm mb-4 flex-1">{d.description}</p>
                  <div className="flex justify-between text-xs text-ink-faint border-t border-white/[0.08] pt-3.5">
                    <span>{d.sizeLabel}</span>
                    <span>{d.license}</span>
                  </div>
                  {d.downloadUrl && (
                    <a href={d.downloadUrl} className="text-cyan text-sm mt-3.5 hover:underline">
                      Download →
                    </a>
                  )}
                </div>
              </Reveal>
            ))
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
