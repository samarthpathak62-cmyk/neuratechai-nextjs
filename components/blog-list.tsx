"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export interface BlogListPost {
  tag: string;
  title: string;
  body: string;
  date: string;
  read: string;
}

const CATEGORIES = ["All", "Research", "Product", "Engineering", "Company"];

export function BlogList({ posts }: { posts: BlogListPost[] }) {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = posts.filter(
    (p) =>
      (activeCat === "All" || p.tag === activeCat) &&
      p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Reveal>
        <div className="flex flex-wrap gap-4 items-center mb-10">
          <div className="flex-1 min-w-[220px] flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-2.5">
            <Search size={16} className="text-ink-faint" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-[0.9rem] w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-[0.82rem] border ${
                  activeCat === c
                    ? "bg-grad-brand text-[#04121a] font-semibold border-transparent"
                    : "border-white/[0.08] text-ink-dim"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <Reveal key={p.title + i} delay={(i % 3) * 0.08}>
            <div className="glass overflow-hidden h-full">
              <div className="h-40 bg-gradient-to-br from-cyan/[0.18] to-violet/[0.18]" />
              <div className="p-6">
                <span className="tag text-[0.72rem] px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-ink-dim">{p.tag}</span>
                <h3 className="font-display text-[1.05rem] mt-2.5 mb-2">{p.title}</h3>
                <p className="text-ink-dim text-[0.88rem]">{p.body}</p>
                <div className="flex gap-3 text-ink-faint text-[0.78rem] mt-3.5">
                  <span>{p.date}</span><span>·</span><span>{p.read}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && <p className="text-ink-dim col-span-3 text-center py-10">No articles match your search.</p>}
      </div>

      <Reveal>
        <div className="glass mt-16 p-10 text-center">
          <h3 className="font-display text-[1.2rem] mb-2.5">Get new posts in your inbox</h3>
          <p className="text-ink-dim mb-5">One email a month. No spam, unsubscribe anytime.</p>
          <div className="flex gap-2.5 max-w-[420px] mx-auto">
            <input type="email" placeholder="you@company.com" className="flex-1 bg-panel border border-white/[0.08] rounded-md px-4 py-3" />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </Reveal>
    </>
  );
}
