import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { Reveal } from "@/components/reveal";
import { BlogList, type BlogListPost } from "@/components/blog-list";

export const metadata = { title: "Blog" };
export const revalidate = 60;

// Shown only if no posts have been published yet from /admin/blog —
// gives the page something to look like out of the box.
const DEMO_POSTS: BlogListPost[] = [
  { tag: "Product", title: "Neuron 14B is now generally available", body: "Faster, cheaper, and better at long-context tasks than its predecessor.", date: "July 2, 2026", read: "4 min" },
  { tag: "Engineering", title: "Why we built our own gateway on top of LiteLLM", body: "Provider-agnostic infrastructure that lets us swap models without touching the frontend.", date: "June 20, 2026", read: "6 min" },
  { tag: "Company", title: "Neura Tech AI raises Series A", body: "New funding to accelerate research on efficient mixture-of-experts models.", date: "June 5, 2026", read: "3 min" },
];

export default async function BlogPage() {
  const published = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  const usingDemoContent = published.length === 0;
  const posts: BlogListPost[] = usingDemoContent
    ? DEMO_POSTS
    : published.map((p) => ({
        tag: p.category,
        title: p.title,
        body: p.excerpt,
        date: new Date(p.publishedAt ?? p.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        read: `${Math.max(1, Math.round(p.content.split(/\s+/).length / 200))} min`,
      }));

  const featured = usingDemoContent
    ? {
        tag: "Featured",
        category: "Research",
        title: "Inside Neuron MoE: routing 132B parameters efficiently",
        body: "A deep dive into the sparse routing mechanism behind our largest model yet, and why active-parameter cost matters more than headline size.",
        date: "July 14, 2026",
        read: "9 min read",
      }
    : {
        tag: "Featured",
        category: posts[0].tag,
        title: posts[0].title,
        body: posts[0].body,
        date: posts[0].date,
        read: `${posts[0].read} read`,
      };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Blog</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Notes from the lab</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Release notes, research breakdowns, and engineering deep-dives.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          <Reveal>
            <div className="glass grid md:grid-cols-2 overflow-hidden mb-14">
              <div className="p-11">
                <span className="tag text-[0.72rem] px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-dim">{featured.tag}</span>
                <h2 className="font-display text-[1.7rem] mt-4 mb-3.5">{featured.title}</h2>
                <p className="text-ink-dim">{featured.body}</p>
                <div className="flex gap-3 text-ink-faint text-[0.78rem] mt-3.5">
                  <span>{featured.category}</span><span>·</span><span>{featured.date}</span><span>·</span><span>{featured.read}</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan/15 to-violet/15 min-h-[200px]" />
            </div>
          </Reveal>

          <BlogList posts={posts} />
        </div>
      </section>
      <Footer />
    </>
  );
}
