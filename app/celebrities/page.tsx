"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { useInView } from "react-intersection-observer"

// Sample celebrities data
const celebrities = [
  {
    id: "celeb1",
    name: "Zendaya",
    knownFor: "Dune: Part Two, Challengers",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb2",
    name: "Timothée Chalamet",
    knownFor: "Dune: Part Two, Wonka",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb3",
    name: "Florence Pugh",
    knownFor: "Dune: Part Two, Oppenheimer",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb4",
    name: "Austin Butler",
    knownFor: "Dune: Part Two, Elvis",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb5",
    name: "Anya Taylor-Joy",
    knownFor: "Furiosa, The Queen's Gambit",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb6",
    name: "Pedro Pascal",
    knownFor: "The Last of Us, The Mandalorian",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb7",
    name: "Margot Robbie",
    knownFor: "Barbie, Babylon",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb8",
    name: "Ryan Gosling",
    knownFor: "Barbie, The Fall Guy",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb9",
    name: "Cillian Murphy",
    knownFor: "Oppenheimer, Peaky Blinders",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb10",
    name: "Emily Blunt",
    knownFor: "Oppenheimer, The Fall Guy",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
]

export default function CelebritiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // For infinite scroll, we'll show celebrities in batches
  const [displayCount, setDisplayCount] = useState(20)
  
  const filteredCelebrities = celebrities.filter((celeb) =>
    celeb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    celeb.knownFor.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const displayedCelebrities = filteredCelebrities.slice(0, displayCount)
  const hasMore = displayCount < filteredCelebrities.length

  // Load more function
  const loadMore = () => {
    if (hasMore) {
      setDisplayCount(prev => Math.min(prev + 20, filteredCelebrities.length))
    }
  }

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView && hasMore) {
      loadMore()
    }
  }, [inView, hasMore])

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Popular Celebrities</h1>

        <div className="relative max-w-xl mb-8">
          <input
            type="text"
            placeholder="Search for a celebrity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-rose-600"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={20} className="text-zinc-400" />
          </div>
        </div>

        {displayedCelebrities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No celebrities found.</p>
            <p className="text-zinc-500 text-sm mt-2">Try adjusting your search.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {displayedCelebrities.map((celeb) => (
                <Link href={`/name/${celeb.id}`} key={celeb.id} className="group">
                  <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={celeb.imageUrl || "/placeholder.svg"}
                        alt={celeb.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-3">
                      <h2 className="font-medium group-hover:text-rose-500 transition-colors">{celeb.name}</h2>
                      <p className="text-zinc-400 text-sm line-clamp-1">{celeb.knownFor}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
                  <span>Loading more celebrities...</span>
                </div>
              </div>
            )}
            
            {/* End of results indicator */}
            {!hasMore && filteredCelebrities.length > 0 && (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-sm">You've reached the end of the celebrities list</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
