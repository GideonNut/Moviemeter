"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"

interface MovieContextType {
  votes: Record<string, any>
  userVotes: Record<string, boolean>
  loadVotes: (movieId: string) => Promise<void>
  refreshVotes: (movieId: string) => Promise<void>
  submitVote: (movieId: string, voteType: boolean) => Promise<void>
}

const MovieContext = createContext<MovieContextType>({
  votes: {},
  userVotes: {},
  loadVotes: async () => {},
  refreshVotes: async () => {},
  submitVote: async () => {},
})

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [votes, setVotes] = useState<Record<string, any>>({})
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({})
  const account = useActiveAccount()
  const address = account?.address

  const loadVotes = async (movieId: string) => {
    try {
      const res = await fetch(`/api/votes/${movieId}`)
      const movieVotes = await res.json()
      if (movieVotes) {
        setVotes((prev) => ({ ...prev, [movieId]: movieVotes }))
      }
      if (address) {
        setUserVotes((prev) => ({ ...prev, [movieId]: movieVotes.voters.includes(address) }))
      }
    } catch (error) {
      console.error("Error loading votes from Apillon API:", error)
    }
  }

  const refreshVotes = async (movieId: string) => {
    await loadVotes(movieId)
  }

  // Submit a vote and refresh Apillon votes
  const submitVote = async (movieId: string, voteType: boolean) => {
    if (!address) return
    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, voteType, address }),
      })
      // After voting, refresh Apillon votes
      await refreshVotes(movieId)
    } catch (error) {
      console.error("Error submitting vote to Apillon:", error)
    }
  }

  // Refresh votes when address changes
  useEffect(() => {
    if (address) {
      Object.keys(votes).forEach((movieId) => {
        loadVotes(movieId)
      })
    }
  }, [address])

  return (
    <MovieContext.Provider value={{ votes, userVotes, loadVotes, refreshVotes, submitVote }}>
      {children}
    </MovieContext.Provider>
  )
}
