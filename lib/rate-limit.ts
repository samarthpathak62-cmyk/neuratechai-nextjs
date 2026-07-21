/**
 * lib/rate-limit.ts
 *
 * A minimal fixed-window rate limiter keyed by IP, kept in memory.
 *
 * This is fine for a single Node.js server or local development. On
 * Vercel (serverless, multiple instances) or any multi-instance
 * deployment, replace this with a shared store — e.g. Upstash Redis
 * (`@upstash/ratelimit`) — so limits are enforced across instances.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30; // requests per window per IP

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - existing.count,
    resetAt: existing.resetAt,
  };
}

export function getClientIdentifier(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
