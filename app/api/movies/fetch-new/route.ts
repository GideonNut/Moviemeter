import { type NextRequest, NextResponse } from "next/server"
import { fetchNewMovies } from "@/lib/ai-agent"

export async function GET(req: NextRequest) {
  try {
    // Check for authorization (in a real app, you'd use proper auth)
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch new movies using the AI agent
    const newMovies = await fetchNewMovies()

    return NextResponse.json({
      success: true,
      message: `Successfully fetched ${newMovies.length} new movies`,
      data: newMovies,
    })
  } catch (error) {
    console.error("Error in fetch-new API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch new movies",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

