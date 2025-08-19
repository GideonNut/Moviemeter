import Header from "@/components/header"

export default function WatchlistLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading your watchlist...</div>
        </div>
      </div>
    </main>
  )
}
