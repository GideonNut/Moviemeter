import { Skeleton } from "@/components/ui/skeleton"

export default function StreakLoading() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Back Button */}
      <Skeleton className="h-8 w-20 mb-6" />

      {/* Header Section */}
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-72 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto mb-6" />
      </div>

      {/* Current Streak Display */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-center mb-8">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-32 mx-auto mb-2" />
        <Skeleton className="h-6 w-48 mx-auto mb-4" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      {/* Streak Rewards */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <Skeleton className="h-6 w-16 mb-3" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Streak History */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
