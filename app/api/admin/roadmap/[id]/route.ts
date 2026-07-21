import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }

  const { id } = await params;

  const body = (await req.json().catch(() => ({}))) as {
    status?: "NOW" | "NEXT" | "LATER" | "SHIPPED";
  };

  if (!body.status) {
    return Response.json(
      { error: "`status` is required." },
      { status: 400 }
    );
  }

  const item = await prisma.roadmapItem.update({
    where: { id },
    data: { status: body.status },
  });

  return Response.json({ item });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }

  const { id } = await params;

  await prisma.roadmapItem.delete({
    where: { id },
  });

  return Response.json({ ok: true });
}
