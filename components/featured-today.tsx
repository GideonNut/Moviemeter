"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Sample featured content with gradients instead of real images
const featuredContent = [
  {
    id: "sxsw",
    title: "2025 SXSW Film & TV Festival Cheat Sheet",
    description: "See our picks",
    gradient: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500",
    type: "list",
  },
  {
    id: "trending-stars",
    title: "Trending: Stars to Watch",
    description: "See the gallery",
    gradient: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
    type: "photos",
  },
  {
    id: "upcoming-releases",
    title: "Most Anticipated Spring Releases",
    description: "View the list",
    gradient: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400",
    type: "list",
  },
  {
    id: "award-winners",
    title: "Oscar Winners 2024",
    description: "Celebrate excellence",
    gradient: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
    type: "list",
  },
  {
    id: "indie-gems",
    title: "Hidden Indie Gems",
    description: "Discover more",
    gradient: "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
    type: "list",
  },
  {
    id: "classic-cinema",
    title: "Classic Cinema Collection",
    description: "Timeless masterpieces",
    gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600",
    type: "list",
  },
]

export default function FeaturedToday() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    if (currentIndex < featuredContent.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Featured today</h2>
        {currentIndex < featuredContent.length - 1 && (
          <button onClick={nextSlide} className="text-rose-500 hover:text-rose-400">
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredContent.slice(currentIndex, currentIndex + 3).map((item) => (
          <Link href={`/featured/${item.id}`} key={item.id} className="group">
            <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
              <div className={`relative h-48 overflow-hidden ${item.gradient} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <h3 className="text-xl font-bold mb-2 leading-tight">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="text-center">
                  <div className="text-rose-500 text-sm font-medium">View Details</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
