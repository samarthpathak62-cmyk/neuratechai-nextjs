import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      subscription: { select: { tier: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ users });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Admins only." }, { status: 403 });

  const { userId, role } = (await req.json().catch(() => ({}))) as {
    userId?: string;
    role?: "USER" | "ADMIN";
  };

  if (!userId || (role !== "USER" && role !== "ADMIN")) {
    return Response.json({ error: "`userId` and a valid `role` are required." }, { status: 400 });
  }

  // Prevent an admin from accidentally locking themselves out entirely —
  // not strictly necessary, but a nice safety net.
  if (userId === admin.user.id && role === "USER") {
    return Response.json({ error: "You can't remove your own admin access." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return Response.json({ user: updated });
}
