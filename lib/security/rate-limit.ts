/**
 * Rate Limiting Utility
 *
 * Provides rate limiting functionality to prevent abuse of the voting system.
 * Uses a simple in-memory store for demo purposes. In production,will use Redis or similar.
 */

import { type NextRequest, NextResponse } from "next/server"

// In-memory store for rate limiting
// In production, use Redis or a database
const rateLimit = new Map<string, { count: number; timestamp: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5 // 5 requests per minute

/**
 * Rate limit middleware for API routes
 * @param req - Next.js request object
 * @returns NextResponse or null if the request should proceed
 */
export function rateLimitMiddleware(req: NextRequest): NextResponse | null {
  // Get client IP or a unique identifier
  const ip = req.ip || "unknown"

  // Get current timestamp
  const now = Date.now()

  // Get existing rate limit data for this IP
  const rateData = rateLimit.get(ip)

  // If no existing data or window has expired, create new entry
  if (!rateData || now - rateData.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now })
    return null // Allow request to proceed
  }

  // If within window but under limit, increment count
  if (rateData.count < MAX_REQUESTS_PER_WINDOW) {
    rateLimit.set(ip, { count: rateData.count + 1, timestamp: rateData.timestamp })
    return null // Allow request to proceed
  }

  // Rate limit exceeded
  return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
}

// Clean up old rate limit entries periodically
// In a real app, this would be handled by a cron job or similar
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimit.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)
