"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"
import { getMovieVotes, hasUserVotedForMovie } from "@/lib/blockchain-service"

interface MovieContextType {
  votes: Record<string, any>
  userVotes: Record<string, boolean>
  loadVotes: (movieId: string) => Promise<void>
  refreshVotes: (movieId: string) => Promise<void>
}

const MovieContext = createContext<MovieContextType>({
  votes: {},
  userVotes: {},
  loadVotes: async () => {},
  refreshVotes: async () => {},
})

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [votes, setVotes] = useState<Record<string, any>>({})
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({})
  const account = useActiveAccount()
  const address = account?.address

  const loadVotes = async (movieId: string) => {
    try {
      const movieVotes = await getMovieVotes(movieId)
      if (movieVotes) {
        setVotes((prev) => ({ ...prev, [movieId]: movieVotes }))
      }

      if (address) {
        const hasVoted = await hasUserVotedForMovie(movieId, address)
        setUserVotes((prev) => ({ ...prev, [movieId]: hasVoted }))
      }
    } catch (error) {
      console.error("Error loading votes:", error)
    }
  }

  const refreshVotes = async (movieId: string) => {
    await loadVotes(movieId)
  }

  // Refresh votes when address changes
  useEffect(() => {
    if (address) {
      Object.keys(votes).forEach((movieId) => {
        loadVotes(movieId)
      })
    }
  }, [address])

  return <MovieContext.Provider value={{ votes, userVotes, loadVotes, refreshVotes }}>{children}</MovieContext.Provider>
}
