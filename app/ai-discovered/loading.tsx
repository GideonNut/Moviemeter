import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIDiscoveredLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-6" />
        </div>

        {/* Filter Section */}
        <div className="flex justify-center gap-4 mb-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* AI Discovered Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              {/* Movie Poster */}
              <Skeleton className="aspect-[2/3] w-full" />
              
              {/* AI Badge */}
              <div className="relative">
                <Skeleton className="absolute top-2 right-2 h-6 w-20 rounded-full" />
              </div>
              
              {/* Movie Info */}
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                
                {/* AI Discovery Info */}
                <div className="bg-zinc-800 p-3 rounded-md mb-3 border border-zinc-700">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </main>
  )
}
