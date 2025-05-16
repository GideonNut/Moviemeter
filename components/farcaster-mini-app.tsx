"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { sdk } from "@farcaster/frame-sdk"
import MovieDetail from "./movie-detail"
import { movies, type Movie } from "@/lib/movie-data"

export default function FarcasterMiniApp() {
  const [isReady, setIsReady] = useState(false)
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [userFid, setUserFid] = useState<number | null>(null)
  const [isAdded, setIsAdded] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState<any>(null)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [voteType, setVoteType] = useState<boolean | null>(null)

  useEffect(() => {
    // Initialize the app
    const initApp = async () => {
      try {
        // Get movie ID from location if available
        let movieId = "0"

        if (sdk.context.location?.type === "cast_embed") {
          const urlParams = new URLSearchParams(sdk.context.location.embed)
          const id = urlParams.get("id")
          if (id) {
            movieId = id
          }
        } else if (sdk.context.location?.type === "notification") {
          const urlPath = sdk.context.location.notification.notificationId
          const idMatch = urlPath.match(/movie-vote-(\d+)/)
          if (idMatch && idMatch[1]) {
            movieId = idMatch[1]
          }
        }

        // Set the current movie
        const movie = movies.find((m) => m.id === movieId) || movies[0]
        setCurrentMovie(movie)

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

        // Setup event listeners
        sdk.on("frameAdded", ({ notificationDetails }) => {
          setIsAdded(true)
          if (notificationDetails) {
            setNotificationDetails(notificationDetails)
          }
        })

        sdk.on("frameRemoved", () => {
          setIsAdded(false)
          setNotificationDetails(null)
        })

        sdk.on("notificationsEnabled", ({ notificationDetails }) => {
          setNotificationDetails(notificationDetails)
        })

        sdk.on("notificationsDisabled", () => {
          setNotificationDetails(null)
        })

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

    return () => {
      // Clean up event listeners
      sdk.removeAllListeners()
    }
  }, [])

  const handleAddApp = async () => {
    try {
      const result = await sdk.actions.addFrame()
      if (result.added) {
        setIsAdded(true)
        if (result.notificationDetails) {
          setNotificationDetails(result.notificationDetails)
        }
      }
    } catch (error) {
      console.error("Error adding app:", error)
    }
  }

  const handleVote = async (vote: boolean) => {
    if (!currentMovie) return

    setVoteType(vote)
    setVoteSubmitted(true)

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
            movieId: currentMovie.id,
            movieTitle: currentMovie.title,
            voteType: vote,
          }),
        })
      }

      // Close the app with a toast message
      await sdk.actions.close({
        toast: {
          message: `You voted ${vote ? "👍" : "👎"} for ${currentMovie.title}`,
        },
      })
    } catch (error) {
      console.error("Error handling vote:", error)
    }
  }

  const handleNextMovie = async () => {
    if (!currentMovie) return

    const currentIndex = movies.findIndex((m) => m.id === currentMovie.id)
    const nextIndex = (currentIndex + 1) % movies.length
    setCurrentMovie(movies[nextIndex])
    setVoteSubmitted(false)
    setVoteType(null)
  }

  const handleShareMovie = async () => {
    if (!currentMovie) return

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"
    const shareUrl = `${baseUrl}/share?id=${currentMovie.id}`

    try {
      await sdk.actions.openUrl(shareUrl)
    } catch (error) {
      console.error("Error opening share URL:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mb-4"></div>
        <p>Loading MovieMeter...</p>
      </div>
    )
  }

  if (!currentMovie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <p>No movie found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/moviemeter-logo.png"
            alt="MovieMeter"
            width={200}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        <MovieDetail movie={currentMovie} onVote={handleVote} />

        <div className="flex flex-col gap-3 mt-6">
          {!isAdded && (
            <button
              onClick={handleAddApp}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center justify-center"
            >
              <span className="mr-2">➕</span> Add MovieMeter
            </button>
          )}

          <button
            onClick={handleNextMovie}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center justify-center"
          >
            <span className="mr-2">➡️</span> Next Movie
          </button>

          <button
            onClick={handleShareMovie}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center justify-center"
          >
            <span className="mr-2">🔗</span> Share This Movie
          </button>
        </div>
      </div>
    </div>
  )
}

