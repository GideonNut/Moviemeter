import { type NextRequest, NextResponse } from "next/server"
import { getPersonalizedRecommendations } from "@/lib/groq-service"
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
    const { preferences, count = 3 } = body

    if (!preferences) {
      return NextResponse.json(
        {
          success: false,
          message: "User preferences are required",
        },
        { status: 400 },
      )
    }

    // Get recommendations from Groq
    const recommendations = await getPersonalizedRecommendations(preferences, count)

    return NextResponse.json({
      success: true,
      message: `Found ${recommendations.length} movie recommendations`,
      data: recommendations,
    })
  } catch (error) {
    console.error("Error in Groq recommendations API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get movie recommendations",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
