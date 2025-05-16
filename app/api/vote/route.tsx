import { type NextRequest, NextResponse } from "next/server"
import { prepareVoteTransaction } from "@/lib/blockchain-service"
import { rateLimit } from "@/lib/security/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit.check(request)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Parse request body
    const { movieId, voteType, address } = await request.json()

    if (!movieId || voteType === undefined || !address) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Prepare the transaction
    const transaction = prepareVoteTransaction(movieId, voteType)

    // Return the transaction data
    return NextResponse.json({
      success: true,
      transaction,
    })
  } catch (error) {
    console.error("Error processing vote:", error)
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
  }
}
