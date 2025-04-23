import { type NextRequest, NextResponse } from "next/server"
import { sendNotification } from "@/lib/notification-service"

export async function POST(req: NextRequest) {
  try {
    const { fid } = await req.json()

    if (!fid) {
      return NextResponse.json({ success: false, error: "Missing FID" }, { status: 400 })
    }

    // Send a test notification
    const notificationId = `test-notification-${Date.now()}`
    const title = "Test Notification"
    const body = "This is a test notification from MovieMeter"
    const targetUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

    const success = await sendNotification(Number(fid), notificationId, title, body, targetUrl)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error sending test notification:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
