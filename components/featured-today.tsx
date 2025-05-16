"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Sample featured content with real images
const featuredContent = [
  {
    id: "sxsw",
    title: "2025 SXSW Film & TV Festival Cheat Sheet",
    description: "See our picks",
    imageUrls: [
      "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BNDJmMzQyMzAtMzMxMy00NTI3LTgzOGMtZDU3Yzu0MmM3MWM3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BZTFkNmE5MjUtZDE1Yi00ZmQyLTk2YWUtN2EwODA1Y2FlMGFlXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
    ],
    type: "list",
  },
  {
    id: "trending-stars",
    title: "Trending: Stars to Watch",
    description: "See the gallery",
    imageUrls: [
      "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMjExOTY3NzExM15BMl5BanBnXkFtZTgwOTM5ODczOTE@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTQzMjkwNTQ2OF5BMl5BanBnXkFtZTgwNTQ3OTQ3NDE@._V1_.jpg",
    ],
    type: "photos",
  },
  {
    id: "upcoming-releases",
    title: "Most Anticipated Spring Releases",
    description: "View the list",
    imageUrls: [
      "https://m.media-amazon.com/images/M/MV5BMTU0MjAwMDkxNV5BMl5BanBnXkFtZTgwMTA4ODIxNjM@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BNzVkOWM5YTEtMDdkNi00YjMzLWEzNWEtODEwN2IyZTc4Yjg2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
    ],
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
                <Image src={item.imageUrls[0] || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
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
