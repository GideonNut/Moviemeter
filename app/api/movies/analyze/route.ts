import { type NextRequest, NextResponse } from "next/server"
import { analyzeMovie, generateDiscussionQuestions } from "@/lib/groq-service"
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
    const { title } = body

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Movie title is required",
        },
        { status: 400 },
      )
    }

    // Get movie analysis and discussion questions in parallel
    const [analysis, questions] = await Promise.all([analyzeMovie(title), generateDiscussionQuestions(title, 3)])

    return NextResponse.json({
      success: true,
      analysis,
      questions,
    })
  } catch (error) {
    console.error("Error in movie analysis API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze movie",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
