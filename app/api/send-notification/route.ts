import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  try {
    const { fid, movieId, movieTitle, message } = await req.json()

    if (!fid || !movieId || !movieTitle) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get notification token for this user
    const notificationData = await kv.get(`notification:${fid}`)

    if (!notificationData || !notificationData.url || !notificationData.token) {
      return NextResponse.json({ success: false, error: "No notification token found for user" }, { status: 404 })
    }

    // Send notification
    const response = await fetch(notificationData.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens: [notificationData.token],
        title: `MovieMeter: ${movieTitle}`,
        body: message || `New activity on ${movieTitle}`,
        notificationId: `movie-${movieId}-${Date.now()}`,
        targetUrl: `https://moviemeter.vercel.app/mini/movie/${movieId}`,
      }),
    })

    const result = await response.json()

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
