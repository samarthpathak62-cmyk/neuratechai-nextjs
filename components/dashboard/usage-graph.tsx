"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Point {
  date: string;
  count: number;
}

export function UsageGraph() {
  const [series, setSeries] = useState<Point[] | null>(null);

  useEffect(() => {
    fetch("/api/usage/timeseries")
      .then((r) => r.json())
      .then((data) => setSeries(data.series ?? []));
  }, []);

  return (
    <div className="glass p-7">
      <h3 className="font-display text-[1.1rem] mb-5">Usage — last 14 days</h3>
      {!series ? (
        <div className="h-[220px] flex items-center justify-center text-ink-faint text-sm">Loading…</div>
      ) : series.every((p) => p.count === 0) ? (
        <div className="h-[220px] flex items-center justify-center text-ink-faint text-sm">
          No API requests yet — usage will appear here once you start calling the API.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={series}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#35d4ff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#35d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => d.slice(5)}
              stroke="#5c6480"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#5c6480" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
            <Tooltip
              contentStyle={{ background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#9aa4bc" }}
            />
            <Area type="monotone" dataKey="count" stroke="#35d4ff" strokeWidth={2} fill="url(#usageGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
