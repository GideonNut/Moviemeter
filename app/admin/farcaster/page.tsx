"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function FarcasterAdminPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminToken, setAdminToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`)
      }

      const data = await response.json()
      setAnalytics(data)
      setIsAuthenticated(true)
    } catch (err) {
      setError((err as Error).message)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, we'll use mock data
  useEffect(() => {
    if (isAuthenticated) return

    // Mock data for demonstration
    setAnalytics({
      totalViews: 1245,
      totalInteractions: 687,
      interactionRate: 55.2,
      viewsByMovie: {
        "0": 412,
        "1": 325,
        "2": 298,
        "3": 210,
      },
      interactionsByMovie: {
        "0": 245,
        "1": 178,
        "2": 156,
        "3": 108,
      },
      interactionsByType: {
        vote_yes: 412,
        vote_no: 198,
        next_movie: 77,
      },
    })
    setLoading(false)
  }, [isAuthenticated])

  // Prepare chart data
  const prepareMovieData = () => {
    if (!analytics) return []

    return Object.keys(analytics.viewsByMovie).map((movieId) => {
      const movieNames: Record<string, string> = {
        "0": "Inception",
        "1": "Interstellar",
        "2": "The Dark Knight",
        "3": "Avengers: Endgame",
      }

      return {
        name: movieNames[movieId] || `Movie ${movieId}`,
        views: analytics.viewsByMovie[movieId] || 0,
        interactions: analytics.interactionsByMovie[movieId] || 0,
      }
    })
  }

  const prepareInteractionData = () => {
    if (!analytics) return []

    return [
      { name: "👍 Yes", value: analytics.interactionsByType.vote_yes },
      { name: "👎 No", value: analytics.interactionsByType.vote_no },
      { name: "Next Movie", value: analytics.interactionsByType.next_movie },
    ]
  }

  const COLORS = ["#4CAF50", "#F44336", "#2196F3"]

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Farcaster Mini App Dashboard</h1>

        {!isAuthenticated && (
          <div className="bg-zinc-900 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Admin Authentication</h2>
            <div className="flex gap-4">
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter admin token"
                className="flex-1 bg-zinc-800 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-1 focus:ring-rose-600"
              />
              <button onClick={fetchAnalytics} className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded">
                Authenticate
              </button>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            <p className="mt-4 text-zinc-400 text-sm">
              For demo purposes, you can view the dashboard without authentication.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
        ) : analytics ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="text-zinc-400 text-sm mb-1">Total Frame Views</h3>
                <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="text-zinc-400 text-sm mb-1">Total Interactions</h3>
                <p className="text-3xl font-bold">{analytics.totalInteractions.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="text-zinc-400 text-sm mb-1">Interaction Rate</h3>
                <p className="text-3xl font-bold">{analytics.interactionRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Movie Performance Chart */}
            <div className="bg-zinc-900 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Movie Performance</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareMovieData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="views" name="Views" fill="#8884d8" />
                    <Bar dataKey="interactions" name="Interactions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interaction Types Chart */}
            <div className="bg-zinc-900 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Interaction Types</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareInteractionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareInteractionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Movie</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-800">
                      <td className="py-3">2 minutes ago</td>
                      <td>Inception</td>
                      <td>
                        <span className="text-green-500">👍 Yes Vote</span>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-3">5 minutes ago</td>
                      <td>The Dark Knight</td>
                      <td>
                        <span className="text-red-500">👎 No Vote</span>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-3">8 minutes ago</td>
                      <td>Interstellar</td>
                      <td>
                        <span className="text-blue-500">Next Movie</span>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-3">12 minutes ago</td>
                      <td>Avengers: Endgame</td>
                      <td>
                        <span className="text-green-500">👍 Yes Vote</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">15 minutes ago</td>
                      <td>Inception</td>
                      <td>
                        <span className="text-green-500">👍 Yes Vote</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-900 p-6 rounded-lg">
            <p>No analytics data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
