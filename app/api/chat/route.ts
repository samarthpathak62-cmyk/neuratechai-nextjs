import { NextRequest } from "next/server";
import { chatCompletion, LiteLLMConfigError, LiteLLMRequestError } from "@/lib/litellm";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { resolveUserId, logUsage } from "@/lib/api-auth";
import type { ChatRequestBody } from "@/types/chat";

export const runtime = "nodejs";

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const identifier = getClientIdentifier(req);
  const rate = checkRateLimit(identifier);
  if (!rate.allowed) {
    return Response.json(
      { error: "Rate limit exceeded. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString() },
      }
    );
  }

  // --- Request validation ---
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  if (!body.model || typeof body.model !== "string") {
    return badRequest("`model` is required and must be a string.");
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return badRequest("`messages` is required and must be a non-empty array.");
  }
  for (const m of body.messages) {
    if (!m.role || !m.content) {
      return badRequest("Each message requires `role` and `content`.");
    }
  }

  const wantsStream = body.stream !== false; // default to streaming

  // --- Call the gateway ---
  try {
    const upstream = await chatCompletion(
      {
        model: body.model,
        messages: body.messages,
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 2048,
        stream: wantsStream,
      },
      req.signal
    );

    // Fire-and-forget: attribute this call to a user for the dashboard's
    // usage counter, if the request was authenticated (session or API key).
    // Anonymous Playground demo traffic is intentionally not logged here.
    resolveUserId(req).then((userId) => {
      if (userId) logUsage({ userId, model: body.model, endpoint: "chat" });
    });

    if (wantsStream && upstream.body) {
      // Pass the SSE stream straight through to the client.
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const data = await upstream.json();
    return Response.json(data);
  } catch (err) {
    if (err instanceof LiteLLMConfigError) {
      // eslint-disable-next-line no-console
      console.error("[api/chat] configuration error:", err.message);
      return Response.json(
        { error: "Server is not configured to reach the model gateway." },
        { status: 500 }
      );
    }
    if (err instanceof LiteLLMRequestError) {
      return Response.json(
        { error: "The model provider returned an error." },
        { status: err.status >= 500 ? 502 : err.status }
      );
    }
    // eslint-disable-next-line no-console
    console.error("[api/chat] unexpected error:", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
