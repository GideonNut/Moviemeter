"use client"

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
    <div className="bg-[#121212] rounded-lg overflow-hidden hover:bg-[#1a1a1a] transition-all duration-300 flex flex-col h-full border border-[#222222]">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={`/placeholder.svg?height=450&width=300&text=${encodeURIComponent(title)}`}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,18,18,0.9)] to-transparent"></div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
        <p className="text-sm text-zinc-400 mb-4 flex-grow">{description}</p>

        {/* Vote buttons are now a separate component */}
        <VoteButtons movieId={id} />

        {/* Farcaster Frame Link */}
        <div className="mt-4 pt-4 border-t border-[#222222]">
          <div className="flex justify-between items-center">
            <Link
              href={frameUrl}
              target="_blank"
              className="text-[#ad264a] hover:text-[#c13a5e] text-sm transition-colors"
            >
              View Farcaster Frame
            </Link>
            <button
              onClick={copyFrameLink}
              className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-[#222222] transition-colors"
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
    </div>
  )
}
