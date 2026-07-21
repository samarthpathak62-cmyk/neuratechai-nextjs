"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Plus } from "lucide-react";

interface KeyRow {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
}

export function ApiKeysPanel({ initialKeys }: { initialKeys: KeyRow[] }) {
  const [keys, setKeys] = useState<KeyRow[]>(initialKeys);
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function createKey() {
    setCreating(true);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `Key ${keys.length + 1}` }),
    });
    const data = await res.json();
    setCreating(false);
    if (data.key) {
      setKeys((prev) => [data.key, ...prev]);
      setNewKeyRaw(data.raw);
    }
  }

  async function revokeKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="glass p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-[1.1rem]">API Keys</h3>
        <Button variant="ghost" size="sm" onClick={createKey} disabled={creating}>
          <Plus size={14} /> {creating ? "Creating…" : "New key"}
        </Button>
      </div>

      {newKeyRaw && (
        <div className="mb-5 p-4 rounded-md bg-cyan/[0.08] border border-cyan/25">
          <p className="text-sm text-cyan mb-2">Copy this key now — it won&apos;t be shown again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-xs bg-void px-3 py-2 rounded-md overflow-x-auto">{newKeyRaw}</code>
            <button
              onClick={() => navigator.clipboard.writeText(newKeyRaw)}
              className="w-8 h-8 rounded-md bg-white/[0.06] flex items-center justify-center text-ink-dim hover:text-cyan flex-shrink-0"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      )}

      {keys.length === 0 ? (
        <p className="text-ink-dim text-sm">No API keys yet. Create one to call the API programmatically.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between px-4 py-3 rounded-md bg-white/[0.03] border border-white/[0.06]">
              <div>
                <div className="text-sm">{k.name}</div>
                <div className="font-mono text-xs text-ink-faint">sk-neura-...{k.keyPreview}</div>
              </div>
              <button onClick={() => revokeKey(k.id)} className="text-ink-faint hover:text-red-400 p-1.5">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
