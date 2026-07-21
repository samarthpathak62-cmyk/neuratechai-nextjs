"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BillingPanel({
  tier,
  status,
  currentPeriodEnd,
}: {
  tier: string;
  status: string;
  currentPeriodEnd: string | null;
}) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else if (data.error) alert(data.error);
  }

  return (
    <div className="glass p-7">
      <h3 className="font-display text-[1.1rem] mb-5">Billing</h3>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-ink-dim text-sm">Current plan</span>
        <span className="font-mono text-cyan text-sm">{tier}</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-ink-dim text-sm">Status</span>
        <span className="font-mono text-sm">{status}</span>
      </div>
      {currentPeriodEnd && (
        <div className="flex items-center justify-between mb-5">
          <span className="text-ink-dim text-sm">Renews</span>
          <span className="font-mono text-sm">{new Date(currentPeriodEnd).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex gap-2.5 mt-5">
        {tier === "FREE" ? (
          <Link href="/pricing">
            <Button variant="primary" size="sm">Upgrade plan</Button>
          </Link>
        ) : (
          <Button variant="ghost" size="sm" onClick={openPortal} disabled={loading}>
            {loading ? "Opening…" : "Manage billing"}
          </Button>
        )}
      </div>
    </div>
  );
}
