import { type NextRequest, NextResponse } from "next/server"
import { shareMovieToTelegram } from "@/lib/telegram-service"
import { rateLimitMiddleware } from "@/lib/security/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = rateLimitMiddleware(req)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Parse request body
    const body = await req.json()
    const { title, description, imageUrl, userVote } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title and description are required" },
        { status: 400 },
      )
    }

    // Share to Telegram
    const success = await shareMovieToTelegram(title, description, imageUrl, userVote)

    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to share to Telegram" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully shared to Telegram",
    })
  } catch (error) {
    console.error("Error sharing to Telegram:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to share to Telegram",
      },
      { status: 500 },
    )
  }
}
