export interface UserStreak {
  currentStreak: number
  longestStreak: number
  lastVoteDate: string
  totalVotes: number
  streakBonus: number
}

export interface StreakReward {
  streakDays: number
  bonusMultiplier: number
  reward: number
}

const STREAK_REWARDS: StreakReward[] = [
  { streakDays: 1, bonusMultiplier: 1.0, reward: 10 },
  { streakDays: 3, bonusMultiplier: 1.2, reward: 15 },
  { streakDays: 7, bonusMultiplier: 1.5, reward: 25 },
  { streakDays: 14, bonusMultiplier: 2.0, reward: 50 },
  { streakDays: 30, bonusMultiplier: 3.0, reward: 100 },
  { streakDays: 60, bonusMultiplier: 5.0, reward: 200 },
  { streakDays: 100, bonusMultiplier: 10.0, reward: 500 },
]

// In a real app, this would be stored in a database
const userStreaks: Record<string, UserStreak> = {}

export function getUserStreak(address: string): UserStreak {
  if (!userStreaks[address]) {
    userStreaks[address] = {
      currentStreak: 0,
      longestStreak: 0,
      lastVoteDate: '',
      totalVotes: 0,
      streakBonus: 0,
    }
  }
  return userStreaks[address]
}

export function updateUserStreak(address: string): UserStreak {
  const today = new Date().toISOString().split('T')[0]
  const streak = getUserStreak(address)
  
  // Check if user voted today
  if (streak.lastVoteDate === today) {
    return streak // Already voted today
  }
  
  // Check if this is a consecutive day
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  if (streak.lastVoteDate === yesterdayStr) {
    // Consecutive day - increase streak
    streak.currentStreak += 1
  } else if (streak.lastVoteDate !== today) {
    // Not consecutive - reset streak
    streak.currentStreak = 1
  }
  
  // Update longest streak if current is longer
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak
  }
  
  // Update last vote date and total votes
  streak.lastVoteDate = today
  streak.totalVotes += 1
  
  // Calculate streak bonus
  streak.streakBonus = calculateStreakBonus(streak.currentStreak)
  
  return streak
}

export function calculateStreakBonus(currentStreak: number): number {
  const reward = STREAK_REWARDS.find(r => r.streakDays <= currentStreak)
  return reward ? reward.reward : 0
}

export function getStreakRewards(): StreakReward[] {
  return STREAK_REWARDS
}

export function getNextStreakMilestone(currentStreak: number): StreakReward | null {
  return STREAK_REWARDS.find(r => r.streakDays > currentStreak) || null
}

export function getStreakStats(address: string) {
  const streak = getUserStreak(address)
  const nextMilestone = getNextStreakMilestone(streak.currentStreak)
  
  return {
    ...streak,
    nextMilestone,
    daysToNextMilestone: nextMilestone ? nextMilestone.streakDays - streak.currentStreak : 0,
  }
} 