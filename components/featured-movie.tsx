"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import VideoPlayer from "./video-player"

export default function FeaturedMovie() {
  const [showTrailer, setShowTrailer] = useState(false)

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      {/* Dark overlay with gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"
        style={{
          backgroundImage: "url('https://i.ytimg.com/vi/Di310WS8zLk/maxresdefault.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      ></div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
        <div className="bg-rose-600 text-white text-sm font-medium px-3 py-1 rounded-md w-fit mb-4">2:45</div>
        <h1 className="text-4xl font-bold text-white mb-2">Wednesday: Season 2</h1>
        <p className="text-gray-200 mb-6 max-w-2xl">
          Wednesday Addams returns for a new semester at Nevermore Academy with more mysteries, mayhem, and monsters to
          uncover.
        </p>
        <button
          onClick={() => setShowTrailer(true)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-md w-fit transition-all duration-300"
        >
          <Play size={20} />
          Watch the Trailer
        </button>
      </div>

      {/* Video player modal */}
      {showTrailer && (
        <VideoPlayer
          src="https://www.youtube.com/embed/Di310WS8zLk"
          title="Wednesday Season 2 Trailer"
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}
