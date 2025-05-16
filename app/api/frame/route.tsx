import { type NextRequest, NextResponse } from "next/server"
import { trackFrameView } from "@/lib/analytics"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const movieId = searchParams.get("id") || "0"

    // Track the frame view
    trackFrameView(movieId)

    // Use the environment variable without fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    // Return the HTML with the frame metadata
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MovieMeter Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/image?id=${movieId}" />
          <meta property="fc:frame:button:1" content="👍 Yes" />
          <meta property="fc:frame:button:2" content="👎 No" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/vote?id=${movieId}" />
        </head>
        <body>
          <h1>MovieMeter Frame</h1>
          <p>This is a Farcaster Frame for MovieMeter.</p>
          <p>You're viewing the frame for movie ID: ${movieId}</p>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    console.error("Error in frame route:", error)
    return new NextResponse("Error loading frame", { status: 500 })
  }
}
