"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, useContractEvents } from "thirdweb/react"
import { getContract, defineChain, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import Header from "@/components/header"
import { Share2 } from "lucide-react"
import { updateUserStreak, getStreakStats } from "@/lib/streak-service"
import StreakDisplay from "@/components/streak-display"

// Add VoteButtons component back
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
  const { mutate: sendTransaction } = useSendTransaction()
  const contractAddress: string = "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828"
  const contract = getContract({ client, chain: celoMainnet, address: contractAddress })

  const handleVote = async (voteType: boolean) => {
    if (hasVoted) return
    setIsPending(true)
    try {
      setHasVoted(true)
      if (voteType) setVoteCountYes((prev: number) => prev + 1)
      else setVoteCountNo((prev: number) => prev + 1)

      // Send transaction to contract (use numeric movieId)
      const transaction = prepareContractCall({
        contract,
        method: "function vote(uint256, bool)",
        params: [BigInt(movieId), voteType],
      })

      await new Promise((resolve, reject) => {
        sendTransaction(transaction, {
          onSuccess: resolve,
          onError: (err: any) => {
            console.error("Transaction error:", err)
            reject(err)
          },
        })
      })

      // Save vote to MongoDB (use dbMovieId)
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: dbMovieId, address, voteType }),
      })

      onVoteSuccess()
    } catch (error) {
      console.error("Voting failed:", error)
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
          Yes ({voteCountYes})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isPending || hasVoted}
          className={`flex-1 px-4 py-2 rounded-lg text-white bg-black border-2 border-zinc-700 hover:border-white transition-colors duration-150 ${hasVoted ? "opacity-60" : ""}`}
        >
          No ({voteCountNo})
        </button>
      </div>
      {hasVoted && <p className="text-sm text-zinc-400">You've already voted on this movie</p>}
    </div>
  )
}

const contractAddress: string = "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828"
const contract = getContract({ client, chain: celoMainnet, address: contractAddress })

interface Movie {
  id: number
  title: string
  description: string
  posterUrl?: string
}

interface MovieCardsProps {
  address: string
  searchQuery: string
}

interface MovieCardProps {
  id: number
  title: string
  description: string
  address: string
  posterUrl?: string
}

interface VoteButtonsProps {
  id: number
  hasVoted: boolean
  setHasVoted: (value: boolean) => void
  voteCountYes: number
  voteCountNo: number
  setVoteCountYes: (value: (prev: number) => number) => void
  setVoteCountNo: (value: (prev: number) => number) => void
}

export default function MoviesPage() {
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [streakStats, setStreakStats] = useState<any>(null)

  // Load streak stats for the main page
  useEffect(() => {
    if (address) {
      const stats = getStreakStats(address)
      setStreakStats(stats)
    }
  }, [address])

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold mb-6">Vote on Movies</h1>

          {!address && (
            <div className="bg-zinc-900 p-6 rounded-lg mb-8 text-center">
              <p className="mb-4">Connect your wallet to vote on your favorite movies</p>
              <ConnectButton
                client={client}
                appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
                chain={celoMainnet}
                accountAbstraction={{
                  chain: celoMainnet,
                  sponsorGas: true,
                }}
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
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-6 p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-white w-full max-w-md focus:outline-none hover:bg-zinc-800"
            />
          )}
        </div>

        {address && <MovieCards address={address} searchQuery={searchQuery} />}
      </div>
    </main>
  )
}

function MovieCards({ address, searchQuery }: MovieCardsProps) {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true)
      const res = await fetch("/api/movies")
      const data = await res.json()
      setMovies(data)
      setLoading(false)
    }
    fetchMovies()
  }, [])

  // Deduplicate movies by title
  const uniqueMovies: any[] = []
  const seenTitles = new Set<string>()
  for (const movie of movies) {
    if (movie.title && !seenTitles.has(movie.title)) {
      uniqueMovies.push(movie)
      seenTitles.add(movie.title)
    }
  }

  // Only include movies with a year in the title (e.g., '(2025)')
  const moviesWithYear = uniqueMovies.filter((movie) => /\(\d{4}\)/.test(movie.title))

  const filteredMovies = moviesWithYear.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) return <div>Loading movies...</div>

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie._id || movie.id} {...movie} address={address} />
      ))}
    </div>
  )
}

function MovieCard({ _id, id, title, description, address, posterUrl }: any) {
  const contractMovieId = typeof id === 'number' || !isNaN(Number(id)) ? Number(id) : 0;
  const dbMovieId = _id || id;
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [showFrameLink, setShowFrameLink] = useState(false)
  const [streakStats, setStreakStats] = useState<any>(null)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"
  const frameUrl = `${baseUrl}/api/frame?id=${dbMovieId}`

  // Fetch votes from MongoDB
  useEffect(() => {
    async function fetchVotes() {
      const res = await fetch(`/api/votes?movieId=${dbMovieId}`)
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
  }, [dbMovieId, address])

  // Load streak stats
  useEffect(() => {
    if (address) {
      const stats = getStreakStats(address)
      setStreakStats(stats)
    }
  }, [address])

  const copyFrameLink = () => {
    navigator.clipboard.writeText(frameUrl)
    setShowFrameLink(true)
    setTimeout(() => setShowFrameLink(false), 3000)
  }

  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full">
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-md">
        <Image
          src={posterUrl || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(title)}`}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>
      <VoteButtons
        movieId={contractMovieId}
        dbMovieId={dbMovieId}
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
  )
}
