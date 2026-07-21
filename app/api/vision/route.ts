import { NextRequest } from "next/server";
import { visionCompletion, LiteLLMConfigError, LiteLLMRequestError } from "@/lib/litellm";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import type { VisionRequestBody } from "@/types/chat";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req);
  const rate = checkRateLimit(identifier);
  if (!rate.allowed) {
    return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body: VisionRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.model || !Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json(
      { error: "`model` and a non-empty `messages` array are required." },
      { status: 400 }
    );
  }

  try {
    const upstream = await visionCompletion(
      { model: body.model, messages: body.messages, max_tokens: body.max_tokens ?? 1024 },
      req.signal
    );
    const data = await upstream.json();
    return Response.json(data);
  } catch (err) {
    if (err instanceof LiteLLMConfigError) {
      return Response.json({ error: "Model gateway is not configured." }, { status: 500 });
    }
    if (err instanceof LiteLLMRequestError) {
      return Response.json({ error: "Vision provider error." }, { status: err.status >= 500 ? 502 : err.status });
    }
    // eslint-disable-next-line no-console
    console.error("[api/vision] unexpected error:", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
