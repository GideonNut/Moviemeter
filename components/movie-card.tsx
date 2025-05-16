"use client"

/**
 * MovieCard Component
 *
 * Displays information about a movie and allows users to vote.
 * Uses the MovieContext for state management and voting functionality.
 */

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"
import VoteButtons from "./vote-buttons"

interface MovieCardProps {
  id: number
  title: string
  description: string
}

export default function MovieCard({ id, title, description }: MovieCardProps) {
  const [showFrameLink, setShowFrameLink] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"
  const frameUrl = `${baseUrl}/api/frame?id=${id}`

  // Copy frame link to clipboard
  const copyFrameLink = () => {
    navigator.clipboard.writeText(frameUrl)
    setShowFrameLink(true)
    setTimeout(() => setShowFrameLink(false), 3000)
  }

  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full">
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-md">
        <Image
          src={`/placeholder.svg?height=450&width=300&text=${encodeURIComponent(title)}`}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>

      {/* Vote buttons are now a separate component */}
      <VoteButtons movieId={id} />

      {/* Farcaster Frame Link */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <Link href={frameUrl} target="_blank" className="text-rose-500 hover:text-rose-400 text-sm">
            View Farcaster Frame
          </Link>
          <button
            onClick={copyFrameLink}
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800"
            title="Copy Frame Link"
            aria-label="Copy Frame Link"
          >
            <Share2 size={16} />
          </button>
        </div>
        {showFrameLink && (
          <div className="mt-2 text-xs text-green-500" role="alert">
            Frame link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  )
}

