import { type NextRequest, NextResponse } from "next/server"
import { getPersonalizedRecommendations } from "@/lib/claude-service"
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

    try {
      // Get recommendations from Claude
      const recommendations = await getPersonalizedRecommendations(preferences, count)

      return NextResponse.json({
        success: true,
        message: `Found ${recommendations.length} movie recommendations`,
        data: recommendations,
      })
    } catch (recommendationsError) {
      console.error("Error getting recommendations:", recommendationsError)

      // Return mock recommendations as fallback
      const mockRecommendations = [
        {
          title: "Inception",
          description:
            "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.",
          releaseYear: "2010",
          genres: ["Action", "Adventure", "Sci-Fi"],
          rating: 8.8,
          reason: "Based on your preferences for thought-provoking films.",
          posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        },
        {
          title: "The Dark Knight",
          description:
            "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          releaseYear: "2008",
          genres: ["Action", "Crime", "Drama"],
          rating: 9.0,
          reason: "Matches your interest in complex characters and storytelling.",
          posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        },
        {
          title: "Parasite",
          description:
            "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
          releaseYear: "2019",
          genres: ["Drama", "Thriller"],
          rating: 8.5,
          reason: "Aligns with your interest in films with social commentary.",
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        },
      ].slice(0, count)

      return NextResponse.json({
        success: true,
        message: `Found ${mockRecommendations.length} movie recommendations`,
        data: mockRecommendations,
      })
    }
  } catch (error) {
    console.error("Error in Claude recommendations API route:", error)
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
