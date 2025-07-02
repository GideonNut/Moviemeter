import React from 'react'
import { Flame, Trophy, Target, Zap } from 'lucide-react'
import { UserStreak, StreakReward } from '@/lib/streak-service'

interface StreakDisplayProps {
  streak: UserStreak
  nextMilestone?: StreakReward | null
  daysToNextMilestone: number
}

export default function StreakDisplay({ streak, nextMilestone, daysToNextMilestone }: StreakDisplayProps) {
  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🔥🔥🔥'
    if (streak >= 60) return '🔥🔥'
    if (streak >= 30) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌟'
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 100) return 'text-red-400'
    if (streak >= 60) return 'text-orange-400'
    if (streak >= 30) return 'text-yellow-400'
    if (streak >= 7) return 'text-blue-400'
    if (streak >= 3) return 'text-green-400'
    return 'text-zinc-400'
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Flame className="mr-2 text-orange-400" size={20} />
          Voting Streak
        </h3>
        <div className="text-sm text-zinc-400">
          {streak.totalVotes} total votes
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getStreakColor(streak.currentStreak)}`}>
            {getStreakEmoji(streak.currentStreak)} {streak.currentStreak}
          </div>
          <div className="text-sm text-zinc-400">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">
            <Trophy className="inline mr-1" size={24} />
            {streak.longestStreak}
          </div>
          <div className="text-sm text-zinc-400">Longest Streak</div>
        </div>
      </div>

      {streak.currentStreak > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-300">Streak Bonus</span>
            <span className="text-green-400 font-semibold">+{streak.streakBonus} G$</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((streak.currentStreak / (nextMilestone?.streakDays || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {nextMilestone && (
        <div className="bg-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Target className="mr-2 text-blue-400" size={16} />
              <span className="text-sm font-medium">Next Milestone</span>
            </div>
            <span className="text-sm text-zinc-400">{daysToNextMilestone} days left</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">
              {nextMilestone.streakDays} day streak
            </span>
            <span className="text-sm text-green-400 font-semibold">
              +{nextMilestone.reward} G$ reward
            </span>
          </div>
        </div>
      )}

      {streak.currentStreak === 0 && (
        <div className="text-center py-4">
          <Zap className="mx-auto mb-2 text-yellow-400" size={24} />
          <p className="text-sm text-zinc-400">
            Vote on a movie today to start your streak!
          </p>
        </div>
      )}
    </div>
  )
} 