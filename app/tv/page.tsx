"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Filter, MessageCircle, Bell, BellOff } from "lucide-react"
import { ConnectButton, useActiveAccount, useSendTransaction, darkTheme } from "thirdweb/react"
import { getContract, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { supportedTokens } from "@/lib/token-config"
import { getAvailableWallets } from "@/lib/wallet-config"
import Header from "@/components/header"
import { updateUserStreak, getStreakStats } from "@/lib/streak-service"
import StreakDisplay from "@/components/streak-display"
import { useInView } from "react-intersection-observer"

interface TVShow {
  _id: string
  title: string
  description: string
  posterUrl?: string
  isTVSeries: boolean
  createdAt: string
}

// Add VoteButtons component back
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
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="group">
        <div className="flex gap-3 w-full">
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
            } ${hasVoted ? "opacity-80" : ""}`}
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
                ✓ You voted <span className="font-bold">{userVoteType ? 'YES' : 'NO'}</span> on this TV show
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

export default function TVShowsPage() {
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const [streakStats, setStreakStats] = useState<any>(null)

  const wallets = getAvailableWallets()

  useEffect(() => {
    async function fetchTVShows() {
      try {
        setLoading(true)
        const res = await fetch("/api/movies")
        const allMovies = await res.json()
        // Filter only TV series
        const tvSeries = allMovies.filter((movie: TVShow) => movie.isTVSeries === true)
        setTvShows(tvSeries)
      } catch (error) {
        console.error("Failed to fetch TV shows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTVShows()
  }, [])

  // Load streak stats for the main page
  useEffect(() => {
    if (address) {
      const stats = getStreakStats(address)
      setStreakStats(stats)
    }
  }, [address])

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-xl">Loading TV shows...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Vote on TV Shows</h1>
            <p className="text-zinc-400 mb-4">Click on any TV show to view details and vote</p>
          </div>

          {!address && (
            <div className="bg-zinc-900 p-6 rounded-lg mb-8 text-center">
              <p className="mb-4">Connect your wallet to vote on your favorite TV shows</p>
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
          )}

          {address && streakStats && (
            <div className="w-full max-w-2xl mb-8">
              <StreakDisplay 
                streak={streakStats}
                nextMilestone={streakStats.nextMilestone}
                daysToNextMilestone={streakStats.daysToNextMilestone}
              />
            </div>
          )}

          {address && (
            <input
              type="text"
              placeholder="Search TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-6 p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-white w-full max-w-md focus:outline-none hover:bg-zinc-800"
            />
          )}
        </div>

        {tvShows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No TV shows available yet.</p>
            <p className="text-zinc-500 text-sm mt-2">Add some TV series through the admin panel.</p>
          </div>
        ) : (
          <TVShowsGrid tvShows={tvShows} searchQuery={searchQuery} address={address} />
        )}


      </div>
    </main>
  )
}

function TVShowsGrid({ tvShows, searchQuery, address }: { 
  tvShows: TVShow[], 
  searchQuery: string, 
  address?: string 
}) {
  const filteredShows = tvShows.filter((show) => 
    show.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // For infinite scroll, we'll show shows in batches
  const [displayCount, setDisplayCount] = useState(20)
  const displayedShows = filteredShows.slice(0, displayCount)
  const hasMore = displayCount < filteredShows.length

  // Load more function
  const loadMore = () => {
    if (hasMore) {
      setDisplayCount(prev => Math.min(prev + 20, filteredShows.length))
    }
  }

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView && hasMore) {
      loadMore()
    }
  }, [inView, hasMore])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedShows.map((show) => (
          <TVShowCard key={show._id} show={show} address={address} />
        ))}
      </div>
      
      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
            <span>Loading more TV shows...</span>
          </div>
        </div>
      )}
      
      {/* End of results indicator */}
      {!hasMore && filteredShows.length > 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-500 text-sm">You've reached the end of the TV shows list</p>
        </div>
      )}
    </div>
  )
}

function TVShowCard({ show, address }: { show: TVShow; address?: string }) {
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [userVoteType, setUserVoteType] = useState<boolean | null>(null)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [streakStats, setStreakStats] = useState<any>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false)
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false)
  const [watchlistLoading, setWatchlistLoading] = useState<boolean>(false)
  const [commentCount, setCommentCount] = useState<number>(0)

  // Fetch votes from MongoDB
  useEffect(() => {
    async function fetchVotes() {
      const res = await fetch(`/api/votes?movieId=${show._id}`)
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
    if (address) fetchVotes()
  }, [show._id, address])

  // Load streak stats
  useEffect(() => {
    if (address) {
      const stats = getStreakStats(address)
      setStreakStats(stats)
    }
  }, [address])

  // Check if TV show is in watchlist
  useEffect(() => {
    if (address && show._id) {
      checkWatchlistStatus()
    }
  }, [address, show._id])

  const checkWatchlistStatus = async () => {
    try {
      const response = await fetch(`/api/watchlist?address=${address}`)
      if (response.ok) {
        const watchlist = await response.json()
        setIsInWatchlist(watchlist.some((item: any) => item._id === show._id))
      }
    } catch (error) {
      console.error("Failed to check watchlist status:", error)
    }
  }

  const toggleWatchlist = async () => {
    if (!address || !show._id) return
    
    setWatchlistLoading(true)
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await fetch(`/api/watchlist?address=${address}&movieId=${show._id}`, {
          method: "DELETE",
        })
        setIsInWatchlist(false)
      } else {
        // Add to watchlist
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, movieId: show._id }),
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
    async function fetchCommentCount() {
      try {
        const response = await fetch(`/api/comments?movieId=${show._id}`)
        if (response.ok) {
          const comments = await response.json()
          setCommentCount(comments.length)
        }
      } catch (error) {
        console.error("Failed to fetch comment count:", error)
      }
    }
    fetchCommentCount()
  }, [show._id])

  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full">
      {/* Clickable poster and title area */}
      <Link href={`/tv/${show._id}`} className="block group">
        <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-md">
          <Image
            src={show.posterUrl || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(show.title)}`}
            alt={show.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Watchlist Bell */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWatchlist()
            }}
            disabled={watchlistLoading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isInWatchlist 
                ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white'
            }`}
            title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {watchlistLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isInWatchlist ? (
              <Bell size={16} />
            ) : (
              <BellOff size={16} />
            )}
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-2 group-hover:text-rose-500 transition-colors">{show.title}</h2>
      </Link>
      
      <div className="mb-4">
        <p className="text-sm text-zinc-400">
          {!isDescriptionExpanded && show.description && show.description.length > 110
            ? `${show.description.slice(0, 110)}...`
            : show.description}
        </p>
        {show.description && show.description.length > 110 && (
          <button
            type="button"
            aria-expanded={isDescriptionExpanded}
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            className="mt-2 text-xs font-medium text-white hover:text-zinc-300"
          >
            {isDescriptionExpanded ? "See less" : "See more"}
          </button>
        )}
      </div>
      
      {/* View Details Link and Comment Count */}
      <div className="mb-4 flex items-center justify-between">
        <Link 
          href={`/tv/${show._id}`}
          className="inline-flex items-center text-rose-500 hover:text-rose-400 text-sm font-medium"
        >
          View Details →
        </Link>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <MessageCircle size={16} />
          <span>{commentCount}</span>
        </div>
      </div>
      
      {address && (
        <VoteButtons
          movieId={0} // TV shows don't have contract IDs, so we use 0
          dbMovieId={show._id}
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
      )}
    </div>
  )
}
