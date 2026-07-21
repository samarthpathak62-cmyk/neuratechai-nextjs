"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/blog", label: "Blog CMS" },
  { href: "/admin/research", label: "Research CMS" },
  { href: "/admin/content", label: "Site content" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "px-3.5 py-2.5 rounded-md text-sm text-ink-dim whitespace-nowrap hover:bg-white/[0.04] hover:text-ink",
            pathname === l.href && "bg-white/[0.04] text-ink"
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
