"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import VideoPlayer from "./video-player"

// Sample featured movies data with real images
const featuredMovies = [
  {
    id: "final-destination",
    title: "Final Destination: Bloodlines",
    description: "Death is coming for a new group of unsuspecting victims in this terrifying new chapter.",
    trailerUrl: "https://www.youtube.com/embed/EL4sUiPQDrQ",
    imageUrl: "https://i.ytimg.com/vi/EL4sUiPQDrQ/maxresdefault.jpg",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZDJlYzMyZTctYzBiMi00Y2ZjLTg0MTctMDQ1ZTVhZDQ5ZTI1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    duration: "2:25",
  },
  {
    id: "dune-2",
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    imageUrl: "https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjhkZWY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    duration: "2:35",
  },
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    description:
      "Wade Wilson's peaceful life is interrupted when former colleagues come calling, forcing him to team up with Wolverine.",
    trailerUrl: "https://www.youtube.com/embed/4sUQfaQjKd8",
    imageUrl: "https://i.ytimg.com/vi/4sUQfaQjKd8/maxresdefault.jpg",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNzQ5MGQyODAtNTg3OC00Y2VjLTkzODktNmU0MWYyZjZmMmRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    duration: "2:15",
  },
]

export default function FeaturedMovie() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentMovie = featuredMovies[currentIndex]

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
  }

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }

  // Set Final Destination: Bloodlines as the default featured movie on initial load
  useEffect(() => {
    setCurrentIndex(0) // Index 0 is Final Destination: Bloodlines
  }, [])

  return (
    <div className="relative rounded-lg overflow-hidden group">
      {/* Movie Poster/Trailer */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={currentMovie.imageUrl || "/placeholder.svg"}
          alt={currentMovie.title}
          fill
          className="object-cover"
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
        <div className="flex items-center mb-2">
          <div className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">{currentMovie.duration}</div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentMovie.title}</h2>
        <p className="text-zinc-300 text-sm md:text-base mb-4 max-w-2xl">{currentMovie.description}</p>
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
      {isPlaying && (
        <VideoPlayer
          src={currentMovie.trailerUrl}
          title={`${currentMovie.title} - Trailer`}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  )
}

