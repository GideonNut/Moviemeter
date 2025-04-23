import { type NextRequest, NextResponse } from "next/server"
import { storeNotificationToken } from "@/lib/notification-service"

export async function POST(req: NextRequest) {
  try {
    const { fid, url, token } = await req.json()

    if (!fid || !url || !token) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Store the notification token
    const result = storeNotificationToken(Number(fid), url, token)

    return NextResponse.json({ success: result })
  } catch (error) {
    console.error("Error in test webhook:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

