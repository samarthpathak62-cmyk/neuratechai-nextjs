import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "live" | "soon" | "neutral";
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  const styles = {
    live: "bg-cyan/10 text-cyan border-cyan/30",
    soon: "bg-violet/10 text-violet border-violet/30",
    neutral: "bg-white/5 text-ink-dim border-white/10",
  }[variant];

  return (
    <span
      className={cn(
        "font-mono text-[0.68rem] uppercase tracking-wider px-2.5 py-1 rounded-full border",
        styles,
        className
      )}
      {...props}
    />
  );
}
