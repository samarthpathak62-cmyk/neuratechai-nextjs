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

  const papers = await prisma.researchPaper.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });
  return Response.json({ papers });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    summary?: string;
    tag?: string;
    category?: string;
    status?: "DRAFT" | "PUBLISHED";
  };

  if (!body.title || !body.summary) {
    return Response.json({ error: "`title` and `summary` are required." }, { status: 400 });
  }

  const slug = `${slugify(body.title)}-${Date.now().toString(36)}`;

  const paper = await prisma.researchPaper.create({
    data: {
      title: body.title,
      slug,
      summary: body.summary,
      tag: body.tag || "Preprint",
      category: body.category || "Papers",
      status: body.status || "DRAFT",
      authorId: admin.user.id,
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return Response.json({ paper }, { status: 201 });
}
