"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface MovieAnalysisProps {
  movieTitle: string
}

export default function MovieAnalysis({ movieTitle }: MovieAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Only load the analysis when the component is in view
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    // Only fetch when in view and not already attempted
    if (inView && !hasAttemptedFetch && movieTitle) {
      const fetchAnalysis = async () => {
        // Cancel any previous requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController()

        try {
          setLoading(true)
          setError(null)

          const response = await fetch("/api/movies/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: movieTitle }),
            signal: abortControllerRef.current.signal,
          })

          if (!response.ok) {
            throw new Error("Failed to fetch movie analysis")
          }

          const data = await response.json()
          setAnalysis(data.analysis)
          setQuestions(data.questions || [])
        } catch (err) {
          // Don't set error if it was just aborted
          if ((err as Error).name !== "AbortError") {
            console.error("Error fetching movie analysis:", err)
            setError("Failed to load movie analysis. Please try again later.")
          }
        } finally {
          setLoading(false)
          setHasAttemptedFetch(true)
        }
      }

      fetchAnalysis()
    }

    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [inView, movieTitle, hasAttemptedFetch])

  // Simplified animations for better performance
  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  }

  return (
    <motion.div ref={ref} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800" {...containerAnimation}>
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Sparkles size={18} className="mr-2 text-rose-500" />
        AI Movie Analysis
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-rose-500 mr-2" />
          <p>Generating analysis...</p>
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          {analysis && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Film Analysis</h4>
              <p className="text-zinc-300 leading-relaxed">{analysis}</p>
            </div>
          )}

          {questions.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Discussion Questions</h4>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="bg-zinc-800 p-3 rounded-md border border-zinc-700">
                    <p className="text-zinc-300">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
