import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });
  return Response.json({ posts });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    status?: "DRAFT" | "PUBLISHED";
  };

  if (!body.title || !body.content) {
    return Response.json({ error: "`title` and `content` are required." }, { status: 400 });
  }

  const slug = `${slugify(body.title)}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt || body.content.slice(0, 160),
      content: body.content,
      category: body.category || "Company",
      status: body.status || "DRAFT",
      authorId: admin.user.id,
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return Response.json({ post }, { status: 201 });
}
