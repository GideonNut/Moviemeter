"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Gift, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAvailableRewards, type Reward } from "@/lib/gooddollar-service"

export default function RewardsPage() {
  const [userPoints, setUserPoints] = useState(0)
  const [claimedRewards, setClaimedRewards] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userId, setUserId] = useState("user-1") // In production, get from auth
  const router = useRouter()

  // Fetch user points and claimed rewards
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In production, use the actual user ID
        const response = await fetch(`/api/rewards/user/${userId}`)
        const data = await response.json()

        if (data.success) {
          setUserPoints(data.data.points)
          setClaimedRewards(data.data.claimedRewards)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
    setRewards(getAvailableRewards())
  }, [userId])

  const handleClaimReward = async (reward: Reward) => {
    if (userPoints < reward.points) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/rewards/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          rewardId: reward.id,
          pointsCost: reward.points,
          tokenAmount: reward.tokenAmount,
        }),
      })

      const data = await response.json()

      if (data.success && data.userData) {
        setClaimedRewards(data.userData.claimedRewards)
        setUserPoints(data.userData.points)
        // Show success message
      } else {
        // Show error message
        console.error("Failed to claim reward:", data.message)
      }
    } catch (error) {
      console.error("Error claiming reward:", error)
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const isRewardClaimed = (rewardId: string) => {
    return claimedRewards.includes(rewardId)
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Rewards</h1>
        <p className="text-gray-600">Earn GoodDollar tokens for your participation</p>
      </div>

      <Card className="mb-6 bg-black text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your Points</h2>
              <p className="text-3xl font-bold mt-2">{userPoints}</p>
            </div>
            <Trophy className="h-12 w-12" />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Available Rewards</h2>

      <div className="space-y-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16 relative">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Gift className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold">{reward.title}</h3>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                  <p className="text-sm font-bold mt-1">{reward.points} points</p>
                </div>
                <div>
                  {isRewardClaimed(reward.id) ? (
                    <Button disabled className="bg-gray-200 text-gray-600">
                      <Check className="h-4 w-4 mr-2" />
                      Claimed
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleClaimReward(reward)}
                      disabled={userPoints < reward.points || isLoading}
                      className={userPoints >= reward.points ? "bg-black text-white" : "bg-gray-200 text-gray-600"}
                    >
                      {isLoading ? "Processing..." : "Claim"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Vote on movies: +10 points per vote</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Share movies: +25 points per share</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Daily login: +5 points</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Invite friends: +50 points per friend</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
