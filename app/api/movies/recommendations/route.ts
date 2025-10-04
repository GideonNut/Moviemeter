import { type NextRequest, NextResponse } from "next/server"
import { getMovieRecommendations } from "@/lib/ai-agent"

// Simple in-memory store for paid users (in production, use a database)
const paidUsers = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()
    const { preferences, walletAddress } = body

    if (!preferences) {
      return NextResponse.json(
        {
          success: false,
          message: "User preferences are required",
        },
        { status: 400 },
      )
    }

    // Check if user has paid (in production, check blockchain or database)
    if (!walletAddress || !paidUsers.has(walletAddress.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment required for AI recommendations",
          requiresPayment: true,
        },
        { status: 402 }, // Payment Required
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

// Endpoint to mark a user as paid (called after successful payment)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet address is required",
        },
        { status: 400 },
      )
    }

    // Mark user as paid (in production, verify payment on blockchain first)
    paidUsers.add(walletAddress.toLowerCase())

    return NextResponse.json({
      success: true,
      message: "User marked as paid",
    })
  } catch (error) {
    console.error("Error marking user as paid:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark user as paid",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
