import crypto from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function hashKey(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id, revoked: false },
    select: { id: true, name: true, keyPreview: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ keys });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = (await req.json().catch(() => ({}))) as { name?: string };

  const raw = `sk-neura-${crypto.randomBytes(24).toString("hex")}`;
  const keyHash = hashKey(raw);
  const keyPreview = raw.slice(-4);

  const key = await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name: name?.trim() || "Untitled key",
      keyHash,
      keyPreview,
    },
    select: { id: true, name: true, keyPreview: true, createdAt: true },
  });

  // The raw key is returned ONCE — it is never retrievable again after this response.
  return Response.json({ key, raw }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return Response.json({ error: "Key id is required." }, { status: 400 });

  await prisma.apiKey.updateMany({
    where: { id, userId: session.user.id },
    data: { revoked: true },
  });

  return Response.json({ ok: true });
}
