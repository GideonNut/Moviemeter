"use client"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/app/client"
import Header from "@/components/header"
import MovieCard from "@/components/movie-card"
import { MovieProvider, useMovies } from "@/lib/state/MovieContext"
import { AlertCircle } from "lucide-react"

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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold mb-6">Vote on Movies</h1>

          {!address && (
            <div className="bg-zinc-900 p-6 rounded-lg mb-8 text-center">
              <p className="mb-4">Connect your wallet to vote on your favorite movies</p>
              <ConnectButton
                client={client}
                appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
                className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded"
              />
            </div>
          )}

          {address && (
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-6 p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-white w-full max-w-md focus:outline-none hover:bg-zinc-800"
              aria-label="Search movies"
            />
          )}
        </div>

        {/* Display error message if there is one */}
        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-md mb-6 flex items-start">
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
