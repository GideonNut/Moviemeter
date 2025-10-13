import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function MoviesLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-6" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Skeleton className="h-10 w-full md:w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        {/* Movie Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              {/* Movie Poster */}
              <Skeleton className="aspect-[2/3] w-full" />
              
              {/* Movie Info */}
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                
                {/* Vote Buttons */}
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                
                {/* Vote Counts */}
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite scroll loading indicator */}
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
            <span>Loading more movies...</span>
          </div>
        </div>
      </div>
    </main>
  )
}
