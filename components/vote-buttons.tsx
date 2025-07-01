"use client"

import { useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { databases, client } from '../lib/appwrite'
import { Query } from 'appwrite'

interface VoteButtonsProps {
  movieId: string
  onVoteSuccess?: () => void
}

export function VoteButtons({ movieId, onVoteSuccess }: VoteButtonsProps) {
  const account = useActiveAccount()
  const address = account?.address
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteCounts, setVoteCounts] = useState({ yes: 0, no: 0 })

  // IDs
  const databaseId = '6863e8de0036e5987040'
  const collectionId = '6863ef84003bdaebdc00'

  // Fetch votes for this movie
  const fetchVotes = async () => {
    try {
      const res = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('movieId', movieId)
      ])
      let yes = 0, no = 0, voted = false
      res.documents.forEach(doc => {
        if (doc.voteType) yes++
        else no++
        if (doc.wallet === address) voted = true
      })
      setVoteCounts({ yes, no })
      setHasVoted(voted)
    } catch (err) {
      setError('Failed to fetch votes')
    }
  }

  useEffect(() => {
    fetchVotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, address])

  const handleVote = async (voteType: boolean) => {
    if (!address) {
      setError("Please connect your wallet to vote")
      return
    }
    if (hasVoted) {
      setError("You have already voted for this movie")
      return
    }
    setError(null)
    setIsVoting(true)
    try {
      await databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        {
          movieId,
          voteType,
          wallet: address,
          createdAt: new Date().toISOString(),
        }
      )
      if (onVoteSuccess) onVoteSuccess()
      await fetchVotes()
    } catch (err) {
      setError("Failed to submit vote. Please try again.")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          onClick={() => handleVote(true)}
          disabled={isVoting || hasVoted}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ThumbsUp size={16} />
          <span>Yes ({voteCounts.yes})</span>
        </Button>
        <Button
          onClick={() => handleVote(false)}
          disabled={isVoting || hasVoted}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ThumbsDown size={16} />
          <span>No ({voteCounts.no})</span>
        </Button>
      </div>
      {hasVoted && <p className="text-green-600 text-sm">You have already voted for this movie.</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {isVoting && <p className="text-sm">Processing your vote...</p>}
    </div>
  )
}
