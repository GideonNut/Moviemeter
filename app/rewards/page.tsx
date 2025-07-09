"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { RefreshCw, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Reward {
  id: string
  title: string
  description: string
  points: number
  imageUrl: string
  isNew: boolean
  lastUpdated: string
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [visibleRewards, setVisibleRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Fix: useInView from 'react-intersection-observer' returns { ref, inView }
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const router = useRouter()

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock rewards data
      const mockRewards: Reward[] = [
        {
          id: "1",
          title: "Free Movie Ticket",
          description: "Redeem your points for a free movie ticket at any participating theater",
          points: 1000,
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dune.jpg-OrhXhtzHwTERlWv2WmCKk6flxZkmya.jpeg",
          isNew: true,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Premium Subscription",
          description: "Get 1 month of premium subscription to our streaming service",
          points: 2000,
          imageUrl: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
          isNew: true,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Exclusive Merchandise",
          description: "Get exclusive movie merchandise from your favorite films",
          points: 1500,
          imageUrl: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
          isNew: true,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "4",
          title: "VIP Screening Pass",
          description: "Get early access to movie screenings before public release",
          points: 3000,
          imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/venom.jpg-rj7NDcBskMVFwvvqxFSuEncIX9Pjbz.jpeg",
          isNew: true,
          lastUpdated: new Date().toISOString(),
        },
      ]

      setRewards(mockRewards)
      setVisibleRewards(mockRewards.slice(0, 4))

      setTimeout(() => {
        setVisibleRewards(mockRewards)
      }, 500)
    } catch (err) {
      setError("Failed to fetch rewards")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      fetchRewards()
    }
  }, [inView, fetchRewards])

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }, [])

  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  }

  return (
    <motion.section ref={ref} className="mb-12" {...containerAnimation}>
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-zinc-400 hover:text-white mb-6"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Available Rewards</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRewards}
            disabled={loading}
            className="flex items-center text-rose-500 hover:text-rose-400"
          >
            <RefreshCw size={18} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-md mb-4">{error}</div>}

      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleRewards.map((reward) => (
            <div key={reward.id} className="flex-shrink-0 w-[280px]">
              <Link href={`/rewards/${reward.id}`} className="group">
                <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors h-full border border-zinc-800">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={reward.imageUrl || "/placeholder.svg"}
                      alt={reward.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {reward.points} POINTS
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="font-medium text-lg group-hover:text-rose-500 transition-colors mb-2">
                      {reward.title}
                    </h2>
                    <p className="text-zinc-400 text-sm line-clamp-2">{reward.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {visibleRewards.length > 3 && (
          <>
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 ${isHovering ? "opacity-100" : "opacity-0"} transition-opacity z-10`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 ${isHovering ? "opacity-100" : "opacity-0"} transition-opacity z-10`}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
      </div>
    </motion.section>
  )
} 