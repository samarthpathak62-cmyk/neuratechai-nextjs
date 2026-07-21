import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ApiKeysPanel } from "@/components/dashboard/api-keys-panel";
import { BillingPanel } from "@/components/dashboard/billing-panel";
import { UsageGraph } from "@/components/dashboard/usage-graph";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  // middleware.ts already guarantees a session exists for this route,
  // but we re-check here since this is also the source of the user's data.
  const session = await auth();
  if (!session?.user) return null;

  const [user, apiKeys, usageCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    }),
    prisma.apiKey.findMany({
      where: { userId: session.user.id, revoked: false },
      select: { id: true, name: true, keyPreview: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.usageLog.count({ where: { userId: session.user.id } }),
  ]);

  const tier = user?.subscription?.tier ?? "FREE";
  const status = user?.subscription?.status ?? "ACTIVE";
  const currentPeriodEnd = user?.subscription?.currentPeriodEnd?.toISOString() ?? null;

  return (
    <>
      <Navbar />
      <section className="relative z-10 py-16">
        <div className="max-w-[1000px] mx-auto px-6 md:px-8">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-[2rem] mb-1.5">Welcome, {user?.name ?? "there"}</h1>
              <p className="text-ink-dim text-sm">{user?.email}</p>
            </div>
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="ghost" size="sm"><ShieldCheck size={14} /> Admin panel</Button>
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <StatBox label="Plan" value={tier} />
            <StatBox label="Requests logged" value={usageCount.toString()} />
            <StatBox label="Active API keys" value={apiKeys.length.toString()} />
          </div>

          <div className="mb-6">
            <UsageGraph />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <BillingPanel tier={tier} status={status} currentPeriodEnd={currentPeriodEnd} />
            <ApiKeysPanel
              initialKeys={apiKeys.map((k) => ({ ...k, createdAt: k.createdAt.toISOString() }))}
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-6 text-center">
      <div className="font-mono text-xl font-bold text-cyan">{value}</div>
      <div className="text-ink-faint text-xs uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}
