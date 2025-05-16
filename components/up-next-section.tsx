"use client"

import Image from "next/image"
import { Play } from "lucide-react"

// Sample up next videos with proper thumbnails
const upNextVideos = [
  {
    id: "snow-white",
    title: "Snow White Stars Test Their Disney Knowledge",
    description: "Rachel and Gal Get Quizzed",
    duration: "1:57",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/udq.jpg-bk7q8GErMTwH4wyBd1b8AiT7azSoVs.jpeg",
  },
  {
    id: "andor",
    title: "'Andor' Returns April 22",
    description: "Watch the Season 2 Trailer",
    duration: "1:23",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/andor.jpg-32pDg7f7SzDaExY2gKBxA3iUb8ccio.jpeg",
  },
  {
    id: "tearjerkers",
    title: "Need Some Emotional Release?",
    description: "Top-Rated Tearjerkers to Stream Now",
    duration: "2:30",
    imageUrl: "https://i.ytimg.com/vi/gn5QmllRCn4/maxresdefault.jpg",
  },
]

export default function UpNextSection() {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold">Up next</h2>
      </div>

      <div className="divide-y divide-zinc-800">
        {upNextVideos.map((video) => (
          <div key={video.id} className="p-4 hover:bg-zinc-800 transition-colors">
            <div className="flex">
              <div className="relative w-24 h-16 flex-shrink-0">
                <Image
                  src={video.imageUrl || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-1">
                    <Play size={16} fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>

              <div className="ml-3">
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <p className="text-zinc-400 text-xs mt-1">{video.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button className="text-rose-500 hover:text-rose-400 text-sm font-medium flex items-center">
          Browse trailers
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
