import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validate the frame action
    const { untrustedData } = data
    const { buttonIndex } = untrustedData

    // Handle different button actions
    if (buttonIndex === 1) {
      return new Response(
        JSON.stringify({
          message: "Success",
          status: "ok",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    return new Response(
      JSON.stringify({
        message: "Invalid button index",
        status: "error",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Frame error:", error)
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        status: "error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
} 