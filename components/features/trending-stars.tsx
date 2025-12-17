"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Sample trending stars with new images for Florence Pugh and Zendaya
const trendingStars = [
  {
    id: "star1",
    name: "Zendaya",
    knownFor: "Dune: Part Two, Challengers",
    // New clean image for Zendaya
    imageUrl: "https://i.postimg.cc/yd3Wmqwm/zendaya.jpg",
  },
  {
    id: "star2",
    name: "Timothée Chalamet",
    knownFor: "Dune: Part Two, Wonka",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BOWU1Nzg0M2ItYjEzMi00ODliLThkODAtNGEyYzRkZTBmMmEzXkEyXkFqcGdeQXVyNDk2Mzk2NDg@._V1_.jpg",
  },
  {
    id: "star3",
    name: "Florence Pugh",
    knownFor: "Dune: Part Two, Oppenheimer",
    // New clean image for Florence Pugh
    imageUrl: "https://i.postimg.cc/8P7DsBgv/florence.jpg",
  },
  {
    id: "star4",
    name: "Austin Butler",
    knownFor: "Dune: Part Two, Elvis",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BOWU2MDQyNDMtYjI0OS00MmNiLTk0ZmYtYzU5ZjJkZGEzYTY4XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_.jpg",
  },
  {
    id: "star5",
    name: "Anya Taylor-Joy",
    knownFor: "Furiosa, The Queen's Gambit",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTgxNDcwMzU2Nl5BMl5BanBnXkFtZTgwNDc1MzQ2OTE@._V1_.jpg",
  },
  {
    id: "star6",
    name: "Pedro Pascal",
    knownFor: "The Last of Us, The Mandalorian",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMDQ2ZmE2NTMtZDE3NC00YzFjLWJiNGYtNWZmZTBiZTc0MjYzXkEyXkFqcGdeQXVyMTM1MjAxMDc3._V1_.jpg",
  },
]

export default function TrendingStars() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const starsPerPage = 3

  const nextSlide = () => {
    if (currentIndex + starsPerPage < trendingStars.length) {
      setCurrentIndex(currentIndex + starsPerPage)
    } else {
      setCurrentIndex(0) // Loop back to the beginning
    }
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Trending stars</h2>
        <button onClick={nextSlide} className="text-rose-500 hover:text-rose-400">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingStars.slice(currentIndex, currentIndex + starsPerPage).map((star) => (
          <Link href={`/name/${star.id}`} key={star.id} className="group">
            <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
              {/* Circular image container */}
              <div className="w-full h-72 relative flex items-center justify-center p-6">
                <div className="w-48 h-48 rounded-full overflow-hidden relative">
                  <Image
                    src={star.imageUrl || "/placeholder.svg"}
                    alt={star.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized // Disable Next.js image optimization to ensure no processing
                  />
                </div>
              </div>

              {/* Information below the image */}
              <div className="p-4 text-center">
                <h3 className="font-medium text-lg group-hover:text-rose-500 transition-colors">{star.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">{star.knownFor}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link href="/leaderboards" className="text-rose-500 hover:text-rose-400 text-sm font-medium">
          View all leaderboards
        </Link>
      </div>
    </section>
  )
}
