"use client"

import { useState, useEffect } from "react"
import { Sparkles, Loader2 } from "lucide-react"

interface MovieAnalysisProps {
  movieTitle: string
}

export default function MovieAnalysis({ movieTitle }: MovieAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!movieTitle) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/movies/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: movieTitle }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch movie analysis")
        }

        const data = await response.json()
        setAnalysis(data.analysis)
        setQuestions(data.questions || [])
      } catch (err) {
        console.error("Error fetching movie analysis:", err)
        setError("Failed to load movie analysis. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [movieTitle])

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-rose-500 mr-2" />
          <p>Generating AI analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Sparkles size={18} className="mr-2 text-rose-500" />
        Groq AI Analysis
      </h3>

      {analysis && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Film Analysis</h4>
          <p className="text-zinc-300 leading-relaxed">{analysis}</p>
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Questions</h4>
          <ul className="space-y-2">
            {questions.map((question, index) => (
              <li key={index} className="bg-zinc-800 p-3 rounded-md border border-zinc-700">
                <p className="text-zinc-300">{question}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
