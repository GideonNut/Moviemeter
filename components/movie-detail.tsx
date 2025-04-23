"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import type { Movie } from "@/lib/movie-data"
import VideoPlayer from "./video-player"
import FarcasterShare from "./farcaster-share"
import ShareToTelegram from "./share-to-telegram"

interface MovieDetailProps {
  movie: Movie
  onVote: (vote: boolean) => void
}

export default function MovieDetail({ movie, onVote }: MovieDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)
  const [userVote, setUserVote] = useState<"yes" | "no" | null>(null)

  const screenshots = movie.screenshots || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  const handleVote = (vote: boolean) => {
    setUserVote(vote ? "yes" : "no")
    onVote(vote)
  }

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      {/* Movie Backdrop */}
      {movie.backdropUrl && (
        <div className="relative w-full h-48">
          <Image
            src={movie.backdropUrl || "/placeholder.svg"}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Movie Poster */}
          <div className="relative w-32 h-48 flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={movie.posterUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover rounded-md"
            />
          </div>

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1">{movie.title}</h1>
            <div className="flex items-center text-sm text-zinc-400 mb-2">
              <span>{movie.releaseYear}</span>
              {movie.rating && (
                <>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.rating}
                  </span>
                </>
              )}
              {movie.genres && (
                <>
                  <span className="mx-2">•</span>
                  <span>{movie.genres.join(", ")}</span>
                </>
              )}
            </div>
            <p className="text-sm text-zinc-300 mb-3">{movie.description}</p>
            {movie.director && (
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-500">Director:</span> {movie.director}
              </p>
            )}
            {movie.cast && (
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-500">Cast:</span> {movie.cast.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Trailer Button */}
        {movie.trailerUrl && (
          <button
            onClick={() => setShowTrailer(true)}
            className="w-full mt-4 flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-md"
          >
            <Play size={16} className="mr-2" />
            Watch Trailer
          </button>
        )}

        {/* Share Options */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Farcaster Share Component */}
          <div>
            <FarcasterShare movie={movie} />
          </div>

          {/* Telegram Share Component */}
          <div>
            <ShareToTelegram
              movieTitle={movie.title}
              movieDescription={movie.description}
              movieImageUrl={movie.posterUrl}
              userVote={userVote}
            />
          </div>
        </div>

        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Screenshots</h2>
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={screenshots[currentImageIndex] || "/placeholder.svg"}
                  alt={`${movie.title} screenshot ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="flex justify-center mt-2 gap-1">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? "bg-rose-600" : "bg-zinc-600"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Voting Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleVote(true)}
            className="py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            👍 Like
          </button>
          <button
            onClick={() => handleVote(false)}
            className="py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            👎 Dislike
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerUrl && (
        <VideoPlayer src={movie.trailerUrl} title={`${movie.title} - Trailer`} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  )
}
