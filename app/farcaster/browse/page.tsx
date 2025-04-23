"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { sdk } from "@farcaster/frame-sdk"
import { movies, type Movie } from "@/lib/movie-data"
import MovieGrid from "@/components/movie-grid"
import MovieDetail from "@/components/movie-detail"

export default function BrowsePage() {
  const [isReady, setIsReady] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [userFid, setUserFid] = useState<number | null>(null)
  const [isAdded, setIsAdded] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState<any>(null)

  useEffect(() => {
    // Initialize the app
    const initApp = async () => {
      try {
        // Get user FID
        if (sdk.context.user?.fid) {
          setUserFid(sdk.context.user.fid)
        }

        // Check if app is added
        setIsAdded(sdk.context.client.added || false)

        // Get notification details if available
        if (sdk.context.client.notificationDetails) {
          setNotificationDetails(sdk.context.client.notificationDetails)
        }

        setLoading(false)

        // Tell the client we're ready
        await sdk.actions.ready()
        setIsReady(true)
      } catch (error) {
        console.error("Error initializing app:", error)
        setLoading(false)
      }
    }

    initApp()
  }, [])

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  const handleVote = async (vote: boolean) => {
    if (!selectedMovie) return

    try {
      // Send notification to other users if the app is added
      if (userFid && notificationDetails) {
        await fetch("/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fid: userFid,
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            voteType: vote,
          }),
        })
      }

      // Close the app with a toast message
      await sdk.actions.close({
        toast: {
          message: `You voted ${vote ? "👍" : "👎"} for ${selectedMovie.title}`,
        },
      })
    } catch (error) {
      console.error("Error handling vote:", error)
    }
  }

  const handleBack = () => {
    setSelectedMovie(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mb-4"></div>
        <p>Loading MovieMeter...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Image src="/mm-logo-new.png" alt="MovieMeter Logo" width={120} height={80} className="object-contain" />
        </div>

        {selectedMovie ? (
          <div>
            <button onClick={handleBack} className="mb-4 flex items-center text-zinc-400 hover:text-white">
              ← Back to Browse
            </button>
            <MovieDetail movie={selectedMovie} onVote={handleVote} />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Browse Movies</h1>
            <MovieGrid movies={movies} title="All Movies" onSelectMovie={handleSelectMovie} />
          </>
        )}
      </div>
    </div>
  )
}

