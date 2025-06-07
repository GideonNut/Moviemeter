"use client"

import { useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { prepareVoteTransaction } from "@/lib/blockchain-service"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { getDataSuffix, submitReferral } from '@divvi/referral-sdk'

interface VoteButtonsProps {
  movieId: string
  onVoteSuccess?: () => void
}

export function VoteButtons({ movieId, onVoteSuccess }: VoteButtonsProps) {
  const account = useActiveAccount()
  const address = account?.address
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async (voteType: boolean) => {
    if (!address) {
      setError("Please connect your wallet to vote")
      return
    }

    try {
      setIsVoting(true)
      setError(null)

      // Prepare the transaction
      const preparedTransaction = prepareVoteTransaction(movieId, voteType)

      // Execute the transaction
      const result = await preparedTransaction.send()

      // Submit referral to Divvi after transaction confirmation
      if (result.transactionHash) {
        try {
          await submitReferral({
            txHash: result.transactionHash,
            chainId: 42220, // Celo mainnet chain ID
          })
          console.log("Referral submitted successfully")
        } catch (referralError) {
          console.error("Failed to submit referral:", referralError)
          // Don't throw error here as the main transaction was successful
        }
      }

      console.log("Vote transaction:", result)

      if (onVoteSuccess) {
        onVoteSuccess()
      }
    } catch (err) {
      console.error("Error voting:", err)
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
          disabled={isVoting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ThumbsUp size={16} />
          <span>Yes</span>
        </Button>
        <Button
          onClick={() => handleVote(false)}
          disabled={isVoting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ThumbsDown size={16} />
          <span>No</span>
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {isVoting && <p className="text-sm">Processing your vote...</p>}
    </div>
  )
}
