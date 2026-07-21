"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Tab = "changelog" | "roadmap" | "datasets" | "benchmarks" | "status" | "announcement";
const TABS: { id: Tab; label: string }[] = [
  { id: "announcement", label: "Announcement" },
  { id: "changelog", label: "Changelog" },
  { id: "roadmap", label: "Roadmap" },
  { id: "datasets", label: "Datasets" },
  { id: "benchmarks", label: "Benchmarks" },
  { id: "status", label: "Status" },
];

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>("changelog");

  return (
    <div>
      <h1 className="font-display text-[1.7rem] mb-1.5">Site content</h1>
      <p className="text-ink-dim text-sm mb-6">Manage changelog, roadmap, datasets, benchmarks, and status page.</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm border ${
              tab === t.id ? "bg-grad-brand text-[#04121a] font-semibold border-transparent" : "border-white/[0.08] text-ink-dim"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "changelog" && <ChangelogTab />}
      {tab === "roadmap" && <RoadmapTab />}
      {tab === "datasets" && <DatasetsTab />}
      {tab === "benchmarks" && <BenchmarksTab />}
      {tab === "status" && <StatusTab />}
    </div>
  );
}

function ChangelogTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ version: "", title: "", body: "", tag: "Feature" });

  function load() {
    fetch("/api/admin/changelog").then((r) => r.json()).then((d) => setItems(d.entries ?? []));
  }
  useEffect(load, []);

  async function create() {
    if (!form.version || !form.title || !form.body) return;
    await fetch("/api/admin/changelog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ version: "", title: "", body: "", tag: "Feature" });
    load();
  }
  async function remove(id: string) {
    await fetch(`/api/admin/changelog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="glass p-6 mb-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <input placeholder="Version (v2.4.0)" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm w-40" />
          <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm">
            {["Feature", "Fix", "Improvement", "Breaking"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm" />
        <textarea placeholder="Details" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm min-h-[80px]" />
        <Button variant="primary" size="sm" onClick={create} className="w-fit">Add entry</Button>
      </div>
      {items?.map((e) => (
        <Row key={e.id} title={`${e.version} — ${e.title}`} sub={e.tag} onDelete={() => remove(e.id)} />
      ))}
    </div>
  );
}

function RoadmapTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "LATER" });

  function load() {
    fetch("/api/admin/roadmap").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  }
  useEffect(load, []);

  async function create() {
    if (!form.title || !form.description) return;
    await fetch("/api/admin/roadmap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", description: "", status: "LATER" });
    load();
  }
  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/roadmap/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }
  async function remove(id: string) {
    await fetch(`/api/admin/roadmap/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="glass p-6 mb-6 flex flex-col gap-3">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm min-h-[70px]" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm w-fit">
          {["NOW", "NEXT", "LATER", "SHIPPED"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <Button variant="primary" size="sm" onClick={create} className="w-fit">Add item</Button>
      </div>
      {items?.map((i) => (
        <div key={i.id} className="glass p-5 mb-2 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h4 className="font-display text-[0.92rem]">{i.title}</h4>
            <p className="text-ink-faint text-xs truncate">{i.description}</p>
          </div>
          <div className="flex gap-2 items-center flex-shrink-0">
            <select value={i.status} onChange={(e) => updateStatus(i.id, e.target.value)} className="bg-panel border border-white/[0.08] rounded-md px-2 py-1 text-xs">
              {["NOW", "NEXT", "LATER", "SHIPPED"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => remove(i.id)} className="text-ink-faint hover:text-red-400 p-1.5"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DatasetsTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ name: "", description: "", sizeLabel: "", license: "Apache 2.0" });

  function load() {
    fetch("/api/admin/datasets").then((r) => r.json()).then((d) => setItems(d.datasets ?? []));
  }
  useEffect(load, []);

  async function create() {
    if (!form.name || !form.description) return;
    await fetch("/api/admin/datasets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", description: "", sizeLabel: "", license: "Apache 2.0" });
    load();
  }
  async function remove(id: string) {
    await fetch(`/api/admin/datasets/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="glass p-6 mb-6 flex flex-col gap-3">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm min-h-[70px]" />
        <div className="flex gap-3">
          <input placeholder="Size (1M samples)" value={form.sizeLabel} onChange={(e) => setForm({ ...form, sizeLabel: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm flex-1" />
          <input placeholder="License" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm flex-1" />
        </div>
        <Button variant="primary" size="sm" onClick={create} className="w-fit">Add dataset</Button>
      </div>
      {items?.map((d) => (
        <Row key={d.id} title={d.name} sub={`${d.sizeLabel} · ${d.license}`} onDelete={() => remove(d.id)} />
      ))}
    </div>
  );
}

function BenchmarksTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ modelName: "", suite: "", score: "" });

  function load() {
    fetch("/api/admin/benchmarks").then((r) => r.json()).then((d) => setItems(d.benchmarks ?? []));
  }
  useEffect(load, []);

  async function create() {
    if (!form.modelName || !form.suite || !form.score) return;
    await fetch("/api/admin/benchmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, score: parseFloat(form.score) }),
    });
    setForm({ modelName: "", suite: "", score: "" });
    load();
  }
  async function remove(id: string) {
    await fetch(`/api/admin/benchmarks/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="glass p-6 mb-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <input placeholder="Model (Neuron 14B)" value={form.modelName} onChange={(e) => setForm({ ...form, modelName: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm flex-1" />
          <input placeholder="Suite (MMLU)" value={form.suite} onChange={(e) => setForm({ ...form, suite: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm flex-1" />
          <input placeholder="Score" type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm w-24" />
        </div>
        <Button variant="primary" size="sm" onClick={create} className="w-fit">Add score</Button>
      </div>
      {items?.map((b) => (
        <Row key={b.id} title={`${b.modelName} — ${b.suite}`} sub={`${b.score}`} onDelete={() => remove(b.id)} />
      ))}
    </div>
  );
}

function StatusTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ name: "", status: "operational", uptimePct90d: "100" });

  function load() {
    fetch("/api/admin/status-components").then((r) => r.json()).then((d) => setItems(d.components ?? []));
  }
  useEffect(load, []);

  async function create() {
    if (!form.name) return;
    await fetch("/api/admin/status-components", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, uptimePct90d: parseFloat(form.uptimePct90d) }),
    });
    setForm({ name: "", status: "operational", uptimePct90d: "100" });
    load();
  }
  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/status-components", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  }

  return (
    <div>
      <div className="glass p-6 mb-6 flex flex-col gap-3">
        <input placeholder="Component name (Chat API)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm" />
        <div className="flex gap-3">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm">
            {["operational", "degraded", "outage"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <input placeholder="Uptime %" type="number" value={form.uptimePct90d} onChange={(e) => setForm({ ...form, uptimePct90d: e.target.value })} className="bg-panel border border-white/[0.08] rounded-md px-3 py-2 text-sm w-28" />
        </div>
        <Button variant="primary" size="sm" onClick={create} className="w-fit">Add component</Button>
      </div>
      {items?.map((c) => (
        <div key={c.id} className="glass p-5 mb-2 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-[0.92rem]">{c.name}</h4>
            <p className="text-ink-faint text-xs">{c.uptimePct90d}% uptime (90d)</p>
          </div>
          <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="bg-panel border border-white/[0.08] rounded-md px-2 py-1 text-xs">
            {["operational", "degraded", "outage"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

function Row({ title, sub, onDelete }: { title: string; sub: string; onDelete: () => void }) {
  return (
    <div className="glass p-5 mb-2 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h4 className="font-display text-[0.92rem] truncate">{title}</h4>
        <p className="text-ink-faint text-xs">{sub}</p>
      </div>
      <button onClick={onDelete} className="text-ink-faint hover:text-red-400 p-1.5 flex-shrink-0"><Trash2 size={14} /></button>
    </div>
  );
}
