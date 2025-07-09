import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../lib/mongodb"
import Movie from "../../../models/Movie"

export async function GET() {
  await connectToDatabase()
  const movies = await Movie.find().sort({ createdAt: -1 })
  return NextResponse.json(movies)
}

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const data = await req.json()
  const movie = await Movie.create(data)
  return NextResponse.json(movie)
}
