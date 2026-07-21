"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface Component {
  name: string;
  status: string;
  uptimePct90d: number | null;
  live: boolean;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "operational") return <CheckCircle2 size={16} className="text-cyan" />;
  if (status === "degraded") return <AlertTriangle size={16} className="text-yellow-400" />;
  return <XCircle size={16} className="text-red-400" />;
}

export default function StatusPage() {
  const [data, setData] = useState<{ overall: string; components: Component[]; checkedAt: string } | null>(null);

  useEffect(() => {
    const load = () => fetch("/api/status").then((r) => r.json()).then(setData);
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <header className="pt-40 pb-14 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> System Status</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">
            {data
              ? data.overall === "operational"
                ? "All systems operational"
                : data.overall === "degraded"
                ? "Partial degradation"
                : "Active outage"
              : "Checking systems…"}
          </h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Live status of the API gateway and platform components. Refreshes every 30 seconds.</p>
        </div>
      </header>

      <section className="relative z-10 py-14">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="glass overflow-hidden">
            {!data ? (
              <p className="text-ink-dim text-sm p-7 text-center">Loading…</p>
            ) : (
              data.components.map((c, i) => (
                <div key={c.name} className={`flex items-center justify-between px-7 py-5 ${i !== data.components.length - 1 ? "border-b border-white/[0.08]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <StatusIcon status={c.status} />
                    <span className="text-sm">{c.name}</span>
                    {c.live && <span className="text-[0.68rem] text-ink-faint uppercase tracking-wider">live check</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {c.uptimePct90d !== null && (
                      <span className="font-mono text-xs text-ink-faint">{c.uptimePct90d.toFixed(2)}% (90d)</span>
                    )}
                    <span className={`text-xs capitalize ${c.status === "operational" ? "text-cyan" : c.status === "degraded" ? "text-yellow-400" : "text-red-400"}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {data && <p className="text-ink-faint text-xs text-center mt-4">Last checked {new Date(data.checkedAt).toLocaleTimeString()}</p>}
        </div>
      </section>
      <Footer />
    </>
  );
}
