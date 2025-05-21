"use client"

/**
 * VoteButtons Component
 *
 * Handles the voting UI and logic for a specific movie.
 * Uses the MovieContext for state management and voting functionality.
 */

import { useMovies } from "@/lib/state/MovieContext"
import { useActiveAccount } from "thirdweb/react"

interface VoteButtonsProps {
  movieId: number
}

export default function VoteButtons({ movieId }: VoteButtonsProps) {
  const { movies, voteForMovie, isVoting } = useMovies()
  const account = useActiveAccount()

  // Find the current movie in our context
  const movie = movies.find((m) => m.id === movieId)

  // If movie data isn't loaded yet, show loading state
  if (!movie) {
    return (
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="flex gap-3 w-full">
          <button disabled className="flex-1 px-4 py-2 rounded-lg text-white bg-zinc-700">
            👍 Yes (...)
          </button>
          <button disabled className="flex-1 px-4 py-2 rounded-lg text-white bg-zinc-700">
            👎 No (...)
          </button>
        </div>
        <p className="text-sm text-zinc-400">Loading vote data...</p>
      </div>
    )
  }

  const { voteCountYes, voteCountNo, hasVoted } = movie

  // Handle vote action
  const handleVote = async (voteType: boolean) => {
    if (!account?.address || hasVoted || isVoting) return
    await voteForMovie(movieId, voteType)
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex gap-3 w-full">
        <button
          onClick={() => handleVote(true)}
          disabled={isVoting || hasVoted || !account?.address}
          className={`flex-1 px-4 py-2 rounded-lg text-white ${
            hasVoted ? "bg-zinc-700" : "bg-green-600 hover:bg-green-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Vote Yes"
        >
          👍 Yes ({voteCountYes})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isVoting || hasVoted || !account?.address}
          className={`flex-1 px-4 py-2 rounded-lg text-white ${
            hasVoted ? "bg-zinc-700" : "bg-red-600 hover:bg-red-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Vote No"
        >
          👎 No ({voteCountNo})
        </button>
      </div>
      {hasVoted && <p className="text-sm text-zinc-400">You've already voted on this movie</p>}
      {!account?.address && <p className="text-sm text-zinc-400">Connect your wallet to vote</p>}
    </div>
  )
}
