import { type NextRequest, NextResponse } from "next/server"

// Define movie data
const movies = [
  { id: "0", title: "Inception", description: "A thief enters dreams to steal secrets." },
  { id: "1", title: "Interstellar", description: "A space epic exploring love and time." },
  { id: "2", title: "The Dark Knight", description: "Batman faces off against the Joker." },
  { id: "3", title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
]

// Simple in-memory storage for votes (in a production app, you'd use a database)
const votes: Record<string, { movieId: string; vote: boolean; fid: string }[]> = {}

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData()
    const buttonIndex = formData.get("buttonIndex") as string
    const fidString = formData.get("fid") as string
    const fid = fidString ? Number.parseInt(fidString) : null

    // Get movie ID from the URL
    const url = new URL(req.url)
    const movieId = url.searchParams.get("id") || "0"

    // Determine vote type based on button index
    const voteType = buttonIndex === "1" // 1 = Yes, 2 = No

    // Record the vote if we have a valid FID
    if (fid) {
      // Initialize the votes array for this movie if it doesn't exist
      if (!votes[movieId]) {
        votes[movieId] = []
      }

      // Check if this user has already voted for this movie
      const existingVoteIndex = votes[movieId].findIndex((v) => v.fid === fidString)

      if (existingVoteIndex >= 0) {
        // Update existing vote
        votes[movieId][existingVoteIndex].vote = voteType
      } else {
        // Add new vote
        votes[movieId].push({ movieId, vote: voteType, fid: fidString })
      }

      console.log(`User ${fid} voted ${voteType ? "Yes" : "No"} for movie ${movieId}`)

      // If the user is the owner (FID 1006311), log all votes
      if (fid === 1006311) {
        console.log("Current votes:", votes)
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

    // Return HTML with the thank you frame
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MovieMeter Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/thank-you?id=${movieId}&vote=${voteType ? "yes" : "no"}${fid ? `&fid=${fid}` : ""}" />
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

