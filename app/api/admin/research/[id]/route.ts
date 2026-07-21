import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    summary?: string;
    tag?: string;
    category?: string;
    status?: "DRAFT" | "PUBLISHED";
  };

  const existing = await prisma.researchPaper.findUnique({ where: { id: params.id } });
  if (!existing) return Response.json({ error: "Paper not found." }, { status: 404 });

  const paper = await prisma.researchPaper.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existing.title,
      summary: body.summary ?? existing.summary,
      tag: body.tag ?? existing.tag,
      category: body.category ?? existing.category,
      status: body.status ?? existing.status,
      publishedAt:
        body.status === "PUBLISHED" && existing.status !== "PUBLISHED"
          ? new Date()
          : existing.publishedAt,
    },
  });

  return Response.json({ paper });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  await prisma.researchPaper.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
