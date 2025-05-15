"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/farcaster-sdk"
import { ThumbsUp, ThumbsDown, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { movies } from "@/lib/movie-data"
import MiniAppNavigation from "@/components/mini-app-navigation"
import { safeParseInt } from "@/lib/bigint-utils"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const movieId = Number.parseInt(params.id, 10)
  const [userFid, setUserFid] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const movie = movies.find((m) => m.id === params.id) || movies[0]

  useEffect(() => {
    try {
      // Get user FID from context
      if (sdk?.context?.user?.fid) {
        // Safely parse FID as it might be a BigInt
        setUserFid(safeParseInt(sdk.context.user.fid))
      }
    } catch (err) {
      console.error("Error initializing app:", err)
      setError("Failed to initialize app. Please try again.")
    }
  }, [])

  const handleVote = async (voteType: boolean) => {
    try {
      setIsVoting(true)
      setTransactionStatus("pending")

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTransactionStatus("success")

      // Show success toast
      try {
        await sdk.actions.showToast({
          message: `You voted ${voteType ? "👍" : "👎"} for ${movie.title}`,
          type: "success",
        })
      } catch (err) {
        console.error("Error showing toast:", err)
      }
    } catch (error) {
      console.error("Error voting:", error)
      setTransactionStatus("error")
    } finally {
      setIsVoting(false)
    }
  }

  const handleBack = () => {
    try {
      // Use internal navigation instead of external URL
      router.push("/mini")
    } catch (err) {
      console.error("Error navigating back:", err)
    }
  }

  const handleShare = async () => {
    try {
      await sdk.actions.composeCast({
        text: `I'm voting on ${movie.title} on MovieMeter! What do you think?`,
        embeds: [`https://moviemeter13.vercel.app/mini/movie/${movie.id}`],
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-black hover:bg-gray-900 text-white">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4">
        <Card className="w-full max-w-md mx-auto border-2 border-gray-200 shadow-md m-4">
          <CardHeader className="bg-black text-white p-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="text-white p-0" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Badge variant="outline" className="bg-white text-black">
                Movie Details
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-white text-black">
            <div className="aspect-[2/3] relative mb-4 rounded-md overflow-hidden">
              {movie.posterUrl && (
                <div className="w-full h-full relative">
                  <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
            <p className="text-gray-600 mb-4">{movie.description}</p>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <ThumbsUp className="h-5 w-5 text-black mr-1" />
                <span className="font-medium">{safeParseInt(movie.voteCountYes)}</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="h-5 w-5 text-black mr-1" />
                <span className="font-medium">{safeParseInt(movie.voteCountNo)}</span>
              </div>
            </div>

            {transactionStatus === "success" && (
              <div className="bg-gray-100 text-black p-3 rounded-md mb-4">
                Vote successfully recorded on the blockchain!
              </div>
            )}

            {transactionStatus === "error" && (
              <div className="bg-gray-100 text-black p-3 rounded-md mb-4">Transaction failed. Please try again.</div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 p-4 bg-black">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-gray-100 text-black border-white"
                onClick={() => handleVote(true)}
                disabled={isVoting}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {isVoting ? "Voting..." : "Yes"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-gray-100 text-black border-white"
                onClick={() => handleVote(false)}
                disabled={isVoting}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {isVoting ? "Voting..." : "No"}
              </Button>
            </div>

            <Button variant="outline" className="w-full text-white border-white" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share This Movie
            </Button>
          </CardFooter>
        </Card>
      </div>

      <MiniAppNavigation />
    </div>
  )
}
