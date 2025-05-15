import { type NextRequest, NextResponse } from "next/server"
import { movies } from "@/lib/movie-data"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movieId = Number.parseInt(params.id)
    const movie = movies.find((m) => m.id === movieId) || movies[0]

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter13.vercel.app"

    const frameEmbed = {
      version: "next",
      imageUrl: `${baseUrl}/api/image?id=${movieId}`,
      button: {
        title: "Vote on this Movie",
        action: {
          type: "launch_frame",
          url: `${baseUrl}/mini/movie/${movieId}`,
          name: "MovieMeter",
          splashImageUrl: `${baseUrl}/mm-logo-new.png`,
          splashBackgroundColor: "#000000",
        },
      },
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${movie.title} - MovieMeter</title>
          <meta property="og:title" content="${movie.title} - MovieMeter" />
          <meta property="og:description" content="${movie.description}" />
          <meta property="og:image" content="${baseUrl}/api/image?id=${movieId}" />
          <meta name="fc:frame" content='${JSON.stringify(frameEmbed)}' />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #000; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
          <div style="max-width: 500px; text-align: center;">
            <h1 style="margin-bottom: 16px;">${movie.title}</h1>
            <p style="margin-bottom: 24px;">${movie.description}</p>
            <p style="color: #888;">Vote on this movie in MovieMeter!</p>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error generating embed:", error)
    return NextResponse.json({ error: "Failed to generate embed" }, { status: 500 })
  }
}
