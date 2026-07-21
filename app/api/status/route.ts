import { prisma } from "@/lib/prisma";

async function pingLiteLLM(): Promise<"operational" | "degraded" | "outage"> {
  const base = process.env.LITELLM_BASE_URL;
  if (!base) return "outage";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${base}/health/liveliness`, { signal: controller.signal }).catch(
      () => fetch(base, { signal: controller.signal }) // fallback if /health isn't exposed
    );
    clearTimeout(timeout);
    return res.ok ? "operational" : "degraded";
  } catch {
    return "outage";
  }
}

export async function GET() {
  const [components, gatewayStatus] = await Promise.all([
    prisma.statusComponent.findMany({ orderBy: { name: "asc" } }),
    pingLiteLLM(),
  ]);

  const live = [
    { name: "LiteLLM Gateway", status: gatewayStatus, uptimePct90d: null, live: true },
    ...components.map((c) => ({
      name: c.name,
      status: c.status,
      uptimePct90d: c.uptimePct90d,
      live: false,
      updatedAt: c.updatedAt,
    })),
  ];

  const overall = live.some((c) => c.status === "outage")
    ? "outage"
    : live.some((c) => c.status === "degraded")
    ? "degraded"
    : "operational";

  return Response.json({ overall, components: live, checkedAt: new Date().toISOString() });
}
