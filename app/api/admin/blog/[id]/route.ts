import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    status?: "DRAFT" | "PUBLISHED";
  };

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) return Response.json({ error: "Post not found." }, { status: 404 });

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existing.title,
      excerpt: body.excerpt ?? existing.excerpt,
      content: body.content ?? existing.content,
      category: body.category ?? existing.category,
      status: body.status ?? existing.status,
      publishedAt:
        body.status === "PUBLISHED" && existing.status !== "PUBLISHED"
          ? new Date()
          : existing.publishedAt,
    },
  });

  return Response.json({ post });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  await prisma.blogPost.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
