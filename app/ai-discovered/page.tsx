"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import type { MovieData } from "@/lib/ai-agent"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

export default function NewMoviesSection() {
  const [movies, setMovies] = useState<MovieData[]>([])
  const [visibleMovies, setVisibleMovies] = useState<MovieData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Use intersection observer to detect when component is in view
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const fetchMovies = useCallback(async () => {
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
            "The epic conclusion to the Dune saga follows Paul Atreides as he navigates the complex politics of Arrakis.",
          releaseDate: "2026-11-20",
          genres: ["Sci-Fi", "Adventure", "Drama"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dune.jpg-OrhXhtzHwTERlWv2WmCKk6flxZkmya.jpeg",
          backdropUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dune.jpg-OrhXhtzHwTERlWv2WmCKk6flxZkmya.jpeg",
        },
        {
          id: "5",
          title: "Blade Runner 2099",
          description:
            "Set fifty years after Blade Runner 2049, this new chapter explores the evolution of replicants and humanity.",
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
          description: "Batman teams up with his extended family of vigilantes to take on a criminal conspiracy.",
          releaseDate: "2025-07-04",
          genres: ["Action", "Crime", "Superhero"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BMTExZmVjY2ItYTAzYi00MDdlLWFlOWItNTJhMDRjMzQ5ZGY0XkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_.jpg",
        },
        {
          id: "7",
          title: "Venom: The Last Dance",
          description: "Eddie Brock and Venom face their most dangerous challenge yet in this thrilling conclusion.",
          releaseDate: "2024-10-25",
          genres: ["Action", "Sci-Fi", "Horror"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/venom.jpg-rj7NDcBskMVFwvvqxFSuEncIX9Pjbz.jpeg",
          backdropUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/venom.jpg-rj7NDcBskMVFwvvqxFSuEncIX9Pjbz.jpeg",
        },
        {
          id: "8",
          title: "Lagos Love Story",
          description: "A romantic drama set in the vibrant city of Lagos, following interconnected love stories.",
          releaseDate: "2025-02-14",
          genres: ["Romance", "Drama"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8814.JPG-faPnQbdc4HEqRxGylIyfkndUOm7dQ6.jpeg",
          backdropUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8814.JPG-faPnQbdc4HEqRxGylIyfkndUOm7dQ6.jpeg",
        },
        {
          id: "9",
          title: "Beauty in Black",
          description: "A powerful drama about a family's journey through adversity and triumph.",
          releaseDate: "2025-01-15",
          genres: ["Drama", "Biography"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8815.JPG-R3fdG1tKhsykL3akXXsmFErVgkGrtw.jpeg",
          backdropUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8815.JPG-R3fdG1tKhsykL3akXXsmFErVgkGrtw.jpeg",
        },
        {
          id: "10",
          title: "The Khumalos",
          description: "A comedy series about a wealthy family who loses everything and must rebuild their lives.",
          releaseDate: "2025-03-20",
          genres: ["Comedy", "Drama"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8816.JPG-BpaQGH9kb9HgVSiEVW8HImxkyrewtI.jpeg",
          backdropUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8816.JPG-BpaQGH9kb9HgVSiEVW8HImxkyrewtI.jpeg",
        },
        {
          id: "11",
          title: "Baby Farm",
          description: "A suspenseful thriller about a journalist who uncovers a dark conspiracy.",
          releaseDate: "2025-05-10",
          genres: ["Thriller", "Mystery"],
          isNew: true,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8817.JPG-2gC5kcXflj3HL4e2cqN1PdbjsG8rh7.jpeg",
          backdropUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8817.JPG-2gC5kcXflj3HL4e2cqN1PdbjsG8rh7.jpeg",
        },
      ]

      setMovies(mockNewMovies)

      // Initially show only the first 4 movies for better performance
      setVisibleMovies(mockNewMovies.slice(0, 4))

      // After a short delay, show all movies
      setTimeout(() => {
        setVisibleMovies(mockNewMovies)
      }, 500)
    } catch (err) {
      setError("Failed to fetch new movies")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      fetchMovies()
    }
  }, [inView, fetchMovies])

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }, [])

  // Simplified animations for better performance
  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  }

  return (
    <motion.section ref={ref} className="mb-12" {...containerAnimation}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">AI-Discovered New Releases</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMovies}
            disabled={loading}
            className="flex items-center text-rose-500 hover:text-rose-400"
          >
            <RefreshCw size={18} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-md mb-4">{error}</div>}

      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleMovies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[180px]">
              <Link href={`/movies/${movie.id}`} className="group">
                <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors h-full border border-zinc-800">
                  <div className="relative aspect-[2/3] w-full">
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

                  <div className="p-2">
                    <h2 className="font-medium text-sm group-hover:text-rose-500 transition-colors line-clamp-1">
                      {movie.title}
                    </h2>
                    <p className="text-zinc-400 text-xs">{new Date(movie.releaseDate).getFullYear()}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation arrows - only show when needed */}
        {visibleMovies.length > 3 && (
          <>
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 ${isHovering ? "opacity-100" : "opacity-0"} transition-opacity z-10`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 ${isHovering ? "opacity-100" : "opacity-0"} transition-opacity z-10`}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Add a gradient fade effect on the right side to indicate more content */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
      </div>
    </motion.section>
  )
} 