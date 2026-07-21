import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const { name, email, password } = body;

  if (!email || !email.includes("@")) {
    return badRequest("A valid email is required.");
  }
  if (!password || password.length < 8) {
    return badRequest("Password must be at least 8 characters.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return badRequest("An account with this email already exists. Try signing in instead.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name?.trim() || email.split("@")[0],
      email,
      passwordHash,
      subscription: {
        create: { tier: "FREE", status: "ACTIVE" },
      },
    },
    select: { id: true, name: true, email: true },
  });

  return Response.json({ user }, { status: 201 });
}
