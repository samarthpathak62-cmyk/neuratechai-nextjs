import { NextRequest } from "next/server";
import { imageGeneration, LiteLLMConfigError, LiteLLMRequestError } from "@/lib/litellm";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import type { ImageGenerationRequestBody } from "@/types/chat";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req);
  const rate = checkRateLimit(identifier);
  if (!rate.allowed) {
    return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body: ImageGenerationRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.model || !body.prompt) {
    return Response.json({ error: "`model` and `prompt` are required." }, { status: 400 });
  }

  try {
    const upstream = await imageGeneration(
      { model: body.model, prompt: body.prompt, size: body.size ?? "1024x1024", n: body.n ?? 1 },
      req.signal
    );
    const data = await upstream.json();
    return Response.json(data);
  } catch (err) {
    if (err instanceof LiteLLMConfigError) {
      return Response.json({ error: "Model gateway is not configured." }, { status: 500 });
    }
    if (err instanceof LiteLLMRequestError) {
      return Response.json({ error: "Image provider error." }, { status: err.status >= 500 ? 502 : err.status });
    }
    // eslint-disable-next-line no-console
    console.error("[api/image] unexpected error:", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
