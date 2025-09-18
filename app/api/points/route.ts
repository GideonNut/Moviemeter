import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const { address, type } = await req.json()
    const addr = String(address || "").toLowerCase()
    if (!addr || !type) return NextResponse.json({ error: "address and type required" }, { status: 400 })

    const delta = type === "vote" ? 1 : type === "comment" ? 2 : 0
    if (delta === 0) return NextResponse.json({ error: "invalid type" }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOneAndUpdate(
      { address: addr },
      { $inc: { points: delta } },
      { new: true, upsert: true }
    )

    return NextResponse.json({ user })
  } catch (e) {
    console.error("Error updating points:", e)
    return NextResponse.json({ error: "failed to update points" }, { status: 500 })
  }
}


