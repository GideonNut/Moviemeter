"use client"
import React, { useState, useEffect } from "react"
import { Flame, Trophy, Target, Zap, Calendar, TrendingUp, ArrowLeft } from "lucide-react"
import { getStreakRewards, getStreakStats } from "@/lib/streak-service"
import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"

export default function StreakRewardsPage() {
  const account = useActiveAccount()
  const address = account?.address
  const [streakStats, setStreakStats] = useState<any>(null)
  const streakRewards = getStreakRewards()
  const router = useRouter()

  useEffect(() => {
    if (address) {
      const stats = getStreakStats(address)
      setStreakStats(stats)
    }
  }, [address])

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      router.push("/rewards")
    }
  }

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center">
          <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
            <ArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold mb-4">Streak Rewards</h1>
          <p className="text-zinc-400">Connect your wallet to view your streak rewards</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="mr-2" /> Back
      </button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <Flame className="mr-3 text-orange-400" size={32} />
          Streak Rewards
        </h1>
        <p className="text-lg text-zinc-400 mb-6">
          Vote daily to build your streak and earn exclusive rewards!
        </p>
      </div>

      {streakStats && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {streakStats.currentStreak}
            </div>
            <div className="text-zinc-400">Current Streak</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {streakStats.longestStreak}
            </div>
            <div className="text-zinc-400">Longest Streak</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {streakStats.totalVotes}
            </div>
            <div className="text-zinc-400">Total Votes</div>
          </div>
        </div>
      )}

      <div className="bg-zinc-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="mr-2 text-blue-400" size={20} />
          Streak Milestones
        </h2>
        <div className="grid gap-4">
          {streakRewards.map((reward, index) => {
            const isCompleted = streakStats && streakStats.currentStreak >= reward.streakDays
            const isCurrent = streakStats && streakStats.currentStreak === reward.streakDays
            const isNext = streakStats && streakStats.nextMilestone?.streakDays === reward.streakDays

            return (
              <div
                key={reward.streakDays}
                className={`p-4 rounded-lg border ${
                  isCompleted
                    ? 'bg-green-900/20 border-green-500'
                    : isCurrent
                    ? 'bg-blue-900/20 border-blue-500'
                    : isNext
                    ? 'bg-yellow-900/20 border-yellow-500'
                    : 'bg-zinc-700/20 border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isCompleted ? (
                      <Trophy className="mr-3 text-green-400" size={20} />
                    ) : isCurrent ? (
                      <Zap className="mr-3 text-blue-400" size={20} />
                    ) : isNext ? (
                      <Target className="mr-3 text-yellow-400" size={20} />
                    ) : (
                      <div className="mr-3 w-5 h-5 rounded-full bg-zinc-600" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {reward.streakDays} Day Streak
                      </div>
                      <div className="text-sm text-zinc-400">
                        {reward.bonusMultiplier}x bonus multiplier
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">
                      +{reward.reward} G$
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-blue-400">Current!</div>
                    )}
                    {isNext && (
                      <div className="text-xs text-yellow-400">
                        {streakStats.daysToNextMilestone} days to go
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-400" size={20} />
            How Streaks Work
          </h3>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Vote on at least one movie every day to maintain your streak
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Missing a day resets your streak to 0
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Longer streaks unlock bigger rewards and bonus multipliers
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Your longest streak is permanently recorded
            </li>
          </ul>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-blue-400" size={20} />
            Daily Voting Tips
          </h3>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Set a daily reminder to vote on movies
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Vote on multiple movies to increase your total rewards
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Share your streak achievements with friends
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              Check back daily to maintain your streak momentum
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 