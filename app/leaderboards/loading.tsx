export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-12 bg-zinc-800 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-6 bg-zinc-800 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-32 bg-zinc-800 rounded-lg animate-pulse"></div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            <div className="bg-zinc-800 px-6 py-4">
              <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            </div>
            
            <div className="p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center py-4 border-b border-zinc-700 last:border-b-0">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full mr-4 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-zinc-800 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 