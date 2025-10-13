import { Skeleton } from "@/components/ui/skeleton"

export default function GoodVotersLoading() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Back Button */}
      <Skeleton className="h-8 w-20 mb-6" />

      {/* Header Section */}
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-6" />
      </div>

      {/* Wallet Connection */}
      <div className="flex justify-center mb-8">
        <Skeleton className="h-12 w-48" />
      </div>

      {/* Points Balance */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm text-center">
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-12 w-32 mx-auto mb-2" />
          <Skeleton className="h-3 w-40 mx-auto" />
        </div>
      </div>

      {/* GoodDollar Claim Section */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        {/* Claim Button */}
        <Skeleton className="h-12 w-32 mx-auto" />
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-6 h-6 rounded-full mt-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
