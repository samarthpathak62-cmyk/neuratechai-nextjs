"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  summary: string;
  tag: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  author: { name: string | null };
}

const CATEGORIES = ["Papers", "Projects", "Datasets", "Experiments"];

export default function AdminResearchPage() {
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", tag: "", category: "Papers" });

  function load() {
    fetch("/api/admin/research")
      .then((r) => r.json())
      .then((d) => setPapers(d.papers ?? []));
  }

  useEffect(load, []);

  async function create(status: "DRAFT" | "PUBLISHED") {
    if (!form.title || !form.summary) return;
    setCreating(true);
    const res = await fetch("/api/admin/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });
    setCreating(false);
    if (res.ok) {
      setForm({ title: "", summary: "", tag: "", category: "Papers" });
      load();
    }
  }

  async function toggleStatus(paper: Paper) {
    const newStatus = paper.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/admin/research/${paper.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/admin/research/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-[1.7rem] mb-1.5">Research CMS</h1>
      <p className="text-ink-dim text-sm mb-8">Manage papers, projects, datasets, and experiments shown on /research.</p>

      <div className="glass p-7 mb-8">
        <h3 className="font-display text-[1.05rem] mb-4">New entry</h3>
        <div className="flex flex-col gap-3">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-cyan/40" />
          <input placeholder="Tag (e.g. NeurIPS 2026, arXiv preprint)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-cyan/40" />
          <textarea placeholder="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-cyan/40 min-h-[100px]" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm w-fit">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2.5">
            <Button variant="ghost" size="sm" disabled={creating} onClick={() => create("DRAFT")}><Plus size={14} /> Save draft</Button>
            <Button variant="primary" size="sm" disabled={creating} onClick={() => create("PUBLISHED")}>Publish</Button>
          </div>
        </div>
      </div>

      {!papers ? (
        <p className="text-ink-dim text-sm">Loading…</p>
      ) : papers.length === 0 ? (
        <p className="text-ink-dim text-sm">No entries yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {papers.map((p) => (
            <div key={p.id} className="glass p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h4 className="font-display text-[0.95rem] truncate">{p.title}</h4>
                  <span className={`text-[0.68rem] px-2 py-0.5 rounded-full ${p.status === "PUBLISHED" ? "bg-cyan/10 text-cyan" : "bg-white/5 text-ink-faint"}`}>{p.status}</span>
                </div>
                <p className="text-ink-faint text-xs">{p.category} · {p.tag}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(p)}>{p.status === "PUBLISHED" ? "Unpublish" : "Publish"}</Button>
                <button onClick={() => remove(p.id)} className="text-ink-faint hover:text-red-400 p-2"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
