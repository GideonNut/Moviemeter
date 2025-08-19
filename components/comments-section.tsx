"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Heart, Reply, Trash2, Send, X } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"

interface Comment {
  _id: string
  movieId: string
  address: string
  content: string
  timestamp: string
  likes: string[]
  replies: {
    address: string
    content: string
    timestamp: string
    likes: string[]
  }[]
}

interface CommentsSectionProps {
  movieId: string
}

export default function CommentsSection({ movieId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)
  
  const account = useActiveAccount()
  const address = account?.address

  useEffect(() => {
    fetchComments()
  }, [movieId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?movieId=${movieId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }
      const data = await response.json()
      setComments(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, address, content: newComment.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const { comment } = await response.json()
      setComments(prev => [comment, ...prev])
      setNewComment("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!address) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", address, commentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to like comment")
      }

      const { comment } = await response.json()
      setComments(prev => prev.map(c => c._id === commentId ? comment : c))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleReply = async (commentId: string) => {
    if (!address || !replyContent.trim()) return

    setSubmittingReply(true)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", address, commentId, content: replyContent.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to add reply")
      }

      const { comment } = await response.json()
      setComments(prev => prev.map(c => c._id === commentId ? comment : c))
      setReplyContent("")
      setReplyingTo(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleLikeReply = async (commentId: string, replyIndex: number) => {
    if (!address) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "likeReply", address, commentId, replyIndex }),
      })

      if (!response.ok) {
        throw new Error("Failed to like reply")
      }

      const { comment } = await response.json()
      setComments(prev => prev.map(c => c._id === commentId ? comment : c))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!address) return

    try {
      const response = await fetch(`/api/comments/${commentId}?address=${address}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle size={24} className="text-rose-500" />
          <h3 className="text-xl font-semibold">Comments</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-zinc-400">Loading comments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle size={24} className="text-rose-500" />
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Add Comment Form */}
      {address ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              rows={3}
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Post
            </button>
          </div>
          <div className="text-xs text-zinc-500 mt-2 text-right">
            {newComment.length}/1000
          </div>
        </form>
      ) : (
        <div className="bg-zinc-800 p-4 rounded-lg mb-8 text-center">
          <p className="text-zinc-400">Connect your wallet to join the conversation</p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={48} className="mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b border-zinc-800 pb-6 last:border-b-0">
              {/* Main Comment */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {comment.address.slice(2, 4).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-zinc-300">{formatAddress(comment.address)}</span>
                    <span className="text-zinc-500 text-sm">{formatTime(comment.timestamp)}</span>
                  </div>
                  <p className="text-zinc-200 mb-3">{comment.content}</p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        comment.likes.includes(address || "")
                          ? "text-rose-500"
                          : "text-zinc-400 hover:text-zinc-300"
                      }`}
                    >
                      <Heart size={16} className={comment.likes.includes(address || "") ? "fill-current" : ""} />
                      {comment.likes.length}
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                      <Reply size={16} />
                      Reply
                    </button>
                    {comment.address === address && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 bg-zinc-800 p-4 rounded-lg">
                      <div className="flex gap-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                          rows={2}
                          maxLength={500}
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleReply(comment._id)}
                            disabled={submittingReply || !replyContent.trim()}
                            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                          >
                            {submittingReply ? "..." : "Reply"}
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg transition-colors text-sm"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 mt-2 text-right">
                        {replyContent.length}/500
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {comment.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className="bg-zinc-800 p-3 rounded-lg ml-8">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-zinc-300 text-sm">{formatAddress(reply.address)}</span>
                            <span className="text-zinc-500 text-xs">{formatTime(reply.timestamp)}</span>
                          </div>
                          <p className="text-zinc-200 text-sm mb-2">{reply.content}</p>
                          <button
                            onClick={() => handleLikeReply(comment._id, replyIndex)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              reply.likes.includes(address || "")
                                ? "text-rose-500"
                                : "text-zinc-400 hover:text-zinc-300"
                            }`}
                          >
                            <Heart size={12} className={reply.likes.includes(address || "") ? "fill-current" : ""} />
                            {reply.likes.length}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
