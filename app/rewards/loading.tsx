import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function RewardsLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Skeleton className="h-8 w-20 mb-6" />

        {/* Points Display */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm text-center">
            <Skeleton className="h-4 w-24 mx-auto mb-2" />
            <Skeleton className="h-12 w-32 mx-auto mb-2" />
            <Skeleton className="h-3 w-40 mx-auto" />
          </div>
        </div>

        {/* Rewards Header */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Rewards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              {/* Reward Image */}
              <Skeleton className="aspect-video w-full" />
              
              {/* Points Badge */}
              <div className="relative">
                <Skeleton className="absolute top-2 right-2 h-6 w-20 rounded" />
              </div>
              
              {/* Reward Info */}
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Reward Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
