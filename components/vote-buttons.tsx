"use client"

import { useState, useEffect } from "react"
import { useActiveAccount, useSendTransaction } from "thirdweb/react"
import { prepareContractCall, getContract } from "thirdweb"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { databases } from '../lib/appwrite'
import { Query } from 'appwrite'
import { celoMainnet } from '@/lib/blockchain-service'
import { client } from '@/app/client'

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
  const { mutate: sendTransaction } = useSendTransaction()

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
      // Debug: Log account info for account abstraction
      console.log("Account info:", { 
        address, 
        movieId, 
        voteType 
      })
      
      // First, send blockchain transaction using account abstraction
      const contract = getContract({ 
        client, 
        chain: celoMainnet, 
        address: "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828" 
      })
      
      const transaction = prepareContractCall({
        contract,
        method: "function vote(uint256, bool)",
        params: [BigInt(movieId), voteType],
      })

      console.log("Prepared transaction for account abstraction:", transaction)

      // Send the transaction - account abstraction will handle gas sponsorship
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

      // Then save to Appwrite database
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
      
      // Award points for voting
      try {
        await fetch('/api/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, type: 'vote' }),
        })
      } catch (e) {
        console.warn('Failed to award vote points', e)
      }

      if (onVoteSuccess) onVoteSuccess()
      await fetchVotes()
    } catch (err: any) {
      console.error("Vote error details:", err)
      setError(`Failed to submit vote: ${err.message || 'Unknown error'}`)
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
          <span>{isVoting ? "Processing..." : `Yes (${voteCounts.yes})`}</span>
        </Button>
        <Button
          onClick={() => handleVote(false)}
          disabled={isVoting || hasVoted}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ThumbsDown size={16} />
          <span>{isVoting ? "Processing..." : `No (${voteCounts.no})`}</span>
        </Button>
      </div>
      {hasVoted && <p className="text-green-600 text-sm">You have already voted for this movie.</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {isVoting && <p className="text-sm">Processing your vote...</p>}
    </div>
  )
}
