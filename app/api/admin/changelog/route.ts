import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });
  const entries = await prisma.changelogEntry.findMany({ orderBy: { publishedAt: "desc" } });
  return Response.json({ entries });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    version?: string;
    title?: string;
    body?: string;
    tag?: string;
  };
  if (!body.version || !body.title || !body.body) {
    return Response.json({ error: "`version`, `title`, and `body` are required." }, { status: 400 });
  }

  const entry = await prisma.changelogEntry.create({
    data: {
      version: body.version,
      title: body.title,
      body: body.body,
      tag: body.tag || "Feature",
    },
  });
  return Response.json({ entry }, { status: 201 });
}
