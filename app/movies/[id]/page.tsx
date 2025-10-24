"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Bell, BellOff, MessageCircle } from "lucide-react"
import { ConnectButton, useActiveAccount, useSendTransaction, darkTheme } from "thirdweb/react"
import { getContract, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { supportedTokens } from "@/lib/token-config"
import { getAvailableWallets } from "@/lib/wallet-config"
import Header from "@/components/header"
import { updateUserStreak, getStreakStats } from "@/lib/streak-service"
import StreakDisplay from "@/components/streak-display"
import CommentsSection from "@/components/comments-section"
import { Skeleton } from "@/components/ui/skeleton"

interface Movie {
  _id: string
  id: number
  title: string
  description: string
  posterUrl?: string
  isTVSeries?: boolean
  createdAt: string
}

// VoteButtons component for movies
function VoteButtons({
  movieId,
  dbMovieId,
  hasVoted,
  userVoteType,
  setHasVoted,
  setUserVoteType,
  voteCountYes,
  voteCountNo,
  setVoteCountYes,
  setVoteCountNo,
  address,
  onVoteSuccess,
}: any) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { mutate: sendTransaction } = useSendTransaction()
  const account = useActiveAccount()

  const handleVote = async (voteType: boolean) => {
    if (hasVoted) return
    if (!address) {
      setError("Please connect your wallet to vote")
      return
    }
    
    setIsPending(true)
    setError(null)
    
    try {
      // Debug: Log account info for account abstraction
      console.log("Account info:", { 
        address, 
        movieId, 
        voteType 
      })
      
      // Optimistically update UI
      setHasVoted(true)
      setUserVoteType(voteType)
      if (voteType) setVoteCountYes((prev: number) => prev + 1)
      else setVoteCountNo((prev: number) => prev + 1)

      // Create contract instance
      const contract = getContract({ 
        client, 
        chain: celoMainnet, 
        address: "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828" 
      })

      // Send transaction to contract using account abstraction
      const transaction = prepareContractCall({
        contract,
        method: "function vote(uint256, bool)",
        params: [BigInt(movieId), voteType],
      })

      console.log("Prepared transaction for account abstraction:", transaction)

      await new Promise((resolve, reject) => {
        sendTransaction(transaction, {
          onSuccess: (result: any) => {
            console.log("Account abstraction transaction successful:", result)
            resolve(result)
          },
          onError: (err: any) => {
            console.error("Account abstraction transaction error:", err)
            setError(`Transaction failed: ${err.message || 'Unknown error'}`)
            reject(err)
          },
        })
      })

      // Save vote to MongoDB (use dbMovieId)
      try {
        await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId: dbMovieId, address, voteType }),
        })
      } catch (dbError) {
        console.error("Failed to save vote to database:", dbError)
        // Don't fail the entire vote if database save fails
      }

      onVoteSuccess?.()
    } catch (error: any) {
      console.error("Voting failed:", error)
      setError(`Voting failed: ${error.message || 'Unknown error'}`)
      // Revert optimistic updates
      setHasVoted(false)
      setUserVoteType(null)
      if (voteType) setVoteCountYes((prev: number) => prev - 1)
      else setVoteCountNo((prev: number) => prev - 1)
    }
    setIsPending(false)
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="group">
        <div className="flex gap-3 w-full max-w-md">
          <button
            onClick={() => handleVote(true)}
            disabled={isPending || hasVoted}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors duration-150 ${
              hasVoted && userVoteType === true 
                ? "bg-green-600/70 border-2 border-green-500/70" 
                : "bg-black border-2 border-zinc-700 hover:border-white"
            } ${hasVoted ? "opacity-90" : ""}`}
          >
            {isPending ? "Processing..." : (
              <span className="flex items-center justify-center gap-2">
                <span>Yes</span>
                <span className="text-sm opacity-80">({voteCountYes})</span>
              </span>
            )}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isPending || hasVoted}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors duration-150 ${
              hasVoted && userVoteType === false 
                ? "bg-red-600/70 border-2 border-red-500/70" 
                : "bg-black border-2 border-zinc-700 hover:border-white"
            } ${hasVoted ? "opacity-90" : ""}`}
          >
            {isPending ? "Processing..." : (
              <span className="flex items-center justify-center gap-2">
                <span>No</span>
                <span className="text-sm opacity-80">({voteCountNo})</span>
              </span>
            )}
          </button>
        </div>
        {hasVoted && (
          <div className="relative">
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                ✓ You voted <span className="font-bold">{userVoteType ? 'YES' : 'NO'}</span> on this movie
              </div>
              {/* Arrow pointing down */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-base font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">{error}</p>}
    </div>
  )
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [userVoteType, setUserVoteType] = useState<boolean | null>(null)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [streakStats, setStreakStats] = useState<any>(null)
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false)
  const [watchlistLoading, setWatchlistLoading] = useState<boolean>(false)
  const [commentCount, setCommentCount] = useState<number>(0)

  const wallets = getAvailableWallets()

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true)
        const res = await fetch(`/api/movies`)
        const allMovies = await res.json()
        const foundMovie = allMovies.find((m: Movie) => m._id === id && m.isTVSeries !== true)
        setMovie(foundMovie || null)
        
        // Also fetch all movies for the related section
        const regularMovies = allMovies.filter((m: Movie) => m.isTVSeries !== true)
        setAllMovies(regularMovies)
      } catch (error) {
        console.error("Failed to fetch movie:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  // Fetch votes from MongoDB
  useEffect(() => {
    async function fetchVotes() {
      if (!movie?._id || !address) return
      
      const res = await fetch(`/api/votes?movieId=${movie._id}`)
      const votes = await res.json()
      let yes = 0, no = 0, voted = false, userVote = null
      votes.forEach((vote: any) => {
        if (vote.voteType) yes++
        else no++
        if (vote.address === address) {
          voted = true
          userVote = vote.voteType
        }
      })
      setVoteCountYes(yes)
      setVoteCountNo(no)
      setHasVoted(voted)
      setUserVoteType(userVote)
    }
    
    fetchVotes()
  }, [movie?._id, address])

  // Load streak stats
  useEffect(() => {
    if (address) {
      const stats = getStreakStats(address)
      setStreakStats(stats)
    }
  }, [address])

  // Check if movie is in watchlist
  useEffect(() => {
    if (address && movie?._id) {
      checkWatchlistStatus()
    }
  }, [address, movie?._id])

  const checkWatchlistStatus = async () => {
    try {
      const response = await fetch(`/api/watchlist?address=${address}`)
      if (response.ok) {
        const watchlist = await response.json()
        setIsInWatchlist(watchlist.some((item: any) => item._id === movie?._id))
      }
    } catch (error) {
      console.error("Failed to check watchlist status:", error)
    }
  }

  const toggleWatchlist = async () => {
    if (!address || !movie?._id) return
    
    setWatchlistLoading(true)
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await fetch(`/api/watchlist?address=${address}&movieId=${movie._id}`, {
          method: "DELETE",
        })
        setIsInWatchlist(false)
      } else {
        // Add to watchlist
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, movieId: movie._id }),
        })
        setIsInWatchlist(true)
      }
    } catch (error) {
      console.error("Failed to toggle watchlist:", error)
    } finally {
      setWatchlistLoading(false)
    }
  }

  // Fetch comment count
  useEffect(() => {
    if (movie?._id) {
      fetchCommentCount()
    }
  }, [movie?._id])

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(`/api/comments?movieId=${movie?._id}`)
      if (response.ok) {
        const comments = await response.json()
        setCommentCount(comments.length)
      }
    } catch (error) {
      console.error("Failed to fetch comment count:", error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 mb-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Back Button */}
          <div className="flex items-center mb-6">
            <ArrowLeft size={20} className="mr-2 text-rose-500" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              {/* Date and Type */}
              <div className="flex items-center gap-4 mb-4">
                <Calendar size={20} className="text-zinc-400" />
                <Skeleton className="h-5 w-16" />
                <Clock size={20} className="text-zinc-400" />
                <Skeleton className="h-5 w-12" />
              </div>

              {/* Title and Comments */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Skeleton className="h-10 w-3/4 mb-2" />
                  <div className="flex items-center gap-4">
                    <MessageCircle size={18} className="text-zinc-400" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Vote Stats */}
              <div className="bg-zinc-800/50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                </div>
              </div>

              {/* Voting Section */}
              <div className="bg-zinc-900 p-6 rounded-lg mb-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="flex gap-3 max-w-md">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                </div>
              </div>

              {/* Streak Display */}
              <div className="bg-zinc-900 p-6 rounded-lg mb-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>

              {/* About Section */}
              <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                      <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Movies Section */}
          <div className="mt-12">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-zinc-400 mb-6">The movie you're looking for doesn't exist.</p>
            <Link href="/movies" className="text-rose-500 hover:text-rose-400">
              ← Back to Movies
            </Link>
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
          <Link href="/movies" className="hover:text-white transition-colors">
            Movies
          </Link>
          <span>/</span>
          <span className="text-white">{movie.title}</span>
        </nav>
        
        <Link href="/movies" className="inline-flex items-center text-rose-500 hover:text-rose-400 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={movie.posterUrl || `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <Calendar size={20} className="text-zinc-400" />
              <span className="text-zinc-400">
                {new Date(movie.createdAt).getFullYear()}
              </span>
              <Clock size={20} className="text-zinc-400" />
              <span className="text-zinc-400">Movie</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} />
                    <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              {address && (
                <button
                  onClick={toggleWatchlist}
                  disabled={watchlistLoading}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isInWatchlist 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {watchlistLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isInWatchlist ? (
                    <Bell size={24} />
                  ) : (
                    <BellOff size={24} />
                  )}
                </button>
              )}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                {movie.description}
              </p>
            </div>

            {/* Quick Vote Section - Show current vote counts prominently */}
            {address && (
              <div className="bg-zinc-800/50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{voteCountYes}</div>
                    <div className="text-sm text-zinc-400">Yes Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{voteCountNo}</div>
                    <div className="text-sm text-zinc-400">No Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{voteCountYes + voteCountNo}</div>
                    <div className="text-sm text-zinc-400">Total Votes</div>
                  </div>
                </div>
              </div>
            )}

            {/* Voting Section */}
            {!address ? (
              <div className="bg-zinc-900 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Vote on this Movie</h3>
                <p className="text-zinc-400 mb-4">Connect your wallet to vote on this movie</p>
                <ConnectButton
                  client={client}
                  appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
                  chain={celoMainnet}
                  connectModal={{ showThirdwebBranding: false, size: "compact" }}
                  theme={darkTheme({
                    colors: {
                      accentText: "hsl(0, 0%, 100%)",
                      skeletonBg: "hsl(233, 12%, 15%)",
                      connectedButtonBg: "hsl(228, 12%, 8%)",
                    },
                  })}
                  wallets={wallets}
                  accountAbstraction={{
                    chain: celoMainnet,
                    sponsorGas: true,
                  }}
                  supportedTokens={supportedTokens}
                />
              </div>
            ) : (
              <div className="bg-zinc-900 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Vote on this Movie</h3>
                <VoteButtons
                  movieId={movie.id}
                  dbMovieId={movie._id}
                  hasVoted={hasVoted}
                  userVoteType={userVoteType}
                  setHasVoted={setHasVoted}
                  setUserVoteType={setUserVoteType}
                  voteCountYes={voteCountYes}
                  voteCountNo={voteCountNo}
                  setVoteCountYes={setVoteCountYes}
                  setVoteCountNo={setVoteCountNo}
                  address={address}
                  onVoteSuccess={() => {
                    if (address) {
                      const updatedStreak = updateUserStreak(address)
                      const stats = getStreakStats(address)
                      setStreakStats(stats)
                    }
                  }}
                />
              </div>
            )}

            {/* Streak Display */}
            {address && streakStats && (
              <div className="bg-zinc-900 p-6 rounded-lg mb-6">
                <StreakDisplay 
                  streak={streakStats}
                  nextMilestone={streakStats.nextMilestone}
                  daysToNextMilestone={streakStats.daysToNextMilestone}
                />
              </div>
            )}

            <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">About this Movie</h3>
              <p className="text-zinc-400">
                This is a feature film available for viewing. Check your favorite streaming platforms or theaters for availability.
              </p>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <CommentsSection movieId={movie._id} />
            </div>
          </div>
        </div>

        {/* Related Movies Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allMovies
              .filter((m) => m._id !== movie._id)
              .slice(0, 4)
              .map((m) => (
                <Link key={m._id} href={`/movies/${m._id}`} className="group">
                  <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={m.posterUrl || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(m.title)}`}
                        alt={m.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium group-hover:text-rose-500 transition-colors line-clamp-1">{m.title}</h3>
                      <p className="text-zinc-400 text-sm line-clamp-2">{m.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
