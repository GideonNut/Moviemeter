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
    imageUrl: "https://media.glamour.com/photos/65c3d0412d11d3e62e9d3b4c/master/w_2560%2Cc_limit/1917419497",
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
    imageUrl: "https://media.glamour.com/photos/63c5c2398453e73831b69d11/master/w_2560%2Cc_limit/1246133427",
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
              {/* Basic image container with absolutely no styling that could cause overlays */}
              <div className="w-full h-72 relative">
                <Image
                  src={star.imageUrl || "/placeholder.svg"}
                  alt={star.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized // Disable Next.js image optimization to ensure no processing
                />
              </div>

              {/* Information below the image */}
              <div className="p-4">
                <h3 className="font-medium text-lg group-hover:text-rose-500 transition-colors">{star.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">{star.knownFor}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link href="/celebrities" className="text-rose-500 hover:text-rose-400 text-sm font-medium">
          View all trending celebrities
        </Link>
      </div>
    </section>
  )
}
