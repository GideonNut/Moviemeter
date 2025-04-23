"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, RefreshCw, MessageCircle } from "lucide-react"
import type { MovieRecommendation } from "@/lib/telegram-service"

export default function TelegramRecommendations() {
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/recommendations/telegram?limit=5")

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch recommendations")
      }

      setRecommendations(data.data)
    } catch (error) {
      console.error("Error fetching Telegram recommendations:", error)
      setError("Failed to load recommendations from Movies Society. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch recommendations on component mount
  useEffect(() => {
    fetchRecommendations()
  }, [])

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - new Date(date).getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
      }
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else {
      return `${diffInDays} days ago`
    }
  }

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center">
          <MessageCircle size={18} className="text-rose-500 mr-2" />
          <h2 className="text-xl font-bold">Movies Society Channel</h2>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 disabled:opacity-50"
          aria-label="Refresh recommendations"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error ? (
        <div className="p-6 text-center">
          <p className="text-zinc-400 mb-2">{error}</p>
          <button onClick={fetchRecommendations} className="text-rose-500 hover:text-rose-400 font-medium">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="p-6 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-zinc-800 rounded-full mb-2"></div>
            <div className="h-4 w-32 bg-zinc-800 rounded mb-2"></div>
            <div className="h-3 w-24 bg-zinc-800 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <div key={recommendation.id} className="p-4 hover:bg-zinc-800 transition-colors">
                <div className="flex">
                  {recommendation.imageUrl && (
                    <div className="relative w-24 h-36 flex-shrink-0 mr-4">
                      <Image
                        src={recommendation.imageUrl || "/placeholder.svg"}
                        alt={recommendation.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{recommendation.title}</h3>
                    <p className="text-zinc-400 text-sm mb-2 line-clamp-3">{recommendation.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">{formatRelativeTime(recommendation.postedDate)}</span>
                      <Link
                        href={recommendation.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-500 hover:text-rose-400 text-sm flex items-center"
                      >
                        View on Telegram
                        <ExternalLink size={12} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-zinc-400">No recommendations found</p>
            </div>
          )}
        </div>
      )}

      <div className="p-4 border-t border-zinc-800">
        <Link
          href="https://t.me/movies_society"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-500 hover:text-rose-400 text-sm font-medium flex items-center justify-center"
        >
          Follow Movies Society on Telegram
          <ExternalLink size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  )
}
