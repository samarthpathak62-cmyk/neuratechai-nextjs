"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Analytics {
  totalUsers: number;
  newUsers30d: number;
  totalRequests: number;
  requests7d: number;
  tierCounts: Record<string, number>;
  estimatedMrr: number;
  signupSeries: { date: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-ink-dim text-sm">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-[1.7rem] mb-1.5">Analytics</h1>
      <p className="text-ink-dim text-sm mb-8">Platform-wide usage and revenue snapshot.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Stat label="Total users" value={data.totalUsers.toString()} />
        <Stat label="New users (30d)" value={data.newUsers30d.toString()} />
        <Stat label="Total API requests" value={data.totalRequests.toString()} />
        <Stat label="Requests (7d)" value={data.requests7d.toString()} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass p-7">
          <h3 className="font-display text-[1.05rem] mb-4">Estimated MRR</h3>
          <div className="font-mono text-3xl text-cyan font-bold">
            ${data.estimatedMrr.toLocaleString()}
          </div>
          <p className="text-ink-faint text-xs mt-2">Based on active subscriptions × plan price.</p>
        </div>
        <div className="glass p-7">
          <h3 className="font-display text-[1.05rem] mb-4">Subscribers by plan</h3>
          <div className="flex flex-col gap-2">
            {Object.entries(data.tierCounts).map(([tier, count]) => (
              <div key={tier} className="flex justify-between text-sm">
                <span className="text-ink-dim font-mono">{tier}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
            {Object.keys(data.tierCounts).length === 0 && (
              <p className="text-ink-faint text-sm">No subscriptions yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-7">
        <h3 className="font-display text-[1.05rem] mb-4">Signups — last 30 days</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data.signupSeries}>
            <defs>
              <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c6cf6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c6cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} stroke="#5c6480" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#5c6480" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
            <Tooltip contentStyle={{ background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#9aa4bc" }} />
            <Area type="monotone" dataKey="count" stroke="#7c6cf6" strokeWidth={2} fill="url(#signupGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-6 text-center">
      <div className="font-mono text-xl font-bold text-cyan">{value}</div>
      <div className="text-ink-faint text-xs uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}
