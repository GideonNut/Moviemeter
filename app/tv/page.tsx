"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Filter, MessageCircle } from "lucide-react"
import { ConnectButton, useActiveAccount, useSendTransaction, darkTheme } from "thirdweb/react"
import { getContract, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { supportedTokens } from "@/lib/token-config"
import { getAvailableWallets } from "@/lib/wallet-config"
import Header from "@/components/header"
import { updateUserStreak, getStreakStats } from "@/lib/streak-service"
import StreakDisplay from "@/components/streak-display"

interface TVShow {
  _id: string
  title: string
  description: string
  posterUrl?: string
  isTVSeries: boolean
  createdAt: string
}

// VoteButtons component for TV shows
function VoteButtons({
  movieId,
  dbMovieId,
  hasVoted,
  setHasVoted,
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
      if (voteType) setVoteCountYes((prev: number) => prev - 1)
      else setVoteCountNo((prev: number) => prev - 1)
    }
    setIsPending(false)
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex gap-3 w-full">
        <button
          onClick={() => handleVote(true)}
          disabled={isPending || hasVoted}
          className={`flex-1 px-4 py-2 rounded-lg text-white bg-black border-2 border-zinc-700 hover:border-white transition-colors duration-150 ${hasVoted ? "opacity-60" : ""}`}
        >
          {isPending ? "Processing..." : `Yes (${voteCountYes})`}
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isPending || hasVoted}
          className={`flex-1 px-4 py-2 rounded-lg text-white bg-black border-2 border-zinc-700 hover:border-white transition-colors duration-150 ${hasVoted ? "opacity-60" : ""}`}
        >
          {isPending ? "Processing..." : `No (${voteCountNo})`}
        </button>
      </div>
      {hasVoted && <p className="text-base font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">✓ You've already voted on this TV show</p>}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tvShows
              .filter((show) => show.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((show) => (
                <TVShowCard key={show._id} show={show} address={address} />
              ))}
          </div>
        )}

        {tvShows.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-6 rounded-md">Load More</button>
          </div>
        )}
      </div>
    </main>
  )
}

function TVShowCard({ show, address }: { show: TVShow; address?: string }) {
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [streakStats, setStreakStats] = useState<any>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false)
  const [commentCount, setCommentCount] = useState<number>(0)

  // Fetch votes from MongoDB
  useEffect(() => {
    async function fetchVotes() {
      const res = await fetch(`/api/votes?movieId=${show._id}`)
      const votes = await res.json()
      let yes = 0, no = 0, voted = false
      votes.forEach((vote: any) => {
        if (vote.voteType) yes++
        else no++
        if (vote.address === address) voted = true
      })
      setVoteCountYes(yes)
      setVoteCountNo(no)
      setHasVoted(voted)
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
      <p className="text-zinc-500 text-xs mb-4">
        {new Date(show.createdAt).getFullYear()}
      </p>
      
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
          setHasVoted={setHasVoted}
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
