import { type NextRequest, NextResponse } from "next/server"
import { updateMovieInformation } from "@/lib/ai-agent"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check for authorization (in a real app, you'd use proper auth)
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const movieId = params.id

    // Update movie information using the AI agent
    const updatedMovie = await updateMovieInformation(movieId)

    if (!updatedMovie) {
      return NextResponse.json(
        {
          success: false,
          message: `Movie with ID ${movieId} not found`,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated movie: ${updatedMovie.title}`,
      data: updatedMovie,
    })
  } catch (error) {
    console.error("Error in update movie API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update movie information",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
