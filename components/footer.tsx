import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Github, MessageCircle, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-3 font-display font-bold mb-3.5">
              <Image src="/logo.png" alt="logo" width={30} height={30} />
              <span>
                Neura <span className="text-cyan">Tech AI</span>
              </span>
            </Link>
            <p className="text-ink-dim text-sm max-w-[280px]">
              Open and enterprise AI models, research, and tools for the next generation of
              builders.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { href: "/models", label: "Models" },
              { href: "/playground", label: "Playground" },
              { href: "/docs", label: "Documentation" },
              { href: "/research", label: "Research" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { href: "/team", label: "Team" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
              { href: "/team#hiring", label: "Careers" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { href: "/benchmarks", label: "Benchmarks" },
              { href: "/datasets", label: "Datasets" },
              { href: "/changelog", label: "Changelog" },
              { href: "/roadmap", label: "Roadmap" },
              { href: "/status", label: "Status" },
              { href: "/community", label: "Community" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms of Service" },
              { href: "#", label: "License" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-7 border-t border-white/[0.08] text-ink-faint text-sm">
          <span>© {new Date().getFullYear()} Neura Tech AI. All rights reserved.</span>
          <div className="flex gap-3.5">
            <SocialIcon href="#" label="GitHub"><Github size={16} /></SocialIcon>
            <SocialIcon href="#" label="Discord"><MessageCircle size={16} /></SocialIcon>
            <SocialIcon href="#" label="X"><Twitter size={15} /></SocialIcon>
            <SocialIcon href="#" label="LinkedIn"><Linkedin size={15} /></SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h5 className="text-[0.78rem] uppercase tracking-wider text-ink-faint mb-4">{title}</h5>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-ink-dim text-sm hover:text-cyan transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-ink-dim hover:text-cyan hover:border-cyan/40 hover:-translate-y-0.5 transition-all"
    >
      {children}
    </Link>
  );
}
