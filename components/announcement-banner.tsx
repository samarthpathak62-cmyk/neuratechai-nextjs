"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface Announcement {
  id: string;
  message: string;
  href: string | null;
  level: "info" | "success" | "warning";
}

const LEVEL_STYLES: Record<string, string> = {
  info: "bg-cyan/10 text-cyan border-cyan/25",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
};

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(true); // hidden until we know otherwise

  useEffect(() => {
    fetch("/api/announcement")
      .then((r) => r.json())
      .then((data) => {
        if (!data.announcement) return;
        const dismissedId = localStorage.getItem("neura-announcement-dismissed");
        setAnnouncement(data.announcement);
        setDismissed(dismissedId === data.announcement.id);
      })
      .catch(() => {});
  }, []);

  if (!announcement || dismissed) return null;

  function dismiss() {
    if (announcement) localStorage.setItem("neura-announcement-dismissed", announcement.id);
    setDismissed(true);
  }

  return (
    <div className={`relative z-[110] border-b px-4 py-2.5 text-center text-sm ${LEVEL_STYLES[announcement.level] ?? LEVEL_STYLES.info}`}>
      <span>{announcement.message}</span>
      {announcement.href && (
        <Link href={announcement.href} className="ml-2 underline underline-offset-2">
          Learn more
        </Link>
      )}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
