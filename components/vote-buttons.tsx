"use client"

import { useMovies } from "@/lib/state/MovieContext"
import { useActiveAccount } from "thirdweb/react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VoteButtonsProps {
  movieId: number
}

export default function VoteButtons({ movieId }: VoteButtonsProps) {
  const { movies, voteForMovie, isVoting } = useMovies()
  const account = useActiveAccount()
  const [localIsVoting, setLocalIsVoting] = useState(false)
  const [voteSuccess, setVoteSuccess] = useState(false)

  // Find the current movie in our context
  const movie = movies.find((m) => m.id === movieId)

  // If movie data isn't loaded yet, show loading state
  if (!movie) {
    return (
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="flex gap-3 w-full">
          <motion.div
            className="flex-1 h-10 bg-[#222222] rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          />
          <motion.div
            className="flex-1 h-10 bg-[#222222] rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.2 }}
          />
        </div>
        <motion.p
          className="text-sm text-zinc-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          Loading vote data...
        </motion.p>
      </div>
    )
  }

  const { voteCountYes, voteCountNo, hasVoted } = movie

  // Handle vote action
  const handleVote = async (voteType: boolean) => {
    if (!account?.address || hasVoted || isVoting || localIsVoting) return

    setLocalIsVoting(true)
    setVoteSuccess(false)

    try {
      await voteForMovie(movieId, voteType)
      setVoteSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setVoteSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setLocalIsVoting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex gap-3 w-full">
        <motion.button
          onClick={() => handleVote(true)}
          disabled={isVoting || localIsVoting || hasVoted || !account?.address}
          whileHover={!hasVoted && account?.address ? { scale: 1.05 } : {}}
          whileTap={!hasVoted && account?.address ? { scale: 0.95 } : {}}
          className={`flex-1 px-4 py-2 rounded-full text-white transition-colors duration-300 ${
            hasVoted ? "bg-[#222222]" : "bg-[#1a662a] hover:bg-[#1d7a32]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Vote Yes"
        >
          {(isVoting || localIsVoting) && voteCountYes === movie.voteCountYes + 1 ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></path>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Voting...
            </span>
          ) : (
            <>👍 Yes ({voteCountYes})</>
          )}
        </motion.button>
        <motion.button
          onClick={() => handleVote(false)}
          disabled={isVoting || localIsVoting || hasVoted || !account?.address}
          whileHover={!hasVoted && account?.address ? { scale: 1.05 } : {}}
          whileTap={!hasVoted && account?.address ? { scale: 0.95 } : {}}
          className={`flex-1 px-4 py-2 rounded-full text-white transition-colors duration-300 ${
            hasVoted ? "bg-[#222222]" : "bg-[#662a2a] hover:bg-[#7a3232]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Vote No"
        >
          {(isVoting || localIsVoting) && voteCountNo === movie.voteCountNo + 1 ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Voting...
            </span>
          ) : (
            <>👎 No ({voteCountNo})</>
          )}
        </motion.button>
      </div>
      {hasVoted && <p className="text-sm text-zinc-400">You've already voted on this movie</p>}
      {!account?.address && <p className="text-sm text-zinc-400">Connect your wallet to vote</p>}
      <AnimatePresence>
        {voteSuccess && (
          <motion.p
            className="text-sm text-green-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Vote recorded successfully!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
