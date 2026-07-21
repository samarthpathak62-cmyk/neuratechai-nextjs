import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });
  const components = await prisma.statusComponent.findMany({ orderBy: { name: "asc" } });
  return Response.json({ components });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    status?: string;
    uptimePct90d?: number;
  };
  if (!body.name) return Response.json({ error: "`name` is required." }, { status: 400 });

  const component = await prisma.statusComponent.create({
    data: {
      name: body.name,
      status: body.status || "operational",
      uptimePct90d: body.uptimePct90d ?? 100,
    },
  });
  return Response.json({ component }, { status: 201 });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
    uptimePct90d?: number;
  };
  if (!body.id) return Response.json({ error: "`id` is required." }, { status: 400 });

  const component = await prisma.statusComponent.update({
    where: { id: body.id },
    data: {
      status: body.status,
      uptimePct90d: body.uptimePct90d,
    },
  });
  return Response.json({ component });
}
