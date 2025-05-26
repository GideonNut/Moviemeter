"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "thirdweb/react"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { motion } from "framer-motion"
import FeaturedMovie from "@/components/featured-movie"
import UpNextSection from "@/components/up-next-section"
import FeaturedToday from "@/components/featured-today"
import TrendingStars from "@/components/trending-stars"
import NewMoviesSection from "@/components/new-movies-section"
import Header from "@/components/header"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simplified animations for better performance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          {mounted && (
            <Image
              src="/moviemeter-logo.png"
              alt="MovieMeter"
              width={180}
              height={40}
              className="object-contain"
            />
          )}
          {!mounted && (
            <div className="w-[180px] h-[40px]" /> // Placeholder to prevent layout shift
          )}
        </div>
        <div className="flex items-center gap-4">
          {mounted && (
            <ConnectButton
              client={client}
              appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
              chain={celoMainnet}
            />
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div className="max-w-4xl w-full" variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-8 flex justify-center">
            <Image
              src="/mm-logo-new.png"
              alt="MovieMeter Logo"
              width={120}
              height={120}
              className="mb-6"
            />
          </motion.div>

          <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold mb-6">
            Do you love movies? <br />
            Do you trust your movie taste? <br />
            Do you like to earn?
          </motion.h1>

          <motion.p variants={item} className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
            Vote on your favorite films, earn rewards, and join the decentralized movie community.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/home"
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 py-3 px-8 rounded-full text-base font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/movies"
              className="bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 py-3 px-8 rounded-full text-base font-medium transition-colors"
            >
              Earn Rewards
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} MovieMeter. All rights reserved.</p>
      </footer>
    </div>
  )
}
