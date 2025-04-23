"use client"
import { useState } from "react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/app/client"
import Header from "@/components/header"
import MovieCard from "@/components/movie-card"
import { MovieProvider, useMovies } from "@/lib/state/MovieContext"
import { AlertCircle, RefreshCw } from "lucide-react"

// Wrapper component that provides the MovieContext
export default function MoviesPage() {
  return (
    <MovieProvider>
      <MoviesPageContent />
    </MovieProvider>
  )
}

// Main content component that uses the MovieContext
function MoviesPageContent() {
  const account = useActiveAccount()
  const address = account?.address
  const { filteredMovies, searchQuery, setSearchQuery, error } = useMovies()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Function to refresh vote data
  const refreshVotes = async () => {
    if (!address) return

    setIsRefreshing(true)

    try {
      // Wait for 2 seconds to simulate refreshing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Force a re-render by changing the key of the MovieProvider
      // This will cause the useEffect in MovieContext to run again
      window.location.reload()
    } catch (error) {
      console.error("Error refreshing votes:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold mb-6 text-white">Vote on Movies</h1>

          {!address && (
            <div className="bg-[#121212] p-6 mb-8 text-center max-w-md w-full border border-[#222222] rounded-lg">
              <p className="mb-4 text-zinc-300">Connect your wallet to vote on your favorite movies</p>
              <ConnectButton
                client={client}
                appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
                className="bg-[#ad264a] hover:bg-[#c13a5e] text-white py-2 px-6 rounded-full transition-colors duration-300"
              />
            </div>
          )}

          {address && (
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#121212] border border-[#222222] rounded-full py-2 pl-10 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#ad264a] transition-all duration-300"
                    aria-label="Search movies"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={18} className="text-zinc-400" />
                  </div>
                </div>
                <button
                  onClick={refreshVotes}
                  disabled={isRefreshing}
                  className="bg-[#121212] hover:bg-[#1a1a1a] text-white p-3 rounded-full transition-colors duration-300 border border-[#222222]"
                  aria-label="Refresh votes"
                >
                  <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Display error message if there is one */}
        {error && (
          <div className="bg-[#3a1a1a] border border-[#5a2a2a] text-red-200 p-4 rounded-xl mb-6 flex items-start max-w-2xl mx-auto">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
            <p>{error}</p>
          </div>
        )}

        {address && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} id={movie.id} title={movie.title} description={movie.description} />
            ))}

            {filteredMovies.length === 0 && searchQuery && (
              <div className="col-span-full text-center py-10">
                <p className="text-zinc-400">No movies found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

// Add the missing Search component
function Search(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}
