import { type NextRequest, NextResponse } from "next/server"
import { fetchTelegramRecommendations, fetchTelegramRecommendationsWithBot } from "@/lib/telegram-service"
import { rateLimitMiddleware } from "@/lib/security/rate-limit"

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = rateLimitMiddleware(req)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get limit from query params, default to 5
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "5", 10)

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 20) {
      return NextResponse.json({ error: "Invalid limit parameter. Must be between 1 and 20." }, { status: 400 })
    }

    // Check if we have a bot token
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    // Fetch recommendations from Telegram
    let recommendations
    if (botToken) {
      // Use the real bot implementation if we have a token
      recommendations = await fetchTelegramRecommendationsWithBot(limit)
    } else {
      // Fall back to mock data if no token is available
      recommendations = await fetchTelegramRecommendations(limit)
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    console.error("Error fetching Telegram recommendations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recommendations from Telegram",
      },
      { status: 500 },
    )
  }
}
