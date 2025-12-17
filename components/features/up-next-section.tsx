"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { useEffect, useState } from "react"

type UpNextItem = {
  id: string
  title: string
  description: string
  duration: string
  imageUrl: string
}

export default function UpNextSection() {
  const [items, setItems] = useState<UpNextItem[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/featured-movies", { cache: "no-store" })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          const videos: UpNextItem[] = (json.data as any[])
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .slice(1) // everything after the hero (order 1)
            .map(m => ({
              id: m.slug || m.id,
              title: m.title || "",
              description: m.description || "",
              duration: m.duration || "2:00",
              imageUrl: m.imageUrl || "/placeholder.svg",
            }))
          setItems(videos)
        }
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold">Up next</h2>
      </div>

      <div className="divide-y divide-zinc-800">
        {items.map((video) => (
          <div key={video.id} className="p-4 hover:bg-zinc-800 transition-colors">
            <div className="flex">
              <div className="relative w-24 h-16 flex-shrink-0">
                <Image
                  src={video.imageUrl || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover rounded"
                  sizes="96px"
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
        {items.length === 0 && (
          <div className="p-4 text-sm text-zinc-400">No upcoming trailers yet.</div>
        )}
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
