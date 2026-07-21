import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });
  const benchmarks = await prisma.benchmark.findMany({ orderBy: [{ modelName: "asc" }, { suite: "asc" }] });
  return Response.json({ benchmarks });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    modelName?: string;
    suite?: string;
    score?: number;
  };
  if (!body.modelName || !body.suite || typeof body.score !== "number") {
    return Response.json({ error: "`modelName`, `suite`, and numeric `score` are required." }, { status: 400 });
  }

  const benchmark = await prisma.benchmark.create({
    data: { modelName: body.modelName, suite: body.suite, score: body.score },
  });
  return Response.json({ benchmark }, { status: 201 });
}
