"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
}

export function StatCounter({ target, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);

  const display = Number.isInteger(target) ? Math.floor(value) : value.toFixed(1);

  return (
    <div ref={ref} className="bg-panel text-center py-8 px-5">
      <div className="font-mono text-2xl md:text-3xl font-bold text-cyan">
        {display}
        {suffix}
      </div>
      <div className="text-xs uppercase tracking-wider text-ink-faint mt-1.5">{label}</div>
    </div>
  );
}
