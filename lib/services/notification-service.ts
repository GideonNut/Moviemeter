import { z } from "zod"

// Schema for notification requests
export const sendNotificationRequestSchema = z.object({
  notificationId: z.string().max(128),
  title: z.string().max(32),
  body: z.string().max(128),
  targetUrl: z.string().max(256),
  tokens: z.array(z.string()).max(100),
})

export type SendNotificationRequest = z.infer<typeof sendNotificationRequestSchema>

export const sendNotificationResponseSchema = z.object({
  result: z.object({
    successfulTokens: z.array(z.string()),
    invalidTokens: z.array(z.string()),
    rateLimitedTokens: z.array(z.string()),
  }),
})

export type SendNotificationResponse = z.infer<typeof sendNotificationResponseSchema>

// Store notification tokens (in a real app, this would be in a database)
const notificationTokens: Record<string, { url: string; token: string }> = {}

export function storeNotificationToken(fid: number, url: string, token: string) {
  notificationTokens[fid.toString()] = { url, token }
  console.log(`Stored notification token for FID ${fid}`)
  return true
}

export function removeNotificationToken(fid: number) {
  delete notificationTokens[fid.toString()]
  console.log(`Removed notification token for FID ${fid}`)
  return true
}

export function getNotificationToken(fid: number) {
  return notificationTokens[fid.toString()]
}

export async function sendNotification(
  fid: number,
  notificationId: string,
  title: string,
  body: string,
  targetUrl: string,
) {
  const tokenData = getNotificationToken(fid)
  if (!tokenData) {
    console.log(`No notification token found for FID ${fid}`)
    return false
  }

  try {
    const { url, token } = tokenData

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId,
        title,
        body,
        targetUrl,
        tokens: [token],
      } as SendNotificationRequest),
    })

    if (!response.ok) {
      console.error(`Failed to send notification: ${response.statusText}`)
      return false
    }

    const data = (await response.json()) as SendNotificationResponse

    // Check if the token is invalid and remove it if necessary
    if (data.result.invalidTokens.includes(token)) {
      removeNotificationToken(fid)
      return false
    }

    return data.result.successfulTokens.includes(token)
  } catch (error) {
    console.error("Error sending notification:", error)
    return false
  }
}
