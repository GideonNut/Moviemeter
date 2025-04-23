import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Calendar, Heart, Share2, Play } from "lucide-react"
import MovieAnalysis from "@/components/movie-analysis"

// This would normally come from a database or API
const getMovieDetails = (id: string) => {
  return {
    id,
    title: "Dune: Part Two",
    year: "2024",
    rating: "PG-13",
    runtime: "166 min",
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
    releaseDate: "March 1, 2024",
    imdbRating: 8.8,
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. As he tries to prevent a terrible future, he must reconcile the love of his life with the fate of the universe.",
    director: "Denis Villeneuve",
    stars: [
      { id: "star1", name: "Timothée Chalamet" },
      { id: "star2", name: "Zendaya" },
      { id: "star3", name: "Rebecca Ferguson" },
      { id: "star4", name: "Javier Bardem" },
    ],
    posterUrl: "/placeholder.svg?height=600&width=400",
    backdropUrl: "/placeholder.svg?height=800&width=1600",
    trailerUrl: "#",
  }
}

export default function MoviePage({ params }: { params: { id: string } }) {
  const movie = getMovieDetails(params.id)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Movie Backdrop */}
      <div className="relative h-[50vh]">
        <Image src={movie.backdropUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </div>

            <div className="mt-4 flex flex-col space-y-3">
              <button className="flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded-md font-medium">
                <Play size={18} className="mr-2" />
                Watch Trailer
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md">
                  <Heart size={18} className="mr-2" />
                  Add to Watchlist
                </button>
                <button className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md">
                  <Share2 size={18} className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {movie.title} <span className="text-zinc-400">({movie.year})</span>
            </h1>

            <div className="flex flex-wrap items-center text-sm text-zinc-400 mb-4">
              <span className="mr-3">{movie.rating}</span>
              <span className="flex items-center mr-3">
                <Clock size={14} className="mr-1" /> {movie.runtime}
              </span>
              <span className="flex items-center mr-3">
                <Calendar size={14} className="mr-1" /> {movie.releaseDate}
              </span>
              <div className="flex items-center">
                {movie.genres.map((genre, index) => (
                  <Link key={genre} href={`/genre/${genre.toLowerCase()}`} className="hover:text-rose-500">
                    {genre}
                    {index < movie.genres.length - 1 ? ", " : ""}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 mr-4">
                <Star size={20} className="text-yellow-400 mr-1" />
                <span className="font-bold">{movie.imdbRating}</span>
                <span className="text-zinc-400 text-sm ml-1">/10</span>
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2 text-sm">Rate This</button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-zinc-300">{movie.plot}</p>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-zinc-400 mb-1">Director</h3>
                  <Link
                    href={`/name/${movie.director.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-rose-500"
                  >
                    {movie.director}
                  </Link>
                </div>

                <div>
                  <h3 className="text-zinc-400 mb-1">Stars</h3>
                  <div>
                    {movie.stars.map((star, index) => (
                      <span key={star.id}>
                        <Link href={`/name/${star.id}`} className="hover:text-rose-500">
                          {star.name}
                        </Link>
                        {index < movie.stars.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groq AI Analysis Section */}
        <section className="mt-12 mb-8">
          <MovieAnalysis movieTitle={movie.title} />
        </section>

        {/* Similar Movies Section */}
        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-4">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Link href={`/movies/similar-${i}`} key={i} className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=300&width=200`}
                    alt={`Similar movie ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium group-hover:text-rose-500">Similar Movie {i}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
