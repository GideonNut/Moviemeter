import { type NextRequest, NextResponse } from "next/server"
import { sendNotification } from "@/lib/notification-service"

export async function POST(req: NextRequest) {
  try {
    const { fid, movieId, movieTitle, voteType } = await req.json()

    if (!fid || !movieId || !movieTitle) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const notificationId = `movie-vote-${movieId}-${Date.now()}`
    const title = "MovieMeter Vote"
    const body = `Someone voted ${voteType ? "👍" : "👎"} on ${movieTitle}!`
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"
    const targetUrl = `${baseUrl}/movies/${movieId}`

    const success = await sendNotification(fid, notificationId, title, body, targetUrl)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

