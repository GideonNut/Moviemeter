"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, RefreshCw } from "lucide-react"
import type { MovieData } from "@/lib/ai-agent"

export default function NewMoviesSection() {
  const [movies, setMovies] = useState<MovieData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real implementation, this would call your API
      // For demo purposes, we'll use mock data
      const mockNewMovies: MovieData[] = [
        {
          id: "4",
          title: "Dune: Part Three",
          description:
            "The epic conclusion to the Dune saga follows Paul Atreides as he navigates the complex politics of Arrakis and fulfills his destiny.",
          releaseDate: "2026-11-20",
          genres: ["Sci-Fi", "Adventure", "Drama"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjhkZWY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
        },
        {
          id: "5",
          title: "Blade Runner 2099",
          description:
            "Set fifty years after Blade Runner 2049, this new chapter explores the evolution of replicants and humanity in a world transformed by climate change.",
          releaseDate: "2025-10-15",
          genres: ["Sci-Fi", "Thriller", "Mystery"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BZWQzZmFhMTMtNjUzYS00YjYyLWE5ZDYtY2Q0ZTVjZDZkYTljXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
        },
        {
          id: "6",
          title: "The Batman: Gotham Knights",
          description:
            "Batman teams up with his extended family of vigilantes to take on a criminal conspiracy that threatens to destroy Gotham City from within.",
          releaseDate: "2025-07-04",
          genres: ["Action", "Crime", "Superhero"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BMTExZmVjY2ItYTAzYi00MDdlLWFlOWItNTJhMDRjMzQ5ZGY0XkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_.jpg",
        },
      ]

      setMovies(mockNewMovies)
    } catch (err) {
      setError("Failed to fetch new movies")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">AI-Discovered New Releases</h2>
        <button
          onClick={fetchMovies}
          disabled={loading}
          className="flex items-center text-rose-500 hover:text-rose-400"
        >
          <RefreshCw size={20} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-md mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
            <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={movie.posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center mb-1">
                  <Star size={16} className="text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">AI Recommended</span>
                </div>
                <h2 className="font-medium group-hover:text-rose-500 transition-colors line-clamp-1">{movie.title}</h2>
                <p className="text-zinc-400 text-sm">{new Date(movie.releaseDate).getFullYear()}</p>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{movie.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

