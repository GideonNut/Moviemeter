import { Skeleton } from "@/components/ui/skeleton"
import { MovieCardSkeleton } from "./skeleton-card"

export function MoviesPageSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Skeleton className="h-8 w-32 bg-zinc-800" />
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-6 w-20 bg-zinc-800" />
              <Skeleton className="h-6 w-20 bg-zinc-800" />
              <Skeleton className="h-6 w-20 bg-zinc-800" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32 bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-zinc-800" />
          <Skeleton className="h-5 w-96 mx-auto bg-zinc-800" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Skeleton className="h-10 w-full md:w-96 bg-zinc-800" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24 bg-zinc-800" />
            <Skeleton className="h-10 w-24 bg-zinc-800" />
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="group relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
              <Skeleton className="w-full aspect-[2/3] bg-zinc-800" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 bg-zinc-800" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                  <Skeleton className="h-4 w-2/3 bg-zinc-800" />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-10 w-20 bg-zinc-800" />
                  <Skeleton className="h-10 w-20 bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export function TVShowsPageSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Skeleton className="h-8 w-32 bg-zinc-800" />
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-6 w-20 bg-zinc-800" />
              <Skeleton className="h-6 w-20 bg-zinc-800" />
              <Skeleton className="h-6 w-20 bg-zinc-800" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32 bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-zinc-800" />
          <Skeleton className="h-5 w-96 mx-auto bg-zinc-800" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Skeleton className="h-10 w-full md:w-96 bg-zinc-800" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24 bg-zinc-800" />
            <Skeleton className="h-10 w-24 bg-zinc-800" />
          </div>
        </div>

        {/* TV Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="group relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
              <Skeleton className="w-full aspect-[2/3] bg-zinc-800" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 bg-zinc-800" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-10 w-20 bg-zinc-800" />
                  <Skeleton className="h-10 w-20 bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
