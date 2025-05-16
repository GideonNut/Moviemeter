"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"

interface VoteButtonsProps {
  movieId: number
  initialUpvotes?: number
  initialDownvotes?: number
}

export default function VoteButtons({ movieId, initialUpvotes = 0, initialDownvotes = 0 }: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState("")
  const account = useActiveAccount()
  const address = account?.address

  const handleVote = async (voteType: "up" | "down") => {
    if (!address) {
      setError("Please connect your wallet to vote")
      return
    }

    setIsVoting(true)
    setError("")

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          voteType,
          walletAddress: address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to vote")
      }

      if (voteType === "up") {
        setUpvotes(upvotes + 1)
      } else {
        setDownvotes(downvotes + 1)
      }
    } catch (err: any) {
      setError(err.message || "Failed to vote")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleVote("up")}
          disabled={isVoting || !address}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsUp size={18} />
          <span>{upvotes}</span>
        </button>

        <button
          onClick={() => handleVote("down")}
          disabled={isVoting || !address}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsDown size={18} />
          <span>{downvotes}</span>
        </button>
      </div>

      {!address && <p className="text-amber-500">Connect your wallet to vote</p>}

      {error && <p className="text-red-500">{error}</p>}

      {isVoting && <p className="text-blue-500">Processing your vote...</p>}
    </div>
  )
}
