"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, Bell, MessageCircle } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"
import Header from "@/components/header"

interface Movie {
  _id: string
  id: number
  title: string
  description: string
  posterUrl?: string
  isTVSeries?: boolean
  createdAt: string
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const account = useActiveAccount()
  const address = account?.address

  useEffect(() => {
    if (address) {
      fetchWatchlist()
    } else {
      setLoading(false)
    }
  }, [address])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/watchlist?address=${address}`)
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist")
      }
      const data = await response.json()
      setWatchlist(data)
      
      // Fetch comment counts for all movies
      const counts: Record<string, number> = {}
      for (const movie of data) {
        try {
          const commentResponse = await fetch(`/api/comments?movieId=${movie._id}`)
          if (commentResponse.ok) {
            const comments = await commentResponse.json()
            counts[movie._id] = comments.length
          }
        } catch (error) {
          console.error("Failed to fetch comment count for movie:", movie._id)
          counts[movie._id] = 0
        }
      }
      setCommentCounts(counts)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (movieId: string) => {
    try {
      const response = await fetch(`/api/watchlist?address=${address}&movieId=${movieId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to remove from watchlist")
      }
      
      // Remove from local state
      setWatchlist(prev => prev.filter(movie => movie._id !== movieId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!address) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <Bell size={64} className="mx-auto text-zinc-400 mb-4" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Watchlist</h1>
            <p className="text-zinc-400 mb-6">Connect your wallet to view and manage your watchlist</p>
            <div className="bg-zinc-900 p-6 rounded-lg max-w-md mx-auto">
              <p className="text-zinc-300">Please connect your wallet to access your watchlist</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="aspect-[2/3] bg-zinc-800 animate-pulse" />
                <div className="p-4">
                  <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-8 w-20 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-zinc-800 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-zinc-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">Watchlist</span>
        </nav>
        
        <Link href="/" className="inline-flex items-center text-rose-500 hover:text-rose-400 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell size={32} className="text-rose-500" />
            <h1 className="text-4xl font-bold">Your Watchlist</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            {watchlist.length === 0 
              ? "No movies in your watchlist yet. Start adding movies you want to watch!"
              : `You have ${watchlist.length} movie${watchlist.length === 1 ? '' : 's'} in your watchlist`
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-zinc-900 p-8 rounded-lg max-w-md mx-auto">
              <Bell size={48} className="mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-400 mb-4">Your watchlist is empty</p>
              <Link 
                href="/movies" 
                className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                Browse Movies
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((movie) => (
              <div key={movie._id} className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors group">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={movie.posterUrl || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove button overlay */}
                  <button
                    onClick={() => removeFromWatchlist(movie._id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Remove from watchlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-4">
                  <Link href={`/movies/${movie._id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-rose-500 transition-colors line-clamp-2 mb-2">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-3">
                    {movie.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{new Date(movie.createdAt).getFullYear()}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} className="text-zinc-400" />
                        {commentCounts[movie._id] || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell size={14} className="text-rose-500" />
                        In Watchlist
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
