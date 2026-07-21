"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/models", label: "Models" },
  { href: "/pricing", label: "Pricing" },
  { href: "/playground", label: "Playground" },
  { href: "/research", label: "Research" },
  { href: "/docs", label: "Documentation" },
  { href: "/blog", label: "Blog" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-[100] border-b border-white/[0.08] bg-void/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-[1240px] mx-auto px-6 md:px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-display font-bold text-[1.05rem]">
          <Image src="/logo.png" alt="Neura Tech AI logo" width={34} height={34} className="object-contain" />
          <span>
            Neura <span className="text-cyan">Tech AI</span>
          </span>
        </Link>

        <ul className="hidden lg:flex gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-3.5 py-2 rounded-md text-[0.92rem] text-ink-dim transition-colors hover:text-ink hover:bg-white/[0.04]",
                  pathname === item.href && "text-ink bg-white/[0.04]"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2.5">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard size={14} /> Dashboard
                </Button>
              </Link>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "Account"}
                  width={32}
                  height={32}
                  className="rounded-full border border-white/[0.08]"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] text-ink-dim flex items-center justify-center hover:text-cyan"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/playground">
                <Button variant="primary" size="sm">Try Playground</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-ink"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden flex flex-col gap-1 px-6 pb-4 border-b border-white/[0.08] bg-void/95">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-3.5 py-2.5 rounded-md text-sm text-ink-dim",
                pathname === item.href && "text-ink bg-white/[0.04]"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/playground" onClick={() => setOpen(false)} className="mt-2">
            <Button variant="primary" size="sm" className="w-full">
              Try Playground
            </Button>
          </Link>
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full mt-2">Dashboard</Button>
              </Link>
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="mt-2 text-sm text-ink-dim text-left px-3.5 py-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full mt-2">Sign in</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
