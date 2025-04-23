import { type NextRequest, NextResponse } from "next/server"
import { storeNotificationToken, removeNotificationToken } from "@/lib/notification-service"

export async function POST(req: NextRequest) {
  try {
    // In a real implementation, you would verify the webhook signature
    // using @farcaster/frame-node's parseWebhookEvent and verifyAppKeyWithNeynar

    const data = await req.json()

    // Extract the FID from the signature (simplified for demo)
    // In a real app, you would extract this from the verified signature
    const fid = 12345 // Placeholder FID

    switch (data.event) {
      case "frame_added":
        if (data.notificationDetails) {
          storeNotificationToken(fid, data.notificationDetails.url, data.notificationDetails.token)
        }
        break

      case "frame_removed":
        removeNotificationToken(fid)
        break

      case "notifications_enabled":
        if (data.notificationDetails) {
          storeNotificationToken(fid, data.notificationDetails.url, data.notificationDetails.token)
        }
        break

      case "notifications_disabled":
        removeNotificationToken(fid)
        break

      default:
        console.log(`Unknown event: ${data.event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

