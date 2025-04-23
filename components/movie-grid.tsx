"use client"

import Image from "next/image"
import type { Movie } from "@/lib/movie-data"

interface MovieGridProps {
  movies: Movie[]
  title: string
  onSelectMovie?: (movie: Movie) => void
}

export default function MovieGrid({ movies, title, onSelectMovie }: MovieGridProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-900 rounded-lg overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => onSelectMovie?.(movie)}
          >
            <div className="relative aspect-[2/3] w-full">
              <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
              <div className="flex items-center text-xs text-zinc-400">
                <span>{movie.releaseYear}</span>
                {movie.rating && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
