"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ThumbsUp, Search, Loader2 } from "lucide-react"
import Header from "@/components/header"
import type { MovieData } from "@/lib/ai-agent"

export default function RecommendationsPage() {
  const [preferences, setPreferences] = useState("")
  const [recommendations, setRecommendations] = useState<(MovieData & { recommendationReason?: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const getRecommendations = async () => {
    if (!preferences.trim()) return

    try {
      setLoading(true)

      // In a real implementation, this would call your API
      // For demo purposes, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockRecommendations: (MovieData & { recommendationReason: string })[] = [
        {
          id: "2",
          title: "The Dark Knight",
          description:
            "Batman faces off against the Joker in an epic battle for Gotham's soul. As the Joker unleashes chaos, Batman must confront his own demons while trying to save the city.",
          releaseDate: "2008-07-18",
          genres: ["Action", "Crime", "Drama"],
          rating: 9.0,
          lastUpdated: new Date().toISOString(),
          posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
          backdropUrl: "https://m.media-amazon.com/images/M/MV5BMTM5OTMyMjIxOV5BMl5BanBnXkFtZTcwNzU3MTIzMw@@._V1_.jpg",
          recommendationReason:
            "Based on your interest in complex characters and psychological thrillers, this film offers an intense exploration of chaos versus order with Heath Ledger's iconic performance as the Joker.",
        },
        {
          id: "1",
          title: "Interstellar",
          description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. The film explores themes of love, time, and the human spirit.",
          releaseDate: "2014-11-07",
          genres: ["Adventure", "Drama", "Sci-Fi"],
          rating: 8.6,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          backdropUrl: "https://m.media-amazon.com/images/M/MV5BMjIxNTU4MzY4MF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_.jpg",
          recommendationReason:
            "Your preference for thought-provoking sci-fi aligns perfectly with this film's blend of emotional storytelling and scientific concepts like relativity and higher dimensions.",
        },
        {
          id: "5",
          title: "Blade Runner 2049",
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
          releaseDate: "2017-10-06",
          genres: ["Action", "Drama", "Mystery", "Sci-Fi"],
          rating: 8.0,
          lastUpdated: new Date().toISOString(),
          posterUrl: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BZWQzZmFhMTMtNjUzYS00YjYyLWE5ZDYtY2Q0ZTVjZDZkYTljXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
          recommendationReason:
            "Given your interest in visually stunning films with philosophical themes, this sequel expands on the original's questions about humanity and identity with breathtaking cinematography.",
        },
      ]

      setRecommendations(mockRecommendations)
      setSubmitted(true)
    } catch (error) {
      console.error("Error getting recommendations:", error)
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
          id: "0",
          title: "Inception",
          description:
            "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          releaseDate: "2010-07-16",
          genres: ["Action", "Adventure", "Sci-Fi"],
          rating: 8.8,
          lastUpdated: new Date().toISOString(),
          posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BMTM4OGIzMWMtMjkwZS00ZTIwLWI1MTktY2E1NWI0NGM0MWRjXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        },
        {
          id: "3",
          title: "Avengers: Endgame",
          description:
            "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
          releaseDate: "2019-04-26",
          genres: ["Action", "Adventure", "Drama"],
          rating: 8.4,
          lastUpdated: new Date().toISOString(),
          posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BNzk1OGU2NmMtNTdhZC00NjdlLWE5YTMtZTQ0MGExZTQzOGQyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        },
        {
          id: "4",
          title: "Parasite",
          description:
            "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
          releaseDate: "2019-10-11",
          genres: ["Comedy", "Drama", "Thriller"],
          rating: 8.5,
          lastUpdated: new Date().toISOString(),
          posterUrl:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
          backdropUrl:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        },
      ])
    }
  }, [submitted, recommendations.length])

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Movie Recommendations</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Our AI analyzes your preferences to recommend movies you'll love. Tell us what you enjoy watching!
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg mb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="preferences" className="block text-sm font-medium text-zinc-300 mb-2">
                  What kind of movies do you enjoy?
                </label>
                <textarea
                  id="preferences"
                  rows={3}
                  placeholder="E.g., I like sci-fi movies with complex plots, psychological thrillers, and visually stunning films. I enjoy Christopher Nolan's work and movies that make me think."
                  className="w-full bg-zinc-800 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-rose-600"
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
                      <Search size={20} className="mr-2" />
                      Get Recommendations
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {submitted ? "Your Personalized Recommendations" : "Popular Recommendations"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((movie) => (
                <div key={movie.id} className="bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="relative aspect-[2/3] overflow-hidden">
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

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                    <p className="text-zinc-400 text-sm mb-2">
                      {new Date(movie.releaseDate).getFullYear()} • {movie.genres?.join(", ")}
                    </p>
                    <p className="text-zinc-300 text-sm line-clamp-3 mb-3">{movie.description}</p>

                    {movie.recommendationReason && (
                      <div className="bg-zinc-800 p-3 rounded-md mt-3">
                        <p className="text-sm text-zinc-300 italic">
                          <span className="font-semibold text-rose-500">Why we recommend this: </span>
                          {movie.recommendationReason}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between">
                      <Link
                        href={`/movies/${movie.id}`}
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
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">How Our AI Recommendations Work</h3>
            <p className="text-zinc-400 mb-4">
              Our advanced AI analyzes your preferences, viewing history, and similar users' tastes to suggest movies
              you're likely to enjoy. The more specific you are about what you like, the better our recommendations will
              be!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-rose-500 font-bold text-lg mb-2">1</div>
                <h4 className="font-medium mb-1">Analyze Preferences</h4>
                <p className="text-zinc-500 text-sm">We process your movie preferences and viewing history</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-rose-500 font-bold text-lg mb-2">2</div>
                <h4 className="font-medium mb-1">Match Patterns</h4>
                <p className="text-zinc-500 text-sm">Our AI identifies patterns and similar content</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-rose-500 font-bold text-lg mb-2">3</div>
                <h4 className="font-medium mb-1">Personalize Results</h4>
                <p className="text-zinc-500 text-sm">We deliver tailored recommendations just for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
