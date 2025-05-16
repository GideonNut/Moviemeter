"use client"

import { useState } from "react"
import { RefreshCw, Film, Clock, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const fetchNewMovies = async () => {
    try {
      setLoading(true)
      setResult(null)

      // In a real implementation, this would call your API
      // For demo purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setResult({
        success: true,
        message: "Successfully fetched 3 new movies",
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to fetch new movies",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateAllMovies = async () => {
    try {
      setLoading(true)
      setResult(null)

      // In a real implementation, this would call your API
      // For demo purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setResult({
        success: true,
        message: "Successfully updated information for 10 movies",
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to update movie information",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">AI Agent Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Film className="mr-2" /> Movie Content Management
            </h2>
            <p className="text-zinc-400 mb-4">
              Use the AI agent to fetch new movies and update existing movie information.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={fetchNewMovies}
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                {loading ? <RefreshCw className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />}
                Fetch New Movies
              </button>
              <button
                onClick={updateAllMovies}
                disabled={loading}
                className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                {loading ? <Clock className="animate-spin mr-2" /> : <Clock className="mr-2" />}
                Update All Movie Information
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>AI Agent is active and ready</span>
            </div>
            <div className="text-sm text-zinc-400">
              <p className="mb-2">Last run: 2 hours ago</p>
              <p className="mb-2">Movies in database: 42</p>
              <p>New movies added this week: 7</p>
            </div>

            {result && (
              <div
                className={`mt-4 p-3 rounded ${result.success ? "bg-green-900/20 border border-green-900" : "bg-red-900/20 border border-red-900"}`}
              >
                <div className="flex items-start">
                  {result.success ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <p>{result.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Scheduled Tasks</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-2">Task</th>
                <th className="pb-2">Frequency</th>
                <th className="pb-2">Last Run</th>
                <th className="pb-2">Next Run</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-3">Fetch New Movies</td>
                <td>Daily</td>
                <td>2023-03-28 08:00</td>
                <td>2023-03-29 08:00</td>
                <td>
                  <span className="text-green-500">Active</span>
                </td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-3">Update Movie Information</td>
                <td>Weekly</td>
                <td>2023-03-25 10:00</td>
                <td>2023-04-01 10:00</td>
                <td>
                  <span className="text-green-500">Active</span>
                </td>
              </tr>
              <tr>
                <td className="py-3">Generate Recommendations</td>
                <td>Daily</td>
                <td>2023-03-28 09:00</td>
                <td>2023-03-29 09:00</td>
                <td>
                  <span className="text-green-500">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
