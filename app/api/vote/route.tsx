import { type NextRequest, NextResponse } from "next/server"

// Define movie data
const movies = [
  { id: "0", title: "Inception", description: "A thief enters dreams to steal secrets." },
  { id: "1", title: "Interstellar", description: "A space epic exploring love and time." },
  { id: "2", title: "The Dark Knight", description: "Batman faces off against the Joker." },
  { id: "3", title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
]

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData()
    const buttonIndex = formData.get("buttonIndex")

    // Get movie ID from the URL
    const url = new URL(req.url)
    const movieId = url.searchParams.get("id") || "0"

    // Determine vote type based on button index
    const voteType = buttonIndex === "1" // 1 = Yes, 2 = No

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

    // Return HTML with the thank you frame
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MovieMeter Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/thank-you?id=${movieId}&vote=${voteType ? "yes" : "no"}" />
          <meta property="fc:frame:button:1" content="Vote on another movie" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/next-movie" />
        </head>
        <body>
          <h1>Thank you for voting!</h1>
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
    console.error("Error processing vote:", error)
    return new NextResponse("Error processing vote", { status: 500 })
  }
}

