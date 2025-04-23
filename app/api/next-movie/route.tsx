import { type NextRequest, NextResponse } from "next/server"

// Define movie data
const movies = [
  { id: "0", title: "Inception", description: "A thief enters dreams to steal secrets." },
  { id: "1", title: "Interstellar", description: "A space epic exploring love and time." },
  { id: "2", title: "The Dark Knight", description: "Batman faces off against the Joker." },
  { id: "3", title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
]

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    // Get a random movie ID
    const randomId = Math.floor(Math.random() * movies.length).toString()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MovieMeter Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/image?id=${randomId}" />
          <meta property="fc:frame:button:1" content="👍 Yes" />
          <meta property="fc:frame:button:2" content="👎 No" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/vote?id=${randomId}" />
        </head>
        <body>
          <h1>MovieMeter Frame</h1>
          <p>Vote on this movie!</p>
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
    console.error("Error in next-movie:", error)
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MovieMeter Frame Error</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"}/api/error" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"}/api/frame" />
        </head>
        <body>
          <h1>Error loading next movie</h1>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  }
}
