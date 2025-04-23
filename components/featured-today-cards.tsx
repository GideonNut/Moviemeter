"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Film, Star, Calendar } from "lucide-react"

// Sample featured content with custom card designs using vibrant gradients
const featuredContent = [
  {
    id: "sxsw",
    title: "2025 SXSW Film & TV Festival Cheat Sheet",
    description: "See our picks for the most anticipated films and TV shows at next year's SXSW Festival",
    shortDescription: "See our picks",
    icon: <Film className="w-10 h-10 text-white" />,
    bgClass: "bg-gradient-to-br from-blue-600 to-purple-700",
    iconBgClass: "bg-blue-500/30",
    type: "list",
    actionText: "View List",
  },
  {
    id: "trending-stars",
    title: "Trending: Stars to Watch",
    description: "Discover the breakout actors and actresses who are making waves in Hollywood this year",
    shortDescription: "See the gallery",
    icon: <Star className="w-10 h-10 text-white" />,
    bgClass: "bg-gradient-to-br from-orange-500 to-rose-600",
    iconBgClass: "bg-orange-400/30",
    type: "photos",
    actionText: "Browse Gallery",
  },
  {
    id: "upcoming-releases",
    title: "Most Anticipated Spring Releases",
    description: "Mark your calendar for these must-see films coming to theaters this spring",
    shortDescription: "View the list",
    icon: <Calendar className="w-10 h-10 text-white" />,
    bgClass: "bg-gradient-to-br from-emerald-600 to-teal-700",
    iconBgClass: "bg-emerald-500/30",
    type: "list",
    actionText: "View List",
  },
]

export default function FeaturedTodayCards() {
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
          <button onClick={nextSlide} className="text-[#ad264a] hover:text-[#c13a5e]">
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredContent.slice(currentIndex, currentIndex + 3).map((item) => (
          <Link href={`/featured/${item.id}`} key={item.id} className="group">
            <div
              className={`rounded-xl overflow-hidden h-full ${item.bgClass} shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl`}
            >
              <div className="p-6">
                <div className={`${item.iconBgClass} rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.shortDescription}</p>
              </div>
              <div className="bg-black/20 p-4 flex justify-between items-center">
                <span className="text-white/90 text-sm font-medium">{item.actionText}</span>
                <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/40 transition-all">
                  <ChevronRight size={16} className="text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
