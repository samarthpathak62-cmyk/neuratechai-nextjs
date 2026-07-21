import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });
  const datasets = await prisma.dataset.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ datasets });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    description?: string;
    sizeLabel?: string;
    license?: string;
    downloadUrl?: string;
  };
  if (!body.name || !body.description) {
    return Response.json({ error: "`name` and `description` are required." }, { status: 400 });
  }

  const dataset = await prisma.dataset.create({
    data: {
      name: body.name,
      description: body.description,
      sizeLabel: body.sizeLabel || "N/A",
      license: body.license || "Apache 2.0",
      downloadUrl: body.downloadUrl,
    },
  });
  return Response.json({ dataset }, { status: 201 });
}
