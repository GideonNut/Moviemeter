import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../lib/mongodb"
import Vote from "../../../models/Vote"
import { getVotesFromApillon } from "@/lib/apillon-vote-service"

interface LeaderboardEntry {
	address: string
	totalVotes: number
	yesVotes: number
	noVotes: number
	lastVoteDate: string
	streak: number
}

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase()
		
		// Get all votes from MongoDB
		const allVotes = await Vote.find({}).sort({ timestamp: -1 })
		
		// Group votes by address
		const userStats: Record<string, LeaderboardEntry> = {}
		
		allVotes.forEach((vote: any) => {
			const address = vote.address
			if (!userStats[address]) {
				userStats[address] = {
					address,
					totalVotes: 0,
					yesVotes: 0,
					noVotes: 0,
					lastVoteDate: '',
					streak: 0
				}
			}
			
			userStats[address].totalVotes++
			if (vote.voteType) {
				userStats[address].yesVotes++
			} else {
				userStats[address].noVotes++
			}
			
			const voteDate = new Date(vote.timestamp).toISOString().split('T')[0]
			if (!userStats[address].lastVoteDate || voteDate > userStats[address].lastVoteDate) {
				userStats[address].lastVoteDate = voteDate
			}
		})
		
		// Calculate streaks (simplified - in a real app you'd want more sophisticated streak calculation)
		const today = new Date().toISOString().split('T')[0]
		Object.values(userStats).forEach(user => {
			const lastVote = new Date(user.lastVoteDate)
			const daysSinceLastVote = Math.floor((new Date(today).getTime() - lastVote.getTime()) / (1000 * 60 * 60 * 24))
			// Simple streak calculation - if they voted today or yesterday, give them a streak
			user.streak = daysSinceLastVote <= 1 ? Math.min(user.totalVotes, 30) : 0
		})
		
		// Convert to arrays and sort
		const topVoters = Object.values(userStats)
			.sort((a, b) => b.totalVotes - a.totalVotes)
			.slice(0, 10)
			.map((user, index) => ({
				rank: index + 1,
				address: user.address,
				votes: user.totalVotes,
				streak: user.streak,
				yesVotes: user.yesVotes,
				noVotes: user.noVotes,
				lastVoteDate: user.lastVoteDate
			}))
		
		const longestStreaks = Object.values(userStats)
			.sort((a, b) => b.streak - a.streak)
			.slice(0, 10)
			.map((user, index) => ({
				rank: index + 1,
				address: user.address,
				streak: user.streak,
				totalVotes: user.totalVotes,
				lastVoteDate: user.lastVoteDate
			}))
		
		return NextResponse.json({
			topVoters,
			longestStreaks,
			totalUsers: Object.keys(userStats).length,
			totalVotes: allVotes.length
		})
		
	} catch (error) {
		console.error("Error fetching leaderboard data:", error)
		return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 })
	}
} 