import Link from "next/link"
import FeaturedMovie from "@/components/featured-movie"
import UpNextSection from "@/components/up-next-section"
import FeaturedToday from "@/components/featured-today"
import TrendingStars from "@/components/trending-stars"
import NewMoviesSection from "@/components/new-movies-section"
import Header from "@/components/header"

export default function Page() {
  return (
    <main className="min-h-[100vh] bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section with Featured Movie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <FeaturedMovie />
          </div>
          <div className="lg:col-span-1">
            <UpNextSection />
          </div>
        </div>

        {/* AI-Discovered New Movies Section */}
        <NewMoviesSection />

        {/* Featured Today Section */}
        <FeaturedToday />

        {/* Trending Stars Section */}
        <TrendingStars />

        {/* Farcaster Frame Promo */}
        <div className="bg-zinc-900 p-6 rounded-lg mb-8 max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">Farcaster Frames</h2>
          <p className="mb-4">
            MovieMeter is now available as Farcaster Frames! Vote on your favorite movies directly within Farcaster.
            Each movie has its own dedicated Frame with yes/no voting buttons.
          </p>
          <Link
            href="/movies"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded"
          >
            Browse Movies & Frames
          </Link>
        </div>
      </div>
    </main>
  )
}

