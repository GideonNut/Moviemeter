"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, useContractEvents } from "thirdweb/react"
import { getContract, defineChain, prepareContractCall } from "thirdweb"
import { client } from "../app/client"
import { Share2 } from "lucide-react"

const alfajores = defineChain({
  id: 44787,
  rpc: "https://alfajores-forno.celo-testnet.org",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
})

const contractAddress: string = "0x3eD5D4A503999C5aEB13CD71Eb1d395043368723"
const contract = getContract({ client, chain: alfajores, address: contractAddress })

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

export default function Home() {
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const [searchQuery, setSearchQuery] = useState<string>("")

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />
        <div className="flex flex-col items-center mb-10">
          <ConnectButton client={client} appMetadata={{ name: "Movie Voting DApp", url: "https://example.com" }} />
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

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <div className="relative w-[600px] h-[480px] mb-8">
        <Image src="/mm-logo-new.png" alt="MovieMeter Logo" fill className="object-contain" priority />
      </div>

      <div className="relative w-full max-w-md mb-6">
        <Image src="/moviemeter-logo.png" alt="MovieMeter" width={400} height={120} className="mx-auto" priority />
      </div>

      <p className="text-zinc-300 text-base">
        Your <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">Blockchain</code> IMDb.
      </p>
    </header>
  )
}

function MovieCards({ address, searchQuery }: MovieCardsProps) {
  const movies: Movie[] = [
    { id: 0, title: "Inception", description: "A thief enters dreams to steal secrets." },
    { id: 1, title: "Interstellar", description: "A space epic exploring love and time." },
    { id: 2, title: "The Dark Knight", description: "Batman faces off against the Joker." },
    { id: 3, title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
  ]

  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid gap-6 lg:grid-cols-3 justify-center">
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
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full text-center">
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
        onSuccess: () => console.log("Voted successfully"),
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
      <div className="flex gap-3">
        <button
          onClick={() => handleVote(true)}
          disabled={isPending || hasVoted}
          className={`px-4 py-2 rounded-lg text-white ${hasVoted ? "bg-zinc-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          👍 Yes ({voteCountYes})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isPending || hasVoted}
          className={`px-4 py-2 rounded-lg text-white ${hasVoted ? "bg-zinc-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          👎 No ({voteCountNo})
        </button>
      </div>
    </div>
  )
}

