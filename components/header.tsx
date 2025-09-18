"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, ChevronDown, Bell, Sparkles, Film, Gift, Tv, Users, Trophy } from "lucide-react"
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { celoMainnet } from "@/lib/blockchain-service";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
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
      // chain: celoMainnet,
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16" onClick={closeDropdown}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/moviemeter.png" alt="MovieMeter" width={168} height={48} className="object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Movie Votings Link */}
            <Link href="/movies" className="flex items-center text-zinc-300 hover:text-white text-sm font-semibold py-2">
              <Film size={16} className="mr-1.5" />
              Movie Votings
            </Link>

            {/* TV Shows Link */}
            <Link href="/tv" className="flex items-center text-zinc-300 hover:text-white text-sm font-semibold py-2">
              <Tv size={16} className="mr-1.5" />
              TV Shows
            </Link>

            {/* AI Recommendations Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-zinc-300 hover:text-white text-sm font-semibold py-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDropdownToggle("ai")
                }}
                onMouseEnter={() => setOpenDropdown("ai")}
              >
                <Sparkles size={16} className="mr-1.5" />
                AI Recommendations <ChevronDown size={14} className="ml-1" />
              </button>
              <div
                className={`absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg transition-all duration-200 ${
                  openDropdown === "ai" ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onMouseLeave={() => setOpenDropdown(null)}
              >
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

            {/* Rewards Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-zinc-300 hover:text-white text-sm font-semibold py-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDropdownToggle("rewards")
                }}
                onMouseEnter={() => setOpenDropdown("rewards")}
              >
                <Gift size={16} className="mr-1.5" />
                Rewards <ChevronDown size={14} className="ml-1" />
              </button>
              <div
                className={`absolute left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg transition-all duration-200 ${
                  openDropdown === "rewards" ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onMouseLeave={() => setOpenDropdown(null)}
              >
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
                  <Link href="/rewards/good-voters" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Good Voters
                  </Link>
                  <Link href="/rewards/streak" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                    Streak Rewards
                  </Link>
                </div>
              </div>
            </div>

            {/* Leaderboards Link */}
            <Link href="/leaderboards" className="flex items-center text-zinc-300 hover:text-white text-sm font-semibold py-2">
              <Trophy size={16} className="mr-1.5" />
              Leaderboards
            </Link>
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
            <Link href="/movies" className="block py-2 text-zinc-300 hover:text-white font-semibold">
              Movie Votings
            </Link>
            <Link href="/tv" className="block py-2 text-zinc-300 hover:text-white font-semibold">
              TV Shows
            </Link>
            <Link href="/recommendations" className="block py-2 text-zinc-300 hover:text-white font-semibold">
              AI Recommendations
            </Link>
            <Link href="/rewards/earn" className="block py-2 text-zinc-300 hover:text-white font-semibold">
              Rewards
            </Link>
            <Link href="/leaderboards" className="block py-2 text-zinc-300 hover:text-white font-semibold">
              Leaderboards
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
