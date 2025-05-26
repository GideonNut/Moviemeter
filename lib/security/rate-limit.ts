import { LRUCache } from "lru-cache"

export async function rateLimit(request: { ip?: string }) {
  const ip = request.ip || "127.0.0.1"

  const rateLimitCache = new LRUCache({
    max: 500,
    ttl: 60000, // 1 minute
  })

  const calls = rateLimitCache.get(ip) || 0
  if (calls > 10) {
    return {
      success: false,
      limit: 10,
      remaining: 0,
      reset: 60,
    }
  }

  rateLimitCache.set(ip, calls + 1)
  return {
    success: true,
    limit: 10,
    remaining: 10 - calls,
    reset: 60,
  }
}
