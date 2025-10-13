import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function WatchlistLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-56 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto mb-6" />
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Watchlist Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              {/* Movie/Show Poster */}
              <Skeleton className="aspect-[2/3] w-full" />
              
              {/* Content Info */}
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Skeleton (if no items) */}
        <div className="text-center py-12">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </main>
  )
}