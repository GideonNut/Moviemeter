import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShareLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto mb-6" />
        </div>

        {/* Share Options */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-6">
            <Skeleton className="h-6 w-48 mb-4" />
            
            {/* Share Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-zinc-800 rounded-lg p-4 text-center border border-zinc-700">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Share Link */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Social Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-3" />
                <Skeleton className="h-6 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
