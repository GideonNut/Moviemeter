"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { celoMainnet } from "@/lib/blockchain-service";
import { motion } from "framer-motion"
import Header from "@/components/header"
import PartnersSection from "@/components/partners-section"
import EarningProcess from "@/components/earning-process"
import FAQSection from "@/components/faq-section"
import { AnimatedMovies } from "@/components/ui/animatedmovies"
import { useTheme } from "next-themes"
import { Sun, Moon, Trophy, Star, Users } from "lucide-react"
import { AnimatedBackground } from '@/components/motion-primitives/animated-background'
import { account } from '../lib/appwrite'

const client = createThirdwebClient({
  clientId: "e56828eab87b58000cb9a78170fac45b",
});

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "telegram", 
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "apple",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

function AnimatedCardBackgroundHover() {
  const ITEMS = [
    {
      id: 1,
      title: 'Rate movies',
      description: 'Vote on your favorite films and shape the future of recommendations.',
    },
    {
      id: 2,
      title: 'Earn Rewards',
      description: 'Get rewarded in $G for your engagements.',
    },
    {
      id: 3,
      title: 'Community',
      description: 'Join a vibrant community of movie enthusiasts and critics.',
    },
  ];

  return (
    <div className='w-full p-10'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {ITEMS.map((item, index) => (
          <AnimatedBackground
            key={index}
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6,
            }}
            enableHover
          >
            <div className="rounded-lg bg-zinc-100 border-[1px] border-[#ffffff1f] dark:bg-[#0d0d0d] p-12 h-full">
              <div className='flex flex-col select-none items-center gap-6'>
                {index === 0 && (
                  <div className="bg-white rounded-lg w-14 h-14 flex items-center justify-center ">
                  <Star className="w-10 h-10 text-zinc-800 dark:text-zinc-800 flex-shrink-0" />
                  </div>
                )}
                {index === 1 && (
                  <div className="bg-white rounded-lg w-14 h-14 flex items-center justify-center ">
                  <Trophy className="w-10 h-10 text-zinc-800 dark:text-zinc-800 flex-shrink-0" />
                  </div>
                )}
                {index === 2 && (
                  <div className="bg-white rounded-lg w-14 h-14  flex items-center justify-center ">
                  <Users className="w-10 h-10 text-zinc-800 dark:text-zinc-800 flex-shrink-0" />
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  <h3 className='text-2xl text-center font-medium text-zinc-800 dark:text-zinc-50'>
                    {item.title}
                  </h3>
                  <p className='text-xl text-zinc-600 text-center dark:text-zinc-400'>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedBackground>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [result, setResult] = useState<string | null>(null)
  const [featuredMovies, setFeaturedMovies] = useState([])

  // Fetch featured movies for the showcase
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await fetch('/api/movies')
        const movies = await response.json()
        
        // Transform movie data to match AnimatedMovies component format
        const formattedMovies = movies.slice(0, 5).map((movie: any) => ({
          quote: movie.description || "A captivating story that will keep you on the edge of your seat.",
          name: movie.title,
          designation: `${new Date(movie.createdAt).getFullYear()} • ${movie.isTVSeries ? 'TV Series' : 'Movie'}`,
          src: movie.posterUrl || "/placeholder-movie.jpg"
        }))
        
        setFeaturedMovies(formattedMovies)
      } catch (error) {
        console.error('Failed to fetch movies:', error)
      
      }
    }

    fetchFeaturedMovies()
  }, [])

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

  const handlePing = async () => {
    try {
      await account.get()
      setResult('Connected to Appwrite! (User session exists)')
    } catch (error: any) {
      if (error.code === 401) {
        setResult('Connected to Appwrite! (No user session, but connection works)')
      } else {
        setResult('Connection failed: ' + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Dark Horizon Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />
      
      <div className="min-h-screen flex flex-col text-foreground relative">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center">
            {mounted && (
              <Image
                src={theme === "dark" ? "/moviemeter-dark.png" : "/logo.png"}
                alt="MovieMeter"
                width={180}
                height={40}
                className="object-contain"
              />
            )}
            {!mounted && (
              <div className="w-[180px] h-[40px]" />
            )}
          </div>
          <div className="flex items-center gap-4">
            {mounted && (
              <ConnectButton
                client={client}
                chain={celoMainnet}
                connectModal={{ showThirdwebBranding: false, size: "compact" }}
                theme={darkTheme({
                  colors: {
                    accentText: "hsl(0, 0%, 100%)",
                    skeletonBg: "hsl(233, 12%, 15%)",
                    connectedButtonBg: "hsl(228, 12%, 8%)",
                  },
                })}
                wallets={wallets}
                accountAbstraction={{ chain: celoMainnet, sponsorGas: true }}
              />
            )}
            <button
              className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === "dark" ? (
                  <Sun size={20} className="text-foreground" />
                ) : (
                  <Moon size={20} className="text-foreground" />
                )
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          <motion.div className="max-w-6xl w-full" variants={container} initial="hidden" animate="show">
            
            {/* Featured Movies Showcase */}
            <motion.div variants={item} className="mb-8">
              {featuredMovies.length > 0 && (
                <AnimatedMovies  
                  testimonials={featuredMovies}
                  autoplay={true}
                />
              )}
            </motion.div>

            <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Do you love movies? <br />
              Do you trust your movie taste? <br />
              Do you like to earn?
            </motion.h1>

            <motion.p variants={item} className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Vote on your favorite films, earn rewards, and join the decentralized movie community.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/home"
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-8 rounded-full text-base font-medium transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/movies"
                className="bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground py-3 px-8 rounded-full text-base font-medium transition-colors"
              >
                Earn Rewards
              </Link>
            </motion.div>
          </motion.div>
        </main>

        {/* All other sections */}
        <div className="relative z-10">
          <PartnersSection />
          <AnimatedCardBackgroundHover />
          <EarningProcess />
          <FAQSection />
          
          <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MovieMeter. All rights reserved.</p>
          </footer>

          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <button onClick={handlePing}>Send a ping</button>
            {result && <p>{result}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
