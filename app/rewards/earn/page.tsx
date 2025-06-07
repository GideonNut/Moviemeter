"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, MessageSquare, Share2, Film } from "lucide-react"

interface EarningMethod {
  id: string
  title: string
  description: string
  points: number
  icon: React.ReactNode
}

export default function EarnRewardsPage() {
  const [earnedPoints, setEarnedPoints] = useState(0)

  const earningMethods: EarningMethod[] = [
    {
      id: "1",
      title: "Rate Movies",
      description: "Earn points by rating movies and providing your feedback",
      points: 10,
      icon: <Star className="w-6 h-6 text-yellow-400" />,
    },
    {
      id: "2",
      title: "Write Reviews",
      description: "Share your thoughts and earn points for detailed movie reviews",
      points: 25,
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
    },
    {
      id: "3",
      title: "Vote on Movies",
      description: "Participate in movie voting polls to earn points",
      points: 15,
      icon: <ThumbsUp className="w-6 h-6 text-green-400" />,
    },
    {
      id: "4",
      title: "Share Content",
      description: "Share movies and reviews on social media to earn points",
      points: 20,
      icon: <Share2 className="w-6 h-6 text-purple-400" />,
    },
    {
      id: "5",
      title: "Watch New Releases",
      description: "Earn points by watching and rating new movie releases",
      points: 30,
      icon: <Film className="w-6 h-6 text-red-400" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Earn Rewards</h1>
          <p className="text-zinc-400 mb-8">
            Complete these activities to earn points and unlock exclusive rewards
          </p>

          {/* Points Summary */}
          <div className="bg-zinc-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Your Points</h2>
            <p className="text-3xl font-bold text-rose-500">{earnedPoints}</p>
            <p className="text-sm text-zinc-400 mt-1">Total points earned</p>
          </div>

          {/* Earning Methods */}
          <div className="space-y-4">
            {earningMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">{method.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{method.title}</h3>
                      <span className="text-rose-500 font-bold">+{method.points} pts</span>
                    </div>
                    <p className="text-zinc-400 mt-1">{method.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">1</div>
                <h3 className="font-semibold mb-2">Complete Activities</h3>
                <p className="text-zinc-400 text-sm">
                  Participate in various activities like rating movies, writing reviews, and more
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">2</div>
                <h3 className="font-semibold mb-2">Earn Points</h3>
                <p className="text-zinc-400 text-sm">
                  Accumulate points for each completed activity
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">3</div>
                <h3 className="font-semibold mb-2">Redeem Rewards</h3>
                <p className="text-zinc-400 text-sm">
                  Use your points to unlock exclusive rewards and benefits
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 