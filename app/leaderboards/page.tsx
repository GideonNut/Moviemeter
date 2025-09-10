"use client"

import { useState, useEffect } from "react"
import { Trophy, Users, Flame, Loader2, ArrowLeft } from "lucide-react"
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
	totalUsers: number
	totalVotes: number
}

const leaderboardTypes = [
	{ id: "voters", name: "Top Voters", icon: Users, metric: "votes" },
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
		const interval = setInterval(fetchLeaderboardData, 15000)
		return () => clearInterval(interval)
	}, [])

	const fetchLeaderboardData = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await fetch('/api/leaderboards', { cache: 'no-store' })
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
			case "streaks":
				return leaderboardData.longestStreaks
			default:
				return []
		}
	}

	const currentLeaderboard = leaderboardTypes.find(lt => lt.id === activeTab)

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 py-6">
				<button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
					<ArrowLeft className="mr-2" size={18} /> Back
				</button>

				<h1 className="text-3xl font-bold mb-2 text-center">Leaderboards</h1>
				<p className="text-zinc-400 mb-8 text-center">Track top community voters and streak holders.</p>

				<div className="flex justify-center space-x-3 mb-6">
					{leaderboardTypes.map((type) => (
						<button
							key={type.id}
							onClick={() => setActiveTab(type.id)}
							className={`px-4 py-2 rounded-md border ${activeTab === type.id ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
						>
							<type.icon className="inline-block mr-2" size={16} />
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
									Auto-refreshes every 15s • Based on actual voting data
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
												{currentLeaderboard.metric === "streak" && "Current Streak"}
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
												{currentLeaderboard.metric === "votes" && "Streak"}
												{currentLeaderboard.metric === "streak" && "Total Votes"}
											</th>
										</tr>
									</thead>
									<tbody>
										{loading && (
											<tr>
												<td colSpan={4} className="px-6 py-8 text-center text-zinc-400">
													<Loader2 className="inline-block mr-2 animate-spin" /> Loading...
												</td>
											</tr>
										)}
										{error && (
											<tr>
												<td colSpan={4} className="px-6 py-8 text-center text-red-400">{error}</td>
											</tr>
										)}
										{!loading && !error && getCurrentLeaderboardData().map((user: any) => (
											<tr key={`${currentLeaderboard.metric}-${user.address}`} className="border-b border-zinc-800">
												<td className={`px-6 py-4 whitespace-nowrap font-semibold ${getRankColor(user.rank)}`}>
													{getRankIcon(user.rank)}
												</td>
												<td className="px-6 py-4">
													<div className="text-sm font-medium text-white">{user.address}</div>
													<div className="text-xs text-zinc-400">Last vote: {user.lastVoteDate}</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-lg font-semibold text-zinc-200">
														{currentLeaderboard.metric === "votes" && "votes" in user && `${user.votes.toLocaleString()}`}
														{currentLeaderboard.metric === "streak" && `${user.streak} days`}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-zinc-400">
														{currentLeaderboard.metric === "votes" && `${user.streak} days`}
														{currentLeaderboard.metric === "streak" && "totalVotes" in user && `${user.totalVotes} votes`}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
} 