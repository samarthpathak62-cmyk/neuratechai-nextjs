"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  author: { name: string | null };
}

const CATEGORIES = ["Research", "Product", "Engineering", "Company"];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Product" });

  function load() {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []));
  }

  useEffect(load, []);

  async function createPost(status: "DRAFT" | "PUBLISHED") {
    if (!form.title || !form.content) return;
    setCreating(true);
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });
    setCreating(false);
    if (res.ok) {
      setForm({ title: "", excerpt: "", content: "", category: "Product" });
      load();
    }
  }

  async function toggleStatus(post: Post) {
    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-[1.7rem] mb-1.5">Blog CMS</h1>
      <p className="text-ink-dim text-sm mb-8">Write and publish posts to /blog.</p>

      <div className="glass p-7 mb-8">
        <h3 className="font-display text-[1.05rem] mb-4">New post</h3>
        <div className="flex flex-col gap-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-cyan/40"
          />
          <input
            placeholder="Short excerpt (optional)"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-cyan/40"
          />
          <textarea
            placeholder="Content (markdown supported by your renderer of choice)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-cyan/40 min-h-[120px]"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm w-fit"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="flex gap-2.5">
            <Button variant="ghost" size="sm" disabled={creating} onClick={() => createPost("DRAFT")}>
              <Plus size={14} /> Save draft
            </Button>
            <Button variant="primary" size="sm" disabled={creating} onClick={() => createPost("PUBLISHED")}>
              Publish
            </Button>
          </div>
        </div>
      </div>

      {!posts ? (
        <p className="text-ink-dim text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-ink-dim text-sm">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((p) => (
            <div key={p.id} className="glass p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h4 className="font-display text-[0.95rem] truncate">{p.title}</h4>
                  <span className={`text-[0.68rem] px-2 py-0.5 rounded-full ${p.status === "PUBLISHED" ? "bg-cyan/10 text-cyan" : "bg-white/5 text-ink-faint"}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-ink-faint text-xs">{p.category} · by {p.author?.name ?? "admin"}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(p)}>
                  {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </Button>
                <button onClick={() => remove(p.id)} className="text-ink-faint hover:text-red-400 p-2">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
