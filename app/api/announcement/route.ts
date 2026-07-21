import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const announcement = await prisma.announcement.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ announcement });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as {
    message?: string;
    href?: string;
    level?: "info" | "success" | "warning";
  };
  if (!body.message) return Response.json({ error: "`message` is required." }, { status: 400 });

  // Only one announcement is shown at a time — deactivate any existing ones.
  await prisma.announcement.updateMany({ where: { active: true }, data: { active: false } });

  const announcement = await prisma.announcement.create({
    data: { message: body.message, href: body.href, level: body.level || "info", active: true },
  });

  return Response.json({ announcement }, { status: 201 });
}

export async function DELETE() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  await prisma.announcement.updateMany({ where: { active: true }, data: { active: false } });
  return Response.json({ ok: true });
}
