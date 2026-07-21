import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }

  const { id } = await params;

  await prisma.dataset.delete({
    where: { id },
  });

  return Response.json({ ok: true });
}
