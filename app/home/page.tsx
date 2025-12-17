"use client"

import Link from "next/link"
import FeaturedMovie from "@/components/features/featured-movie"
import UpNextSection from "@/components/features/up-next-section"
import FeaturedToday from "@/components/features/featured-today"
import TrendingStars from "@/components/features/trending-stars"
import NewMoviesSection from "@/components/features/new-movies-section"
import Header from "@/components/layout/header"
import NicknameModal from "@/components/shared/nickname-modal"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black text-foreground">
      <Header />
      <NicknameModal />

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
      </div>
    </main>
  )
} 