import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"

export default function LeaderboardsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="flex items-center text-zinc-400 mb-6">
          <ArrowLeft className="mr-2" size={18} />
          <Skeleton className="h-5 w-12" />
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-3 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {/* Table Header */}
            <div className="bg-zinc-800 px-6 py-4 border-b border-zinc-700">
              <div className="flex items-center mb-1">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Table Headers */}
            <div className="bg-zinc-800 border-b border-zinc-700">
              <div className="grid grid-cols-5 gap-4 px-6 py-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Table Body - Skeleton Rows */}
            <div className="overflow-x-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-zinc-800 last:border-b-0">
                  {/* Rank */}
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  
                  {/* User Info */}
                  <div className="flex flex-col">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  
                  {/* Points */}
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  
                  {/* Votes/Streak */}
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-12" />
                  </div>
                  
                  {/* Streak/Votes */}
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 