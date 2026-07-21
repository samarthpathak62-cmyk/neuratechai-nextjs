import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });
  const items = await prisma.roadmapItem.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ items });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
    status?: "NOW" | "NEXT" | "LATER" | "SHIPPED";
  };
  if (!body.title || !body.description) {
    return Response.json({ error: "`title` and `description` are required." }, { status: 400 });
  }

  const item = await prisma.roadmapItem.create({
    data: {
      title: body.title,
      description: body.description,
      status: body.status || "LATER",
    },
  });
  return Response.json({ item }, { status: 201 });
}
