import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address")?.toLowerCase()
  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 })
  await connectToDatabase()
  const user = await User.findOne({ address })
  return NextResponse.json({ user })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const address = String(body.address || "").toLowerCase()
  const nickname = String(body.nickname || "").trim()
  if (!address || !nickname) {
    return NextResponse.json({ error: "address and nickname required" }, { status: 400 })
  }
  if (nickname.length < 2 || nickname.length > 24) {
    return NextResponse.json({ error: "nickname must be 2-24 chars" }, { status: 400 })
  }
  await connectToDatabase()
  let user = await User.findOne({ address })
  if (!user) {
    user = await User.create({ address, nickname, points: 50 })
  } else {
    const wasEmpty = !user.nickname
    user.nickname = nickname
    if (wasEmpty) user.points = (user.points || 0) + 50
    await user.save()
  }
  return NextResponse.json({ user })
}


