import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Comment from "@/models/Comment"

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

    return NextResponse.json(comments)
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

    return NextResponse.json({ message: "Comment added successfully", comment }, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
