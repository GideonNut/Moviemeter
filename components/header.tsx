"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, ChevronDown, Bell, Sparkles, Film, Gift, Tv, Users, MessageCircle } from "lucide-react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/app/client"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const account = useActiveAccount()

  return (
    <header className="bg-black border-b border-[#222222] sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20png-r3dxjfHmuTVCaDvJ5i6eDlG2qHoJ5N.png"
              alt="MovieMeter"
              width={140}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Movie Votings Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <Film size={16} className="mr-1.5" />
                Movie Votings <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-[#121212] rounded-lg shadow-lg hidden group-hover:block border border-[#222222]">
                <div className="py-1">
                  <Link
                    href="/movies"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    All Movies
                  </Link>
                  <Link
                    href="/top-rated"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Top Rated
                  </Link>
                  <Link
                    href="/coming-soon"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
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
              <div className="absolute left-0 mt-1 w-48 bg-[#121212] rounded-lg shadow-lg hidden group-hover:block border border-[#222222]">
                <div className="py-1">
                  <Link
                    href="/rewards/earn"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Earn Rewards
                  </Link>
                  <Link
                    href="/rewards/redeem"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Redeem Points
                  </Link>
                  <Link
                    href="/rewards/history"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
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
              <div className="absolute left-0 mt-1 w-48 bg-[#121212] rounded-lg shadow-lg hidden group-hover:block border border-[#222222]">
                <div className="py-1">
                  <Link
                    href="/recommendations"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Get Recommendations
                  </Link>
                  <Link
                    href="/recommendations/popular"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
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
              <div className="absolute left-0 mt-1 w-48 bg-[#121212] rounded-lg shadow-lg hidden group-hover:block border border-[#222222]">
                <div className="py-1">
                  <Link
                    href="/tv"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    All Shows
                  </Link>
                  <Link
                    href="/tv/popular"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Popular Shows
                  </Link>
                  <Link
                    href="/tv/upcoming"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
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
              <div className="absolute left-0 mt-1 w-48 bg-[#121212] rounded-lg shadow-lg hidden group-hover:block border border-[#222222]">
                <div className="py-1">
                  <Link
                    href="/celebrities"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    All Celebrities
                  </Link>
                  <Link
                    href="/celebrities/trending"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Trending Stars
                  </Link>
                </div>
              </div>
            </div>

            {/* Community channel link */}
            <div className="relative group">
              <button className="flex items-center text-zinc-300 hover:text-white text-sm font-medium py-2">
                <MessageCircle size={16} className="mr-1.5" />
                Community <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-[#121212] rounded-lg shadow-lg hidden group-hover:block border border-[#222222]">
                <div className="py-1">
                  <Link
                    href="https://t.me/movies_society"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    Join Telegram Channel
                  </Link>
                  <Link
                    href="/recommendations"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] rounded-lg mx-1 my-1"
                  >
                    View Recommendations
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
                    className="w-48 bg-[#121212] text-white rounded-full py-1.5 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#ad264a] border border-[#222222]"
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
              className="bg-[#ad264a] hover:bg-[#c13a5e] text-white py-1.5 px-4 rounded-full text-sm font-medium transition-colors duration-300"
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
        <div className="md:hidden bg-[#121212] py-2 border-t border-[#222222]">
          {/* Mobile Search */}
          <div className="px-4 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search MovieMeter"
                className="w-full bg-black text-white rounded-full py-2 pl-10 pr-4 focus:outline-none border border-[#222222]"
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
            {/* Telegram link to mobile menu */}
            <Link
              href="https://t.me/movies_society"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-zinc-300 hover:text-white"
            >
              Community Channel
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
