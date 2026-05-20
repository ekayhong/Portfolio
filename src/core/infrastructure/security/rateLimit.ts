type RateLimitEntry = {
  timestamps: number[];
};

const bucketByKey = new Map<string, RateLimitEntry>();

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = bucketByKey.get(key) ?? { timestamps: [] };
  const timestamps = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);

  if (timestamps.length >= limit) {
    const retryAfterMs = windowMs - (now - timestamps[0]);
    bucketByKey.set(key, { timestamps });
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  bucketByKey.set(key, { timestamps });
  return { allowed: true as const };
}