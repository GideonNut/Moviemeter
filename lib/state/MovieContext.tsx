"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"
import { getMovieVotes } from "@/lib/blockchain-service"

interface MovieContextType {
  votes: Record<number, number>
  loadingVotes: boolean
  refreshVotes: (movieId: number) => Promise<void>
}

const MovieContext = createContext<MovieContextType>({
  votes: {},
  loadingVotes: false,
  refreshVotes: async () => {},
})

export const useMovie = () => useContext(MovieContext)

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [votes, setVotes] = useState<Record<number, number>>({})
  const [loadingVotes, setLoadingVotes] = useState(false)
  const account = useActiveAccount()
  const address = account?.address

  const refreshVotes = async (movieId: number) => {
    setLoadingVotes(true)
    try {
      const result = await getMovieVotes(movieId)
      if (result.success) {
        setVotes((prev) => ({
          ...prev,
          [movieId]: result.votes,
        }))
      }
    } catch (error) {
      console.error("Error refreshing votes:", error)
    } finally {
      setLoadingVotes(false)
    }
  }

  // Refresh votes when address changes
  useEffect(() => {
    if (address) {
      // Refresh votes for movies in the state
      Object.keys(votes).forEach((id) => {
        refreshVotes(Number(id))
      })
    }
  }, [address])

  return <MovieContext.Provider value={{ votes, loadingVotes, refreshVotes }}>{children}</MovieContext.Provider>
}
