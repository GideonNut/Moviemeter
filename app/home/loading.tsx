import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black text-foreground">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section with Featured Movie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            {/* Featured Movie Skeleton */}
            <div className="bg-gray-200 dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-800">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6">
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            {/* Up Next Section Skeleton */}
            <div className="bg-gray-200 dark:bg-zinc-900 rounded-lg p-6 border border-gray-300 dark:border-zinc-800">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-16 h-24 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI-Discovered New Movies Section Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-800">
                <Skeleton className="aspect-[2/3] w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Today Section Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-800">
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

        {/* Trending Stars Section Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-44 mb-6" />
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
