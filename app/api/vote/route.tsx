import { type NextRequest, NextResponse } from "next/server"
import { prepareVoteTransaction } from "@/lib/blockchain-service"
import { rateLimit } from "@/lib/security/rate-limit"
import { Storage } from '@apillon/sdk'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    // Extract IP address from request headers for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : undefined;
    const rateLimitResult = await rateLimit({ ip });
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

    // Upload vote to Apillon storage
    let apillonUploadSuccess = false;
    try {
      const storage = new Storage({
        key: process.env.APILLON_API_KEY!,
        secret: process.env.APILLON_API_SECRET!,
      });
      const bucket = storage.bucket('4a7aeee3-f525-4404-a230-fb43cec4e253');
      const voteData = {
        movieId,
        address,
        voteType,
        timestamp: new Date().toISOString(),
      };
      await bucket.uploadFiles([
        {
          fileName: `votes/${address}_${movieId}_${Date.now()}.json`,
          contentType: 'application/json',
          content: Buffer.from(JSON.stringify(voteData)),
        },
      ]);
      apillonUploadSuccess = true;
    } catch (err) {
      console.error('Failed to upload vote to Apillon:', err);
    }

    // Return the transaction data
    return NextResponse.json({
      success: true,
      transaction,
      apillonUploadSuccess,
    })
  } catch (error) {
    console.error("Error processing vote:", error)
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
  }
}
