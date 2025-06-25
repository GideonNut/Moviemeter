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

const contractAddress: string = "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828"
const contract = getContract({ client, chain: celoMainnet, address: contractAddress })

interface Movie {
  id: number
  title: string
  description: string
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
  const movies: Movie[] = [
    { id: 0, title: "Inception", description: "A thief enters dreams to steal secrets." },
    { id: 1, title: "Interstellar", description: "A space epic exploring love and time." },
    { id: 2, title: "The Dark Knight", description: "Batman faces off against the Joker." },
    { id: 3, title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
    {
      id: 4,
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    },
    {
      id: 5,
      title: "Oppenheimer",
      description:
        "The story of American scientist J. Robert Oppenheimer and his role in the creation of the atomic bomb.",
    },
    {
      id: 6,
      title: "Barbie",
      description: "Barbie suffers a crisis that leads her to question her world and her existence.",
    },
    {
      id: 7,
      title: "The Matrix",
      description:
        "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    },
    {
      id: 8,
      title: "Pulp Fiction",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine.",
    },
  ]

  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.id} {...movie} address={address} />
      ))}
    </div>
  )
}

function MovieCard({ id, title, description, address }: MovieCardProps) {
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [voteCountYes, setVoteCountYes] = useState<number>(0)
  const [voteCountNo, setVoteCountNo] = useState<number>(0)
  const [showFrameLink, setShowFrameLink] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"
  const frameUrl = `${baseUrl}/api/frame?id=${id}`

  const { data: votes, refetch } = useReadContract({
    contract,
    method: "getVotes",
    params: [id],
  })

  useEffect(() => {
    if (votes) {
      setVoteCountYes(votes.yes)
      setVoteCountNo(votes.no)
      if (votes.voters.includes(address)) {
        setHasVoted(true)
      }
    }
  }, [votes, address])

  useContractEvents({
    contract,
    events: ["Voted"],
    onEvents: () => refetch(),
  })

  const copyFrameLink = () => {
    navigator.clipboard.writeText(frameUrl)
    setShowFrameLink(true)
    setTimeout(() => setShowFrameLink(false), 3000)
  }

  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full">
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-md">
        <Image
          src={`/placeholder.svg?height=450&width=300&text=${encodeURIComponent(title)}`}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>
      <VoteButtons
        id={id}
        hasVoted={hasVoted}
        setHasVoted={setHasVoted}
        voteCountYes={voteCountYes}
        voteCountNo={voteCountNo}
        setVoteCountYes={setVoteCountYes}
        setVoteCountNo={setVoteCountNo}
      />

      {/* Farcaster Frame Link */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <Link href={frameUrl} target="_blank" className="text-rose-500 hover:text-rose-400 text-sm">
            View Farcaster Frame
          </Link>
          <button
            onClick={copyFrameLink}
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800"
            title="Copy Frame Link"
          >
            <Share2 size={16} />
          </button>
        </div>
        {showFrameLink && <div className="mt-2 text-xs text-green-500">Frame link copied to clipboard!</div>}
      </div>
    </div>
  )
}

function VoteButtons({
  id,
  hasVoted,
  setHasVoted,
  voteCountYes,
  voteCountNo,
  setVoteCountYes,
  setVoteCountNo,
}: VoteButtonsProps) {
  const { mutate: sendTransaction, isPending } = useSendTransaction()
  const account = useActiveAccount();

  const handleVote = async (voteType: boolean) => {
    if (hasVoted) return
    try {
      setHasVoted(true)
      if (voteType) setVoteCountYes((prev) => prev + 1)
      else setVoteCountNo((prev) => prev + 1)

      const transaction = prepareContractCall({
        contract,
        method: "function vote(uint256, bool)",
        params: [BigInt(id), voteType], // Convert 'id' to bigint
      })

      sendTransaction(transaction, {
        onSuccess: async () => {
          console.log("Voted successfully")
        },
        onError: () => {
          setHasVoted(false)
          if (voteType) setVoteCountYes((prev) => prev - 1)
          else setVoteCountNo((prev) => prev - 1)
        },
      })
    } catch (error) {
      console.error("Voting failed:", error)
      setHasVoted(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex gap-3 w-full">
        <button
          onClick={() => handleVote(true)}
          disabled={isPending || hasVoted}
          className={`flex-1 px-4 py-2 rounded-lg text-white ${
            hasVoted ? "bg-zinc-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          👍 Yes ({voteCountYes})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isPending || hasVoted}
          className={`flex-1 px-4 py-2 rounded-lg text-white ${
            hasVoted ? "bg-zinc-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          👎 No ({voteCountNo})
        </button>
      </div>
      {hasVoted && <p className="text-sm text-zinc-400">You've already voted on this movie</p>}
    </div>
  )
}
