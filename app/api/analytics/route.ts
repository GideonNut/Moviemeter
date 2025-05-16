import { type NextRequest, NextResponse } from "next/server"
import { getAnalytics } from "@/lib/analytics"

// Simple admin-only API route
// In production, use proper authentication
export async function GET(req: NextRequest) {
  try {
    // Very basic auth check - use proper auth in production
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    // In production, validate this token properly
    if (token !== "your-secret-admin-token") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const analytics = getAnalytics()

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

