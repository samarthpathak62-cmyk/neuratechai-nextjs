import crypto from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function hashKey(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Resolves the calling user from either:
 *  - a signed-in session (browser requests from the Playground), or
 *  - an `Authorization: Bearer sk-neura-...` API key (programmatic access).
 *
 * Returns null for anonymous requests — callers decide whether to allow
 * anonymous access (e.g. Playground demo) or require one of the above.
 */
export async function resolveUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer sk-neura-")) {
    const raw = authHeader.replace("Bearer ", "").trim();
    const keyHash = hashKey(raw);
    const apiKey = await prisma.apiKey.findUnique({ where: { keyHash } });
    if (apiKey && !apiKey.revoked) {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });
      return apiKey.userId;
    }
    return null; // invalid/revoked key — treat as unauthenticated, not silently anonymous
  }

  const session = await auth();
  return session?.user?.id ?? null;
}

export async function logUsage(params: {
  userId: string;
  model: string;
  endpoint: string;
  tokensIn?: number;
  tokensOut?: number;
}) {
  try {
    await prisma.usageLog.create({
      data: {
        userId: params.userId,
        model: params.model,
        endpoint: params.endpoint,
        tokensIn: params.tokensIn ?? 0,
        tokensOut: params.tokensOut ?? 0,
      },
    });
  } catch (err) {
    // Usage logging should never break the actual request.
    // eslint-disable-next-line no-console
    console.error("[usage] failed to log usage:", err);
  }
}
