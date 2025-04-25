"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "thirdweb/react"
import { client } from "@/app/client"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20png-r3dxjfHmuTVCaDvJ5i6eDlG2qHoJ5N.png"
            alt="MovieMeter"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold">MovieMeter</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {mounted && (
            <ConnectButton
              client={client}
              appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
              className="bg-[#ad264a] dark:bg-[#ad264a] text-white py-2 px-4 rounded-full text-sm font-medium transition-colors"
            />
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div className="max-w-4xl w-full" variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-8 flex justify-center">
            <div className="flex flex-col items-end">
              <div className="w-16 h-2 bg-black dark:bg-white mb-2"></div>
              <div className="w-12 h-2 bg-black dark:bg-white mb-2"></div>
              <div className="w-8 h-2 bg-black dark:bg-white"></div>
            </div>
          </motion.div>

          <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold mb-6">
            Experience Movies
            <br />
            Like Never Before
          </motion.h1>

          <motion.p variants={item} className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
            Vote on your favorite films, earn rewards, and join the decentralized movie community.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
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
