import { type NextRequest, NextResponse } from "next/server"
import { claimGoodDollarReward } from "@/lib/gooddollar-service"

export async function POST(request: NextRequest) {
  try {
    const { userId, rewardId, pointsCost, tokenAmount } = await request.json()

    // Validate required fields
    if (!userId || !rewardId || !pointsCost || !tokenAmount) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Process the reward claim
    const result = await claimGoodDollarReward(userId, rewardId, pointsCost, tokenAmount)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      userData: result.userData,
    })
  } catch (error) {
    console.error("Error processing reward claim:", error)
    return NextResponse.json({ success: false, message: "Failed to process reward claim" }, { status: 500 })
  }
}
