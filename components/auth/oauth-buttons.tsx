"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.74Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.27 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.27a12 12 0 0 0 0 10.8l4-3.1Z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.6l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05a9.29 9.29 0 0 1 2.5-.35c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.43.21 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

export function OAuthButtons({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  async function handleSignIn(provider: "google" | "github") {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => handleSignIn("google")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-3 w-full py-3 rounded-md bg-white text-[#1a1a1a] font-medium text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        <GoogleIcon /> {loading === "google" ? "Redirecting…" : "Continue with Google"}
      </button>
      <button
        onClick={() => handleSignIn("github")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-3 w-full py-3 rounded-md bg-[#171515] border border-white/[0.12] text-white font-medium text-sm hover:bg-[#222] disabled:opacity-60 transition-colors"
      >
        <GitHubIcon /> {loading === "github" ? "Redirecting…" : "Continue with GitHub"}
      </button>
    </div>
  );
}
