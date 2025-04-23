"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Sample featured content with themed placeholder images
const featuredContent = [
  {
    id: "sxsw",
    title: "2025 SXSW Film & TV Festival Cheat Sheet",
    description: "See our picks",
    imageUrl: "/placeholder.svg?height=300&width=500&text=SXSW+2025+Festival+Guide",
    type: "list",
  },
  {
    id: "trending-stars",
    title: "Trending: Stars to Watch",
    description: "See the gallery",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Rising+Stars+of+2025",
    type: "photos",
  },
  {
    id: "upcoming-releases",
    title: "Most Anticipated Spring Releases",
    description: "View the list",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Spring+2025+Movie+Preview",
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
              <div className="relative h-48 overflow-hidden">
                <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
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
