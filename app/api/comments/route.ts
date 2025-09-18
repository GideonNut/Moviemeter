import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Comment from "@/models/Comment"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movieId")

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Get all comments for the movie, sorted by newest first
    const comments = await Comment.find({ movieId })
      .sort({ timestamp: -1 })
      .limit(100) // Limit to prevent overwhelming responses

    // Attach displayName for commenters and repliers
    const addresses = new Set<string>()
    comments.forEach((c: any) => {
      addresses.add((c.address || "").toLowerCase())
      ;(c.replies || []).forEach((r: any) => addresses.add((r.address || "").toLowerCase()))
    })
    const users = await User.find({ address: { $in: Array.from(addresses) } })
    const map: Record<string, string> = {}
    users.forEach((u: any) => { if (u.nickname) map[u.address.toLowerCase()] = u.nickname })

    const withNames = comments.map((c: any) => ({
      ...c.toObject(),
      displayName: map[c.address?.toLowerCase?.() || c.address] || undefined,
      replies: (c.replies || []).map((r: any) => ({
        ...r,
        displayName: map[r.address?.toLowerCase?.() || r.address] || undefined,
      })),
    }))

    return NextResponse.json(withNames)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { movieId, address, content } = await request.json()

    if (!movieId || !address || !content) {
      return NextResponse.json({ error: "Movie ID, address, and content are required" }, { status: 400 })
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: "Comment too long (max 1000 characters)" }, { status: 400 })
    }

    await connectToDatabase()

    // Create new comment
    const comment = new Comment({ movieId, address, content })
    await comment.save()

    // Award points for commenting
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, type: "comment" }),
      })
    } catch (e) {
      console.warn("Failed to award comment points", e)
    }

    return NextResponse.json({ message: "Comment added successfully", comment }, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
