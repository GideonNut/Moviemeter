"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, useContractEvents, darkTheme } from "thirdweb/react"
import { getContract, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { supportedTokens } from "@/lib/token-config"
import { getAvailableWallets } from "@/lib/wallet-config"
import Header from "@/components/header"
import { Share2, Bell, BellOff, MessageCircle } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { MoviesPageSkeleton } from "@/components/page-skeleton"

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

const contractAddress: string = "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828";
const contractAbi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "movieId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "voter", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "vote", "type": "bool" }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [ { "internalType": "string", "name": "_title", "type": "string" } ],
    "name": "addMovie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "_movieId", "type": "uint256" } ],
    "name": "getVotes",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "movieCount",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "name": "movies",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "uint256", "name": "yesVotes", "type": "uint256" },
      { "internalType": "uint256", "name": "noVotes", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_movieId", "type": "uint256" },
      { "internalType": "bool", "name": "_vote", "type": "bool" }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
const contract = getContract({ client, chain: celoMainnet, address: contractAddress, abi: contractAbi });

interface Movie {
  _id: string
  id: number
  title: string
  description: string
  posterUrl?: string
  isTVSeries?: boolean
  createdAt: string
}

interface MovieCardsProps {
  address: string
  searchQuery: string
}

interface MovieCardProps {
  movie: Movie
  address: string
}

export default function MoviesPage() {
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const [searchQuery, setSearchQuery] = useState<string>("")
  const wallets = getAvailableWallets()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <MoviesPageSkeleton />
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Vote on Movies</h1>
            <p className="text-zinc-400 mb-4">Click on any movie to view details and vote</p>
          </div>

          {!address && (
            <div className="bg-zinc-900 p-6 rounded-lg mb-8 text-center">
              <p className="mb-4">Connect your wallet to vote on your favorite movies</p>
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
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllMovies() {
      setLoading(true)
      try {
        const res = await fetch("/api/movies")
        const data = await res.json()
        setAllMovies(data)
      } catch (error) {
        console.error('Failed to fetch movies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllMovies()
  }, [])

  // Deduplicate movies by title
  const uniqueMovies: Movie[] = []
  const seenTitles = new Set<string>()
  for (const movie of allMovies) {
    if (movie.title && !seenTitles.has(movie.title)) {
      uniqueMovies.push(movie)
      seenTitles.add(movie.title)
    }
  }

  // Only include movies with a year in the title (e.g., '(2025)') and exclude TV series
  const moviesWithYear = uniqueMovies.filter((movie) => /\(\d{4}\)/.test(movie.title) && movie.isTVSeries !== true)

  const filteredMovies = moviesWithYear.filter((movie) => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // For infinite scroll, we'll show movies in batches
  const [displayCount, setDisplayCount] = useState(20)
  const displayedMovies = filteredMovies.slice(0, displayCount)
  const hasMore = displayCount < filteredMovies.length

  // Load more function
  const loadMore = () => {
    if (hasMore) {
      setDisplayCount(prev => Math.min(prev + 20, filteredMovies.length))
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

  if (loading) return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="group relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="w-full aspect-[2/3] bg-zinc-800 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 w-3/4 bg-zinc-800 rounded mb-2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="h-10 w-20 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-10 w-20 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (filteredMovies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg">No movies found.</p>
        <p className="text-zinc-500 text-sm mt-2">Try adjusting your search or add some movies through the admin panel.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie._id || movie.id} movie={movie} address={address} />
        ))}
      </div>
      
      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
            <span>Loading more movies...</span>
          </div>
        </div>
      )}
      
      {/* End of results indicator */}
      {!hasMore && filteredMovies.length > 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-500 text-sm">You've reached the end of the movie list</p>
        </div>
      )}
    </div>
  )
}

function MovieCard({ movie, address }: MovieCardProps) {
  const { _id, id, title, description, posterUrl } = movie
  const contractMovieId = typeof id === 'number' || !isNaN(Number(id)) ? Number(id) : 0;
  const dbMovieId = _id || id;
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [userVoteType, setUserVoteType] = useState<boolean | null>(null)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false)
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false)
  const [watchlistLoading, setWatchlistLoading] = useState<boolean>(false)
  const [commentCount, setCommentCount] = useState<number>(0)

  // Fetch votes from MongoDB
  useEffect(() => {
    async function fetchVotes() {
      const res = await fetch(`/api/votes?movieId=${dbMovieId}`)
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
  }, [dbMovieId, address])


  // Check if movie is in watchlist
  useEffect(() => {
    if (address && dbMovieId) {
      checkWatchlistStatus()
    }
  }, [address, dbMovieId])

  const checkWatchlistStatus = async () => {
    try {
      const response = await fetch(`/api/watchlist?address=${address}`)
      if (response.ok) {
        const watchlist = await response.json()
        setIsInWatchlist(watchlist.some((item: any) => item._id === dbMovieId))
      }
    } catch (error) {
      console.error("Failed to check watchlist status:", error)
    }
  }

  const toggleWatchlist = async () => {
    if (!address || !dbMovieId) return
    
    setWatchlistLoading(true)
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await fetch(`/api/watchlist?address=${address}&movieId=${dbMovieId}`, {
          method: "DELETE",
        })
        setIsInWatchlist(false)
      } else {
        // Add to watchlist
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, movieId: dbMovieId }),
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
        const response = await fetch(`/api/comments?movieId=${dbMovieId}`)
        if (response.ok) {
          const comments = await response.json()
          setCommentCount(comments.length)
        }
      } catch (error) {
        console.error("Failed to fetch comment count:", error)
      }
    }
    fetchCommentCount()
  }, [dbMovieId])

  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full">
      {/* Clickable poster and title area */}
      <Link href={`/movies/${dbMovieId}`} className="block group">
        <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-md">
          <Image
            src={posterUrl || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(title)}`}
            alt={title}
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
        <h2 className="text-lg font-semibold mb-2 group-hover:text-rose-500 transition-colors">{title}</h2>
      </Link>
      
      <div className="mb-4">
        <p className="text-sm text-zinc-400">
          {!isDescriptionExpanded && description && description.length > 110
            ? `${description.slice(0, 110)}...`
            : description}
        </p>
        {description && description.length > 110 && (
          <button
            type="button"
            aria-expanded={isDescriptionExpanded ? "true" : "false"}
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
          href={`/movies/${dbMovieId}`}
          className="inline-flex items-center text-rose-500 hover:text-rose-400 text-sm font-medium"
        >
          View Details →
        </Link>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <MessageCircle size={16} />
          <span>{commentCount}</span>
        </div>
      </div>
      
      <VoteButtons
        movieId={contractMovieId}
        dbMovieId={dbMovieId}
        hasVoted={hasVoted}
        userVoteType={userVoteType}
        setHasVoted={setHasVoted}
        setUserVoteType={setUserVoteType}
        voteCountYes={voteCountYes}
        voteCountNo={voteCountNo}
        setVoteCountYes={setVoteCountYes}
        setVoteCountNo={setVoteCountNo}
        address={address}
      />
    </div>
  )
}
