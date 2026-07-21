"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    // Auto sign-in right after registration.
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <section className="relative z-10 min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <div className="glass p-9">
            <h1 className="font-display text-[1.6rem] mb-1.5 text-center">Create your account</h1>
            <p className="text-ink-dim text-sm text-center mb-8">Get API access and start building</p>

            <OAuthButtons callbackUrl="/dashboard" />

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-ink-faint text-xs uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.78rem] uppercase tracking-wider text-ink-faint mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[0.78rem] uppercase tracking-wider text-ink-faint mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-[0.78rem] uppercase tracking-wider text-ink-faint mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-panel border border-white/[0.08] rounded-md px-3.5 py-3 outline-none focus:border-cyan/40"
                  placeholder="At least 8 characters"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button variant="primary" type="submit" disabled={loading} className="w-full justify-center mt-1">
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="text-center text-ink-dim text-sm mt-7">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
