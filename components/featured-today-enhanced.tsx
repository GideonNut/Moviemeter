"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Film, Star, Calendar } from "lucide-react"

// Sample featured content with styled cards
const featuredContent = [
  {
    id: "sxsw",
    title: "2025 SXSW Film & TV Festival Cheat Sheet",
    description: "See our picks",
    icon: <Film className="w-8 h-8 text-rose-500" />,
    bgColor: "bg-gradient-to-r from-blue-900 to-purple-900",
    type: "list",
  },
  {
    id: "trending-stars",
    title: "Trending: Stars to Watch",
    description: "See the gallery",
    icon: <Star className="w-8 h-8 text-yellow-400" />,
    bgColor: "bg-gradient-to-r from-indigo-900 to-blue-900",
    type: "photos",
  },
  {
    id: "upcoming-releases",
    title: "Most Anticipated Spring Releases",
    description: "View the list",
    icon: <Calendar className="w-8 h-8 text-green-400" />,
    bgColor: "bg-gradient-to-r from-green-900 to-teal-900",
    type: "list",
  },
]

export default function FeaturedTodayEnhanced() {
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
            <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors h-full">
              <div className={`relative h-48 overflow-hidden ${item.bgColor} flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full flex items-center justify-center">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-16 h-16 bg-white opacity-10 rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          transform: `scale(${Math.random() * 2 + 0.5})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="z-10 text-center">
                  {item.icon}
                  <h3 className="text-xl font-bold text-white mt-2">{item.title.split(":")[0]}</h3>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg group-hover:text-rose-500 transition-colors">{item.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
