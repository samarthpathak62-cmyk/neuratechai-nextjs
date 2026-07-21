"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function HFSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function sync() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/huggingface/sync", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setResult(res.ok ? `Synced ${data.synced} model(s).` : data.error ?? "Sync failed.");
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" onClick={sync} disabled={loading}>
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        {loading ? "Syncing…" : "Sync Hugging Face models"}
      </Button>
      {result && <span className="text-ink-faint text-xs">{result}</span>}
    </div>
  );
}
