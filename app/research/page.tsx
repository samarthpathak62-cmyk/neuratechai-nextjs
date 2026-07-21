import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "Research" };
export const revalidate = 60;

const CATEGORIES = ["Papers", "Projects", "Datasets", "Experiments"] as const;

// Shown only for categories with nothing published yet from /admin/research.
const DEMO: Record<string, { tag: string; title: string; body: string }[]> = {
  Papers: [
    { tag: "NeurIPS 2026", title: "Sparse Routing at Scale: Neuron MoE", body: "How conditional computation lets a 132B parameter model run at the cost of a 12B dense model." },
    { tag: "arXiv preprint", title: "Long-Context Retrieval Without Degradation", body: "A study of attention patterns across 256K token windows and how we preserve recall at scale." },
  ],
  Projects: [
    { tag: "", title: "Nexa Multi-modal", body: "Unifying text, vision, and audio understanding behind a single model interface." },
    { tag: "", title: "Open Eval Suite", body: "An open-source benchmark harness we use internally, published for community verification." },
  ],
  Datasets: [
    { tag: "", title: "NeuraCode-1M", body: "1M permissively licensed code samples across 40 languages, curated for instruction tuning." },
  ],
  Experiments: [
    { tag: "In progress", title: "Real-time voice reasoning", body: "Streaming audio-to-audio model for low-latency conversational agents." },
  ],
};

export default async function ResearchPage() {
  const published = await prisma.researchPaper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  const byCategory = CATEGORIES.map((cat) => {
    const fromDb = published
      .filter((p) => p.category === cat)
      .map((p) => ({ tag: p.tag, title: p.title, body: p.summary }));
    return { category: cat, items: fromDb.length > 0 ? fromDb : DEMO[cat] ?? [] };
  });

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Research</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Papers, projects &amp; open experiments</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Our published research, ongoing projects, and the datasets behind them.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          {byCategory.map(({ category, items }) => (
            <div key={category} className="mb-16">
              <Reveal><h2 className="font-display text-[1.6rem] mb-6">{category}</h2></Reveal>
              <div className="grid md:grid-cols-3 gap-6">
                {items.length === 0 ? (
                  <p className="text-ink-dim text-sm">Nothing published in this category yet.</p>
                ) : (
                  items.map((item, i) => (
                    <Reveal key={item.title + i} delay={i * 0.06}>
                      <div className="glass p-8 h-full">
                        {item.tag && (
                          <span className="tag inline-block text-[0.72rem] px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-dim">
                            {item.tag}
                          </span>
                        )}
                        <h3 className="font-display text-[1.05rem] mt-3.5 mb-2.5">{item.title}</h3>
                        <p className="text-ink-dim text-[0.9rem]">{item.body}</p>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
