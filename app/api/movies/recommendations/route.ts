import { type NextRequest, NextResponse } from "next/server"
import { getMovieRecommendations } from "@/lib/ai-agent"

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()
    const { preferences } = body

    if (!preferences) {
      return NextResponse.json(
        {
          success: false,
          message: "User preferences are required",
        },
        { status: 400 },
      )
    }

    // Get movie recommendations using the AI agent
    const recommendations = await getMovieRecommendations(preferences)

    return NextResponse.json({
      success: true,
      message: `Found ${recommendations.length} movie recommendations`,
      data: recommendations,
    })
  } catch (error) {
    console.error("Error in recommendations API route:", error)
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
