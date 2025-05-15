import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // In a production app, you would verify the webhook signature
    // using @farcaster/frame-node's parseWebhookEvent and verifyAppKeyWithNeynar

    const fid = data.header?.fid || 0

    switch (data.event) {
      case "frame_added":
        if (data.notificationDetails) {
          // Store notification token for this user
          await kv.set(`notification:${fid}`, {
            url: data.notificationDetails.url,
            token: data.notificationDetails.token,
            timestamp: Date.now(),
          })
          console.log(`User ${fid} added the app and enabled notifications`)
        }
        break

      case "frame_removed":
        // Remove notification token for this user
        await kv.del(`notification:${fid}`)
        console.log(`User ${fid} removed the app`)
        break

      case "notifications_enabled":
        if (data.notificationDetails) {
          // Store notification token for this user
          await kv.set(`notification:${fid}`, {
            url: data.notificationDetails.url,
            token: data.notificationDetails.token,
            timestamp: Date.now(),
          })
          console.log(`User ${fid} enabled notifications`)
        }
        break

      case "notifications_disabled":
        // Remove notification token for this user
        await kv.del(`notification:${fid}`)
        console.log(`User ${fid} disabled notifications`)
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
