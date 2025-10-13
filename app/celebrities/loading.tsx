import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function CelebritiesLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto mb-6" />
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
        </div>

        {/* Celebrities Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="text-center">
              {/* Celebrity Photo */}
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-3" />
              
              {/* Celebrity Name */}
              <Skeleton className="h-5 w-20 mx-auto mb-1" />
              
              {/* Celebrity Role */}
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </main>
  )
}