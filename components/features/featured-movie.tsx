"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import VideoPlayer from "./video-player"

type FeaturedMovieItem = {
  id: string
  title: string
  description: string
  trailerUrl: string
  imageUrl: string
  posterUrl: string
  duration: string
}

export default function FeaturedMovie() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [movies, setMovies] = useState<FeaturedMovieItem[]>([])

  const currentMovie = movies[currentIndex] ?? movies[0]

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
  }

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/featured-movies")
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          setMovies(json.data)
          setCurrentIndex(0)
        }
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="relative rounded-lg overflow-hidden group">
      {/* Movie Poster/Trailer */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] min-h-[320px]">
        <Image
          src={(currentMovie?.imageUrl) || "/placeholder.svg"}
          alt={currentMovie?.title || "Featured"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 100vw"
          priority
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(true)}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all transform hover:scale-110"
          >
            <Play size={32} fill="white" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevMovie}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextMovie}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Movie Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-6">
        <div className="flex items-center mb-2">
          {currentMovie && (
            <div className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">{currentMovie.duration}</div>
          )}
        </div>
        <h2 className="text-xl md:text-3xl font-bold mb-2">{currentMovie?.title || ""}</h2>
        <p className="text-zinc-300 text-sm md:text-base mb-4 max-w-2xl line-clamp-3 sm:line-clamp-none">{currentMovie?.description || ""}</p>
        <div className="flex items-center">
          <button
            onClick={() => setIsPlaying(true)}
            className="flex items-center bg-zinc-800 hover:bg-zinc-700 text-white rounded px-4 py-2"
          >
            <Play size={16} className="mr-2" />
            Watch the Trailer
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isPlaying && currentMovie && (
        <VideoPlayer
          src={currentMovie.trailerUrl}
          title={`${currentMovie.title} - Trailer`}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  )
}
