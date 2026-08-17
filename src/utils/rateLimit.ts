/**
 * Minimal in-process sliding-window rate limiter.
 *
 * Scope: this counts per server instance, which is enough for a single Node
 * process (our current deployment). If the app is ever scaled horizontally or
 * moved to serverless, replace the Map with Redis — `.env.example` already
 * reserves REDIS_URL for exactly this.
 */

type Hits = number[];

const buckets = new Map<string, Hits>();

// Stop the map growing without bound on a long-running server.
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry (0 when allowed). */
  retryAfter: number;
  remaining: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0];
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
      remaining: 0,
    };
  }

  recent.push(now);

  if (buckets.size > MAX_KEYS) {
    // Cheap eviction: drop keys whose window has fully expired.
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
      if (buckets.size <= MAX_KEYS) break;
    }
  }
  buckets.set(key, recent);

  return { allowed: true, retryAfter: 0, remaining: limit - recent.length };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
