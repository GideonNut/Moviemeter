import { type NextRequest, NextResponse } from "next/server"
import { movies } from "@/lib/movie-data"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movieId = params.id || "0"
    const movie = movies.find((m) => m.id === movieId) || movies[0]
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

    // Create the frame embed JSON according to the v2 spec
    const frameEmbed = {
      version: "next",
      imageUrl: `${baseUrl}/api/image?id=${movieId}`,
      button: {
        title: "Vote on this movie",
        action: {
          type: "launch_frame",
          url: `${baseUrl}/farcaster?id=${movieId}`,
          name: "MovieMeter",
          splashImageUrl: `${baseUrl}/mm-logo-new.png`,
          splashBackgroundColor: "#18181b",
        },
      },
    }

    // Return HTML with the frame embed metadata
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Vote on ${movie.title} | MovieMeter</title>
          <meta name="description" content="${movie.description}">
          <meta property="og:title" content="Vote on ${movie.title} | MovieMeter">
          <meta property="og:description" content="${movie.description}">
          <meta property="og:image" content="${baseUrl}/api/image?id=${movieId}">
          <meta name="fc:frame" content='${JSON.stringify(frameEmbed)}'>
        </head>
        <body>
          <h1>Vote on ${movie.title}</h1>
          <p>${movie.description}</p>
          <p>This page is designed to be shared on Farcaster.</p>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    console.error("Error generating frame embed:", error)
    return new NextResponse("Error generating frame embed", { status: 500 })
  }
}

