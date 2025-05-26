"use client"

import { useState } from "react"
import { Share2, Copy, Check } from "lucide-react"
import type { Movie } from "@/lib/movie-data"

interface FarcasterShareProps {
  movie: Movie
}

export default function FarcasterShare({ movie }: FarcasterShareProps) {
  const [copied, setCopied] = useState(false)
  // Use the environment variable without fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // Generate the share URL
  const shareUrl = `${baseUrl}/share?id=${movie.id}`
  const embedUrl = `${baseUrl}/api/frame-embed/${movie.id}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Share2 size={18} className="mr-2 text-rose-500" />
        Share on Farcaster
      </h3>

      <p className="text-sm text-zinc-400 mb-3">
        Share this movie with your Farcaster followers. When shared, they'll see a frame embed that lets them vote
        directly.
      </p>

      <div className="flex flex-col space-y-3">
        <div className="flex items-center">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-zinc-800 text-white rounded-l-md py-2 px-3 focus:outline-none"
          />
          <button
            onClick={() => copyToClipboard(shareUrl)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-3 rounded-r-md"
            title="Copy share URL"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>

        <div className="text-xs text-zinc-500">
          <span className="font-semibold">Pro tip:</span> You can also use{" "}
          <button onClick={() => copyToClipboard(embedUrl)} className="text-rose-500 hover:underline">
            this direct embed URL
          </button>{" "}
          for better compatibility with some Farcaster clients.
        </div>
      </div>
    </div>
  )
}
