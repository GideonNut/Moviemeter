"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Calendar, Heart, Share2, Play } from "lucide-react"
import MovieAnalysis from "@/components/movie-analysis"
import { motion } from "framer-motion"

// This would normally come from a database or API
const getMovieDetails = (id: string) => {
  return {
    id,
    title: "Dune: Part Two",
    year: "2024",
    rating: "PG-13",
    runtime: "166 min",
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
    releaseDate: "March 1, 2024",
    imdbRating: 8.8,
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. As he tries to prevent a terrible future, he must reconcile the love of his life with the fate of the universe.",
    director: "Denis Villeneuve",
    stars: [
      { id: "star1", name: "Timothée Chalamet" },
      { id: "star2", name: "Zendaya" },
      { id: "star3", name: "Rebecca Ferguson" },
      { id: "star4", name: "Javier Bardem" },
    ],
    posterUrl: "/placeholder.svg?height=600&width=400",
    backdropUrl: "/placeholder.svg?height=800&width=1600",
    trailerUrl: "#",
  }
}

export default function MoviePage({ params }: { params: { id: string } }) {
  const movie = getMovieDetails(params.id)
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)

  return (
    <motion.main
      className="min-h-screen bg-zinc-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Movie Backdrop */}
      <motion.div
        className="relative h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src={movie.backdropUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </motion.div>

            <div className="mt-4 flex flex-col space-y-3">
              <motion.button
                className="flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded-md font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTrailerPlaying(true)}
              >
                <Play size={18} className="mr-2" />
                Watch Trailer
              </motion.button>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={18} className="mr-2" />
                  Add to Watchlist
                </motion.button>
                <motion.button
                  className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={18} className="mr-2" />
                  Share
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Movie Details */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {movie.title} <span className="text-zinc-400">({movie.year})</span>
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center text-sm text-zinc-400 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="mr-3">{movie.rating}</span>
              <span className="flex items-center mr-3">
                <Clock size={14} className="mr-1" /> {movie.runtime}
              </span>
              <span className="flex items-center mr-3">
                <Calendar size={14} className="mr-1" /> {movie.releaseDate}
              </span>
              <div className="flex items-center">
                {movie.genres.map((genre, index) => (
                  <Link key={genre} href={`/genre/${genre.toLowerCase()}`} className="hover:text-rose-500">
                    {genre}
                    {index < movie.genres.length - 1 ? ", " : ""}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex items-center mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 mr-4">
                <Star size={20} className="text-yellow-400 mr-1" />
                <span className="font-bold">{movie.imdbRating}</span>
                <span className="text-zinc-400 text-sm ml-1">/10</span>
              </div>
              <motion.button
                className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Rate This
              </motion.button>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-zinc-300">{movie.plot}</p>
            </motion.div>

            <motion.div
              className="border-t border-zinc-800 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-zinc-400 mb-1">Director</h3>
                  <Link
                    href={`/name/${movie.director.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-rose-500"
                  >
                    {movie.director}
                  </Link>
                </div>

                <div>
                  <h3 className="text-zinc-400 mb-1">Stars</h3>
                  <div>
                    {movie.stars.map((star, index) => (
                      <span key={star.id}>
                        <Link href={`/name/${star.id}`} className="hover:text-rose-500">
                          {star.name}
                        </Link>
                        {index < movie.stars.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Groq AI Analysis Section */}
        <motion.section
          className="mt-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <MovieAnalysis movieTitle={movie.title} />
        </motion.section>

        {/* Similar Movies Section */}
        <motion.section
          className="mt-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              >
                <Link href={`/movies/similar-${i}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=200`}
                      alt={`Similar movie ${i}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium group-hover:text-rose-500">Similar Movie {i}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Trailer Modal */}
      {isTrailerPlaying && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-4xl aspect-video bg-black"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <iframe
              src={movie.trailerUrl}
              title={`${movie.title} - Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <motion.button
              onClick={() => setIsTrailerPlaying(false)}
              className="absolute top-4 right-4 text-white hover:text-rose-500 bg-black/50 rounded-full p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.main>
  )
}
