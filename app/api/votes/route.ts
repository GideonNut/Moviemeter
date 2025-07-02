import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../lib/mongodb"
import Vote from "../../../models/Vote"

export async function GET(req: NextRequest) {
  await connectToDatabase()
  const movieId = req.nextUrl.searchParams.get("movieId")
  const votes = await Vote.find(movieId ? { movieId } : {})
  return NextResponse.json(votes)
}

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const data = await req.json()
  const vote = await Vote.create(data)
  return NextResponse.json(vote)
}
