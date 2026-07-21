import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { PLANS } from "@/lib/stripe";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);
  const since7d = new Date();
  since7d.setDate(since7d.getDate() - 7);

  const [
    totalUsers,
    newUsers30d,
    totalRequests,
    requests7d,
    subsByTier,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since30d } } }),
    prisma.usageLog.count(),
    prisma.usageLog.count({ where: { createdAt: { gte: since7d } } }),
    prisma.subscription.groupBy({ by: ["tier"], _count: { tier: true } }),
    prisma.user.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  const priceByTier: Record<string, number> = Object.fromEntries(
    PLANS.filter((p) => p.monthlyUsd !== null).map((p) => [p.tier, p.monthlyUsd as number])
  );

  const tierCounts: Record<string, number> = {};
  let estimatedMrr = 0;
  for (const row of subsByTier) {
    tierCounts[row.tier] = row._count.tier;
    estimatedMrr += (priceByTier[row.tier] ?? 0) * row._count.tier;
  }

  // Bucket signups from the last 30 days into a daily series for a chart.
  const signupBuckets = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since30d);
    d.setDate(d.getDate() + i);
    signupBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const u of recentSignups) {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (signupBuckets.has(key)) signupBuckets.set(key, (signupBuckets.get(key) ?? 0) + 1);
  }
  const signupSeries = Array.from(signupBuckets.entries()).map(([date, count]) => ({ date, count }));

  return Response.json({
    totalUsers,
    newUsers30d,
    totalRequests,
    requests7d,
    tierCounts,
    estimatedMrr,
    signupSeries,
  });
}
