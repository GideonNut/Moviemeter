"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, Share2, ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/lib/state/MovieContext"

interface FarcasterMiniAppProps {
  movie?: Movie
  onVote?: (movieId: number, voteType: boolean) => Promise<void>
  onNextMovie?: () => void
  isVoting?: boolean
  transactionStatus?: "idle" | "pending" | "success" | "error"
  walletConnected?: boolean
}

export default function FarcasterMiniApp({
  movie,
  onVote,
  onNextMovie,
  isVoting = false,
  transactionStatus = "idle",
  walletConnected = false,
}: FarcasterMiniAppProps) {
  const [isSharing, setIsSharing] = useState(false)

  // Default movie data if none provided
  const defaultMovie = {
    id: 0,
    title: "Inception",
    description: "A thief enters dreams to steal secrets.",
    voteCountYes: 42,
    voteCountNo: 7,
    hasVoted: false,
  }

  const currentMovie = movie || defaultMovie

  const handleVote = async (voteType: boolean) => {
    if (onVote && currentMovie) {
      await onVote(currentMovie.id, voteType)
    }
  }

  const handleShare = () => {
    setIsSharing(true)
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false)
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-purple-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="relative h-8 w-32">
            <Image src="/images/new-logo.png" alt="MovieMeter" fill className="object-contain" priority />
          </div>
          <Badge variant="outline" className="bg-white text-purple-700">
            Farcaster App
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="aspect-[2/3] relative mb-4 rounded-md overflow-hidden">
          <Image
            src={`/placeholder-8k514.png?height=450&width=300&text=${encodeURIComponent(currentMovie.title)}`}
            alt={currentMovie.title}
            fill
            className="object-cover"
          />
        </div>

        <h3 className="text-xl font-bold mb-2">{currentMovie.title}</h3>
        <p className="text-gray-600 mb-4">{currentMovie.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <ThumbsUp className="h-5 w-5 text-green-500 mr-1" />
            <span className="font-medium">{currentMovie.voteCountYes}</span>
          </div>
          <div className="flex items-center">
            <ThumbsDown className="h-5 w-5 text-red-500 mr-1" />
            <span className="font-medium">{currentMovie.voteCountNo}</span>
          </div>
        </div>

        {transactionStatus === "success" && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
            Vote successfully recorded on the blockchain!
          </div>
        )}

        {transactionStatus === "error" && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">Transaction failed. Please try again.</div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 bg-gray-50">
        {!walletConnected ? (
          <div className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-md text-center">
            Connect your wallet to vote
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              onClick={() => handleVote(true)}
              disabled={isVoting || currentMovie.hasVoted}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {isVoting ? "Voting..." : "Yes"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={() => handleVote(false)}
              disabled={isVoting || currentMovie.hasVoted}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              {isVoting ? "Voting..." : "No"}
            </Button>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={handleShare} disabled={isSharing}>
            <Share2 className="h-4 w-4 mr-2" />
            {isSharing ? "Sharing..." : "Share This Movie"}
          </Button>
          <Button variant="default" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={onNextMovie}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Next Movie
          </Button>
        </div>

        <Button variant="outline" className="w-full border-purple-200">
          <Plus className="h-4 w-4 mr-2" />
          Add MovieMeter
        </Button>
      </CardFooter>
    </Card>
  )
}
