"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { ConnectButton, useActiveAccount, useSendTransaction, darkTheme } from "thirdweb/react"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { getContract, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { supportedTokens } from "@/lib/token-config"
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
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="flex gap-3 w-full max-w-md">
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

export default function TVShowDetailPage({ params }: { params: { id: string } }) {
  const [tvShow, setTvShow] = useState<TVShow | null>(null)
  const [allTVShows, setAllTVShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [streakStats, setStreakStats] = useState<any>(null)

  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "telegram",
          "farcaster",
          "email",
          "x",
          "passkey",
          "phone",
          "apple",
        ],
      },
      chain: celoMainnet,
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ]

  useEffect(() => {
    async function fetchTVShow() {
      try {
        setLoading(true)
        const res = await fetch(`/api/movies`)
        const allMovies = await res.json()
        const show = allMovies.find((movie: TVShow) => movie._id === params.id && movie.isTVSeries === true)
        setTvShow(show || null)
        
        // Also fetch all TV shows for the related section
        const tvSeries = allMovies.filter((movie: TVShow) => movie.isTVSeries === true)
        setAllTVShows(tvSeries)
      } catch (error) {
        console.error("Failed to fetch TV show:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTVShow()
  }, [params.id])

  // Fetch votes from MongoDB
  useEffect(() => {
    async function fetchVotes() {
      if (!tvShow?._id || !address) return
      
      const res = await fetch(`/api/votes?movieId=${tvShow._id}`)
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
    
    fetchVotes()
  }, [tvShow?._id, address])

  // Load streak stats
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
            <div className="text-xl">Loading TV show...</div>
          </div>
        </div>
      </main>
    )
  }

  if (!tvShow) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">TV Show Not Found</h1>
            <p className="text-zinc-400 mb-6">The TV show you're looking for doesn't exist.</p>
            <Link href="/tv" className="text-rose-500 hover:text-rose-400">
              ← Back to TV Shows
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
          <Link href="/tv" className="hover:text-white transition-colors">
            TV Shows
          </Link>
          <span>/</span>
          <span className="text-white">{tvShow.title}</span>
        </nav>
        
        <Link href="/tv" className="inline-flex items-center text-rose-500 hover:text-rose-400 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to TV Shows
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={tvShow.posterUrl || `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(tvShow.title)}`}
                alt={tvShow.title}
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
                {new Date(tvShow.createdAt).getFullYear()}
              </span>
              <Clock size={20} className="text-zinc-400" />
              <span className="text-zinc-400">TV Series</span>
            </div>

            <h1 className="text-4xl font-bold mb-6">{tvShow.title}</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                {tvShow.description}
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
                <h3 className="text-xl font-semibold mb-4">Vote on this TV Show</h3>
                <p className="text-zinc-400 mb-4">Connect your wallet to vote on this TV series</p>
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
                <h3 className="text-xl font-semibold mb-4">Vote on this TV Show</h3>
                <VoteButtons
                  movieId={0} // TV shows don't have contract IDs, so we use 0
                  dbMovieId={tvShow._id}
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
              <h3 className="text-xl font-semibold mb-4">About this TV Series</h3>
              <p className="text-zinc-400">
                This is a television series available for streaming. Check your favorite streaming platforms for availability.
              </p>
            </div>
          </div>
        </div>

        {/* Related TV Shows Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More TV Shows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allTVShows
              .filter((show) => show._id !== tvShow._id)
              .slice(0, 4)
              .map((show) => (
                <Link key={show._id} href={`/tv/${show._id}`} className="group">
                  <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={show.posterUrl || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(show.title)}`}
                        alt={show.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium group-hover:text-rose-500 transition-colors line-clamp-1">{show.title}</h3>
                      <p className="text-zinc-400 text-sm line-clamp-2">{show.description}</p>
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
