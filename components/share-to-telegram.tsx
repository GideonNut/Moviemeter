"use client"

import { useState } from "react"
import { Send, Check, AlertCircle } from "lucide-react"

interface ShareToTelegramProps {
  movieTitle: string
  movieDescription: string
  movieImageUrl?: string
  userVote?: "yes" | "no"
}

export default function ShareToTelegram({
  movieTitle,
  movieDescription,
  movieImageUrl,
  userVote,
}: ShareToTelegramProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareResult, setShareResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleShare = async () => {
    try {
      setIsSharing(true)
      setShareResult(null)

      const response = await fetch("/api/share/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: movieTitle,
          description: movieDescription,
          imageUrl: movieImageUrl,
          userVote,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to share to Telegram")
      }

      setShareResult({
        success: true,
        message: "Successfully shared to Movies Society channel!",
      })
    } catch (error) {
      console.error("Error sharing to Telegram:", error)
      setShareResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to share to Telegram",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {isSharing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Sharing...
          </>
        ) : (
          <>
            <Send size={16} className="mr-2" />
            Share to Movies Society
          </>
        )}
      </button>

      {shareResult && (
        <div
          className={`mt-2 p-2 rounded-md text-sm ${
            shareResult.success ? "bg-green-900/20 border border-green-900" : "bg-red-900/20 border border-red-900"
          }`}
        >
          <div className="flex items-center">
            {shareResult.success ? (
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
            )}
            <p>{shareResult.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
