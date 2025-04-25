"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ThumbsUp, Loader2, Sparkles } from "lucide-react"
import Header from "@/components/header"
import TelegramRecommendations from "@/components/telegram-recommendations"
import type { MovieRecommendation } from "@/lib/groq-service"
import { motion } from "framer-motion"

export default function RecommendationsPage() {
  const [preferences, setPreferences] = useState("")
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRecommendations = async () => {
    if (!preferences.trim()) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/recommendations/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences,
          count: 3,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to get recommendations")
      }

      const data = await response.json()
      setRecommendations(data.data)
      setSubmitted(true)
    } catch (err) {
      console.error("Error getting recommendations:", err)
      setError((err as Error).message || "Failed to get recommendations")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    getRecommendations()
  }

  // Example recommendations for first-time visitors
  useEffect(() => {
    if (!submitted && recommendations.length === 0) {
      setRecommendations([
        {
          title: "Inception",
          description:
            "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          releaseYear: "2010",
          genres: ["Action", "Adventure", "Sci-Fi"],
          rating: 8.8,
          reason: "Popular recommendation for first-time visitors",
          posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        },
        {
          title: "Parasite",
          description:
            "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
          releaseYear: "2019",
          genres: ["Comedy", "Drama", "Thriller"],
          rating: 8.5,
          reason: "Popular recommendation for first-time visitors",
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        },
        {
          title: "Everything Everywhere All at Once",
          description:
            "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
          releaseYear: "2022",
          genres: ["Action", "Adventure", "Comedy"],
          rating: 8.0,
          reason: "Popular recommendation for first-time visitors",
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
        },
      ])
    }
  }, [submitted, recommendations.length])

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Movie Recommendations</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Our AI analyzes your preferences to recommend movies you'll love. Tell us what you enjoy watching!
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-900 p-6 rounded-lg mb-10 border border-zinc-800"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="preferences" className="block text-sm font-medium text-zinc-300 mb-2">
                  What kind of movies do you enjoy?
                </label>
                <textarea
                  id="preferences"
                  rows={3}
                  placeholder="E.g., I like sci-fi movies with complex plots, psychological thrillers, and visually stunning films. I enjoy Christopher Nolan's work and movies that make me think."
                  className="w-full bg-zinc-800 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-rose-600 border border-zinc-700"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading || !preferences.trim()}
                  className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="mr-2" />
                      Get Groq Recommendations
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg mb-6"
            >
              <p className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {/* AI Recommendations */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  {submitted ? (
                    <>
                      <Sparkles size={20} className="mr-2 text-rose-500" />
                      Your Groq-Powered Recommendations
                    </>
                  ) : (
                    "Popular Recommendations"
                  )}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {recommendations.map((movie, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/3 aspect-[2/3] md:h-auto">
                          <Image
                            src={movie.posterUrl || "/placeholder.svg"}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                          {movie.rating && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                              <Star size={12} className="text-yellow-400 mr-1" />
                              {movie.rating.toFixed(1)}
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1">
                          <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                          <p className="text-zinc-400 text-sm mb-2">
                            {movie.releaseYear} • {movie.genres?.join(", ")}
                          </p>
                          <p className="text-zinc-300 text-sm line-clamp-3 mb-3">{movie.description}</p>

                          {movie.reason && (
                            <div className="bg-zinc-800 p-3 rounded-md mt-3 border border-zinc-700">
                              <p className="text-sm text-zinc-300">
                                <span className="font-semibold text-rose-500">Why we recommend this: </span>
                                {movie.reason}
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex justify-between">
                            <Link
                              href={`/movies/${index}`}
                              className="text-rose-500 hover:text-rose-400 text-sm font-medium"
                            >
                              View Details
                            </Link>
                            <button className="text-zinc-400 hover:text-white flex items-center text-sm">
                              <ThumbsUp size={16} className="mr-1" /> Like
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Telegram Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="md:col-span-1"
            >
              <TelegramRecommendations />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Sparkles size={18} className="mr-2 text-rose-500" />
              How Our Groq-Powered Recommendations Work
            </h3>
            <p className="text-zinc-400 mb-4">
              Our advanced AI system uses Groq's powerful language models to analyze your preferences, viewing history,
              and similar users' tastes to suggest movies you'll likely enjoy. We also pull fresh recommendations from
              our Movies Society Telegram channel to keep you updated with the latest trends!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-zinc-800 p-4 rounded-lg border border-zinc-700"
              >
                <div className="text-rose-500 font-bold text-lg mb-2">1</div>
                <h4 className="font-medium mb-1">Analyze Preferences</h4>
                <p className="text-zinc-500 text-sm">Groq processes your movie preferences and viewing history</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-zinc-800 p-4 rounded-lg border border-zinc-700"
              >
                <div className="text-rose-500 font-bold text-lg mb-2">2</div>
                <h4 className="font-medium mb-1">Match Patterns</h4>
                <p className="text-zinc-500 text-sm">Our AI identifies patterns and similar content</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-zinc-800 p-4 rounded-lg border border-zinc-700"
              >
                <div className="text-rose-500 font-bold text-lg mb-2">3</div>
                <h4 className="font-medium mb-1">Personalize Results</h4>
                <p className="text-zinc-500 text-sm">We deliver tailored recommendations just for you</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
