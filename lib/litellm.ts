/**
 * lib/litellm.ts
 *
 * This is the ONLY module in the entire codebase that is allowed to
 * construct a request to the LiteLLM gateway. Every API route imports
 * from here instead of calling `fetch` directly, so provider logic
 * never leaks into route handlers or — worse — the client.
 *
 * Required env vars (see .env.example):
 *   LITELLM_BASE_URL   e.g. http://localhost:4000
 *   LITELLM_API_KEY    optional, only if LiteLLM auth is enabled
 */

const LITELLM_BASE_URL = process.env.LITELLM_BASE_URL;
const LITELLM_API_KEY = process.env.LITELLM_API_KEY;

export class LiteLLMConfigError extends Error {}
export class LiteLLMRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function assertConfigured() {
  if (!LITELLM_BASE_URL) {
    throw new LiteLLMConfigError(
      "LITELLM_BASE_URL is not set. Add it to .env.local — see .env.example."
    );
  }
}

function authHeaders(): Record<string, string> {
  return LITELLM_API_KEY ? { Authorization: `Bearer ${LITELLM_API_KEY}` } : {};
}

/**
 * Low-level POST to a LiteLLM endpoint. Every public helper below funnels
 * through this so logging, error handling, and auth stay in one place.
 */
async function litellmFetch(path: string, body: unknown, signal?: AbortSignal) {
  assertConfigured();

  const res = await fetch(`${LITELLM_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // eslint-disable-next-line no-console
    console.error(`[litellm] ${path} failed: ${res.status} ${text}`);
    throw new LiteLLMRequestError(
      text || `LiteLLM request to ${path} failed`,
      res.status
    );
  }

  return res;
}

/** Chat completions — supports streaming (SSE passthrough) or a single JSON response. */
export async function chatCompletion(body: unknown, signal?: AbortSignal) {
  return litellmFetch("/chat/completions", body, signal);
}

/** Vision-capable chat completion (image + text content blocks). */
export async function visionCompletion(body: unknown, signal?: AbortSignal) {
  return litellmFetch("/chat/completions", body, signal);
}

/** Image generation endpoint. */
export async function imageGeneration(body: unknown, signal?: AbortSignal) {
  return litellmFetch("/images/generations", body, signal);
}

/** Embeddings endpoint. */
export async function embeddings(body: unknown, signal?: AbortSignal) {
  return litellmFetch("/embeddings", body, signal);
}

/** Audio transcription endpoint. */
export async function audioTranscription(body: unknown, signal?: AbortSignal) {
  return litellmFetch("/audio/transcriptions", body, signal);
}
