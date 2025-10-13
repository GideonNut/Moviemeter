import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function RecommendationsLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
          </div>

          {/* AI Recommendations Form Skeleton */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-10">
            <Skeleton className="h-5 w-48 mb-3" />
            <Skeleton className="h-24 w-full mb-4" />
            <div className="flex justify-center">
              <Skeleton className="h-12 w-48" />
            </div>
          </div>

          {/* Loading State with Spinner */}
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="animate-spin text-rose-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">Loading AI Recommendations...</h2>
            <p className="text-zinc-400 text-center">Our AI is analyzing movie data to find perfect matches for you</p>
          </div>

          {/* Recommendations Grid Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  {/* Movie Poster */}
                  <Skeleton className="aspect-[2/3] w-full" />
                  
                  {/* Movie Info */}
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
                    
                    {/* Recommendation Reason */}
                    <div className="bg-zinc-800 p-3 rounded-md mt-3 border border-zinc-700">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section Skeleton */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-lg">
            <Skeleton className="h-6 w-64 mb-3" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
                  <Skeleton className="h-5 w-32 mx-auto mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
