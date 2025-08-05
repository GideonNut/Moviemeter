"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Star, TrendingUp, Users, Award, Flame, Target, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface LeaderboardData {
  topVoters: Array<{
    rank: number
    address: string
    votes: number
    streak: number
    yesVotes: number
    noVotes: number
    lastVoteDate: string
  }>
  longestStreaks: Array<{
    rank: number
    address: string
    streak: number
    totalVotes: number
    lastVoteDate: string
  }>
  topEarners: Array<{
    rank: number
    address: string
    earnings: number
    activity: string
    totalVotes: number
    streak: number
  }>
  totalUsers: number
  totalVotes: number
}

const leaderboardTypes = [
  { id: "voters", name: "Top Voters", icon: Users, metric: "votes" },
  { id: "earners", name: "Top Earners", icon: Trophy, metric: "earnings" },
  { id: "streaks", name: "Longest Streaks", icon: Flame, metric: "streak" },
]

export default function LeaderboardsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("voters")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [])

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/leaderboards')
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data')
      }
      const data = await response.json()
      setLeaderboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400"
    if (rank === 2) return "text-gray-300"
    if (rank === 3) return "text-amber-600"
    return "text-zinc-400"
  }

  const getCurrentLeaderboardData = () => {
    if (!leaderboardData) return []
    
    switch (activeTab) {
      case "voters":
        return leaderboardData.topVoters
      case "earners":
        return leaderboardData.topEarners
      case "streaks":
        return leaderboardData.longestStreaks
      default:
        return []
    }
  }

  const currentLeaderboard = leaderboardTypes.find(lt => lt.id === activeTab)
  const currentData = getCurrentLeaderboardData()

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Trophy className="mr-3 text-yellow-400" size={40} />
              Leaderboards
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Discover the top performers in the MovieMeter community.
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-zinc-400">Loading leaderboard data...</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Trophy className="mr-3 text-yellow-400" size={40} />
              Leaderboards
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Discover the top performers in the MovieMeter community.
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchLeaderboardData}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Trophy className="mr-3 text-yellow-400" size={40} />
            Leaderboards
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Discover the top performers in the MovieMeter community.
          </p>
          {leaderboardData && (
            <div className="mt-4 text-sm text-zinc-500">
              {leaderboardData.totalUsers} users • {leaderboardData.totalVotes} total votes
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {leaderboardTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === type.id
                  ? "bg-rose-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              <type.icon className="mr-2" size={18} />
              {type.name}
            </button>
          ))}
        </div>

        {currentLeaderboard && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              <div className="bg-zinc-800 px-6 py-4 border-b border-zinc-700">
                <h2 className="text-xl font-semibold flex items-center">
                  <currentLeaderboard.icon className="mr-2" size={20} />
                  {currentLeaderboard.name}
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Updated in real-time • Based on actual voting data
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800 border-b border-zinc-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                        {currentLeaderboard.metric === "votes" && "Total Votes"}
                        {currentLeaderboard.metric === "earnings" && "Total Earnings"}
                        {currentLeaderboard.metric === "streak" && "Current Streak"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                        {currentLeaderboard.metric === "votes" && "Streak"}
                        {currentLeaderboard.metric === "earnings" && "Activity"}
                        {currentLeaderboard.metric === "streak" && "Total Votes"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((user, index) => (
                        <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-lg font-bold ${getRankColor(user.rank)}`}>
                              {getRankIcon(user.rank)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-zinc-700 rounded-full mr-3 flex items-center justify-center">
                                <Users size={16} className="text-zinc-400" />
                              </div>
                              <div>
                                <div className="font-medium text-zinc-200">{user.address}</div>
                                <div className="text-sm text-zinc-400">Active member</div>
                              </div>
                            </div>
                          </td>
                                                     <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-lg font-semibold text-zinc-200">
                               {currentLeaderboard.metric === "votes" && "votes" in user && `${(user as any).votes.toLocaleString()}`}
                               {currentLeaderboard.metric === "earnings" && "earnings" in user && `${(user as any).earnings} G$`}
                               {currentLeaderboard.metric === "streak" && `${user.streak} days`}
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm text-zinc-400">
                               {currentLeaderboard.metric === "votes" && `${user.streak} days`}
                               {currentLeaderboard.metric === "earnings" && "activity" in user && (user as any).activity}
                               {currentLeaderboard.metric === "streak" && "totalVotes" in user && `${(user as any).totalVotes} votes`}
                             </div>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-400">
                          No data available yet. Start voting to see the leaderboards!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 