"use client"

import { useState, useEffect } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  return (
    <motion.div
      className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className="text-xl font-bold mb-4 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Sparkles size={18} className="mr-2 text-rose-500" />
        Groq AI Analysis
      </motion.h3>

      {loading ? (
        <motion.div
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 size={24} className="animate-spin text-rose-500 mr-2" />
          <p>Generating AI analysis...</p>
        </motion.div>
      ) : error ? (
        <motion.p
          className="text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      ) : (
        <>
          {analysis && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-2">Film Analysis</h4>
              <p className="text-zinc-300 leading-relaxed">{analysis}</p>
            </motion.div>
          )}

          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-2">Discussion Questions</h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {questions.map((question, index) => (
                    <motion.div
                      key={index}
                      className="bg-zinc-800 p-3 rounded-md border border-zinc-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <p className="text-zinc-300">{question}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}
