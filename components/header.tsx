"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, ChevronDown, Bell, Sparkles, Film, Gift, Tv, Users } from "lucide-react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/app/client"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const account = useActiveAccount()

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/moviemeter-logo.png" alt="MovieMeter" width={140} height={40} className="object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Movie Votings Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <Film size={16} className="mr-1.5" />
                Movie Votings <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <Link href="/movies" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    All Movies
                  </Link>
                  <Link href="/top-rated" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Top Rated
                  </Link>
                  <Link href="/coming-soon" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Coming Soon
                  </Link>
                </div>
              </div>
            </div>

            {/* Rewards Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <Gift size={16} className="mr-1.5" />
                Rewards <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <Link href="/rewards/earn" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Earn Rewards
                  </Link>
                  <Link href="/rewards/redeem" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Redeem Points
                  </Link>
                  <Link href="/rewards/history" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Reward History
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Recommendations Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <Sparkles size={16} className="mr-1.5" />
                AI Recommendations <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <Link href="/recommendations" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Get Recommendations
                  </Link>
                  <Link
                    href="/recommendations/popular"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    Popular Picks
                  </Link>
                </div>
              </div>
            </div>

            {/* TV Shows Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <Tv size={16} className="mr-1.5" />
                TV Shows <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <Link href="/tv" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    All Shows
                  </Link>
                  <Link href="/tv/popular" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Popular Shows
                  </Link>
                  <Link href="/tv/upcoming" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Upcoming Releases
                  </Link>
                </div>
              </div>
            </div>

            {/* Celebs Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <Users size={16} className="mr-1.5" />
                Celebs <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <Link href="/celebrities" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    All Celebrities
                  </Link>
                  <Link
                    href="/celebrities/trending"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                  >
                    Trending Stars
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side - Search, Auth & Watchlist */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              {showSearch ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search MovieMeter"
                    className="w-48 bg-zinc-800 text-white rounded-md py-1.5 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setShowSearch(false)
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <Search size={16} className="text-zinc-400" />
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowSearch(true)} className="text-zinc-300 hover:text-white p-1">
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Watchlist Bell */}
            <Link href="/watchlist" className="text-zinc-300 hover:text-white hidden md:flex items-center">
              <Bell size={18} />
            </Link>

            {/* Connect Button */}
            <ConnectButton
              client={client}
              appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
              className="bg-rose-600 hover:bg-rose-700 text-white py-1.5 px-4 rounded text-sm font-medium md:py-1.5 md:px-4 md:text-sm py-1 px-2 text-xs"
            />

            {/* Mobile Menu Button */}
            <button
              className="p-1 rounded-md text-zinc-400 hover:text-white md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 py-2">
          {/* Mobile Search */}
          <div className="px-4 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search MovieMeter"
                className="w-full bg-zinc-700 text-white rounded-md py-2 pl-10 pr-4 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-zinc-400" />
              </div>
            </div>
          </div>

          <nav className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/movies" className="block py-2 text-zinc-300 hover:text-white">
              Movie Votings
            </Link>
            <Link href="/rewards/earn" className="block py-2 text-zinc-300 hover:text-white">
              Rewards
            </Link>
            <Link href="/recommendations" className="block py-2 text-zinc-300 hover:text-white">
              AI Recommendations
            </Link>
            <Link href="/tv" className="block py-2 text-zinc-300 hover:text-white">
              TV Shows
            </Link>
            <Link href="/celebrities" className="block py-2 text-zinc-300 hover:text-white">
              Celebs
            </Link>
            <Link href="/watchlist" className="block py-2 text-zinc-300 hover:text-white">
              Watchlist
            </Link>
            {/* Frame Embeds moved to bottom of mobile menu */}
            <Link href="/frame-embeds" className="block py-2 text-zinc-300 hover:text-white">
              Browse Frames
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

