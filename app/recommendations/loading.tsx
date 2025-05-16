import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 size={48} className="animate-spin text-rose-500 mb-4" />
        <h2 className="text-xl font-medium">Loading AI Recommendations...</h2>
        <p className="text-zinc-400 mt-2">Our AI is analyzing movie data to find perfect matches for you</p>
      </div>
    </div>
  )
}
