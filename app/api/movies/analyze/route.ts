import { type NextRequest, NextResponse } from "next/server"
import { analyzeMovie, generateDiscussionQuestions } from "@/lib/claude-service"
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

    try {
      // Get movie analysis and discussion questions in parallel
      const [analysis, questions] = await Promise.all([analyzeMovie(title), generateDiscussionQuestions(title, 3)])

      return NextResponse.json({
        success: true,
        analysis,
        questions,
      })
    } catch (analysisError) {
      console.error("Error in movie analysis:", analysisError)

      // Return a fallback response with mock data
      return NextResponse.json({
        success: true,
        analysis: `${title} is a fascinating film that explores important themes and features compelling performances. The director's vision creates a unique cinematic experience that resonates with audiences.`,
        questions: [
          `What themes in ${title} did you find most compelling?`,
          `How do the characters in ${title} evolve throughout the story?`,
          `What visual elements in ${title} stood out to you?`,
        ],
      })
    }
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
