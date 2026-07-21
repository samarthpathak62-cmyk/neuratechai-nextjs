import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 13); // last 14 days

  const logs = await prisma.usageLog.findMany({
    where: { userId: session.user.id, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  // Bucket into day-by-day counts so the chart always has 14 points,
  // including days with zero requests.
  const buckets = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const log of logs) {
    const key = log.createdAt.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const series = Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
  return Response.json({ series });
}
