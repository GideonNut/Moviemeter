import { type NextRequest, NextResponse } from "next/server"
import { upvoteMovie, downvoteMovie } from "@/lib/blockchain-service"
import { rateLimit } from "@/lib/security/rate-limit"

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const limiter = await rateLimit(request)
  if (!limiter.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const { movieId, voteType, walletAddress } = await request.json()

    if (!movieId || !voteType || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result
    if (voteType === "up") {
      result = await upvoteMovie(movieId, walletAddress)
    } else if (voteType === "down") {
      result = await downvoteMovie(movieId, walletAddress)
    } else {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${voteType === "up" ? "upvoted" : "downvoted"} movie`,
      transaction: result.transaction,
    })
  } catch (error) {
    console.error("Error processing vote:", error)
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
  }
}
