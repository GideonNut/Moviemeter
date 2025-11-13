import { Skeleton } from "@/components/ui/skeleton"

export function MovieCardSkeleton() {
  return (
    <div className="group relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
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
  )
}

export function TVShowCardSkeleton() {
  return (
    <div className="group relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
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
  )
}
