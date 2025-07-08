"use client"
import React from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActiveAccount } from "thirdweb/react"

const mockGoodVoters = [
  { address: "0x123...abcd", reward: 150, activity: "Daily voting streak" },
  { address: "0x456...efgh", reward: 120, activity: "Community contribution" },
  { address: "0x789...ijkl", reward: 100, activity: "Referral bonus" },
  { address: "0xabc...mnop", reward: 90, activity: "Participation reward" },
]

export default function GoodVotersPage() {
  const router = useRouter()
  const account = useActiveAccount()

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      router.push("/rewards")
    }
  }
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="mr-2" /> Back
      </button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">GoodDollar Ecosystem Rewards</h1>
        <a
          href="https://wallet.gooddollar.org/Signup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow mb-4 transition-colors duration-200"
        >
          Claim your daily GoodDollar for FREE
        </a>
        <p className="text-lg text-zinc-400 mb-4">
          Welcome to your GoodDollar rewards dashboard! Here you can view all your earned rewards from participating in the GoodDollar ecosystem.
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <p className="text-zinc-300">
            <strong>How it works:</strong> Earn GoodDollar (G$) tokens by participating in community activities, voting on movies, and contributing to the ecosystem. All your rewards from the GoodDollar network will be displayed here.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Your Total Rewards</h3>
          <div className="text-3xl font-bold text-blue-400">{account ? 460 : 0} G$</div>
          <p className="text-zinc-400 mt-2">Total earned from all activities</p>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">This Month</h3>
          <div className="text-3xl font-bold text-blue-400">{account ? 120 : 0} G$</div>
          <p className="text-zinc-400 mt-2">Rewards earned this month</p>
        </div>
      </div>

      {account ? (
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-700">
            <h2 className="text-xl font-semibold">Recent Rewards Activity</h2>
            <p className="text-zinc-400 text-sm">Your latest rewards from the GoodDollar ecosystem</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Reward (G$)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockGoodVoters.map((user, idx) => (
                  <tr key={idx} className="border-b border-zinc-700 hover:bg-zinc-700">
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-200">{user.activity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">+{user.reward} G$</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-400">2024-01-{String(idx + 1).padStart(2, '0')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-800 rounded-lg p-8 text-center text-zinc-400 text-lg mb-8">
          No rewards activity yet.
        </div>
      )}

      <div className="mt-8 bg-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">About GoodDollar Rewards</h3>
        <p className="text-zinc-300 mb-4">
          GoodDollar is a decentralized basic income protocol that distributes G$ tokens to users who participate in the ecosystem. 
          You can earn rewards by:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-2">
          <li>Voting on movies and participating in community decisions</li>
          <li>Referring new users to the platform</li>
          <li>Maintaining daily activity streaks</li>
          <li>Contributing to community discussions and feedback</li>
          <li>Completing special challenges and events</li>
        </ul>
        <p className="text-zinc-400 mt-4 text-sm">
          All rewards are automatically calculated and distributed through smart contracts on the blockchain, ensuring transparency and fairness.
        </p>
      </div>
    </div>
  )
} 