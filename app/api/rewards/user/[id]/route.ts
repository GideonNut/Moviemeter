import { type NextRequest, NextResponse } from "next/server"
import { getUserRewards } from "@/lib/gooddollar-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const userData = await getUserRewards(userId)

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error("Error fetching user rewards:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch user rewards" }, { status: 500 })
  }
}
