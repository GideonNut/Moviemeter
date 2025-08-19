import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Comment from "@/models/Comment"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const commentId = params.id

    if (!address || !commentId) {
      return NextResponse.json({ error: "Address and comment ID are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find comment and check if user owns it
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.address !== address) {
      return NextResponse.json({ error: "You can only delete your own comments" }, { status: 403 })
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId)

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action, address, content } = await request.json()
    const commentId = params.id

    if (!action || !address || !commentId) {
      return NextResponse.json({ error: "Action, address, and comment ID are required" }, { status: 400 })
    }

    await connectToDatabase()

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    switch (action) {
      case "like":
        // Toggle like
        const likeIndex = comment.likes.indexOf(address)
        if (likeIndex > -1) {
          comment.likes.splice(likeIndex, 1) // Remove like
        } else {
          comment.likes.push(address) // Add like
        }
        break

      case "reply":
        if (!content || content.trim().length === 0) {
          return NextResponse.json({ error: "Reply content cannot be empty" }, { status: 400 })
        }
        if (content.length > 500) {
          return NextResponse.json({ error: "Reply too long (max 500 characters)" }, { status: 400 })
        }
        
        comment.replies.push({
          address,
          content: content.trim(),
          timestamp: new Date(),
          likes: []
        })
        break

      case "likeReply":
        const { replyIndex } = await request.json()
        if (replyIndex === undefined) {
          return NextResponse.json({ error: "Reply index is required" }, { status: 400 })
        }
        
        const reply = comment.replies[replyIndex]
        if (!reply) {
          return NextResponse.json({ error: "Reply not found" }, { status: 404 })
        }
        
        const replyLikeIndex = reply.likes.indexOf(address)
        if (replyLikeIndex > -1) {
          reply.likes.splice(replyLikeIndex, 1) // Remove like
        } else {
          reply.likes.push(address) // Add like
        }
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await comment.save()
    return NextResponse.json({ message: "Action completed successfully", comment })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}
