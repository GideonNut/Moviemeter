import Image from "next/image"
import Link from "next/link"
import { Star, Filter } from "lucide-react"

// Sample TV shows data
const tvShows = [
  {
    id: "show1",
    title: "The Last of Us",
    year: "2023-",
    rating: 8.8,
    genres: ["Action", "Adventure", "Drama"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show2",
    title: "House of the Dragon",
    year: "2022-",
    rating: 8.5,
    genres: ["Action", "Adventure", "Drama"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show3",
    title: "Severance",
    year: "2022-",
    rating: 8.7,
    genres: ["Drama", "Mystery", "Sci-Fi"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show4",
    title: "The Bear",
    year: "2022-",
    rating: 8.6,
    genres: ["Comedy", "Drama"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show5",
    title: "Shogun",
    year: "2024-",
    rating: 9.1,
    genres: ["Action", "Drama", "History"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show6",
    title: "True Detective",
    year: "2014-",
    rating: 8.9,
    genres: ["Crime", "Drama", "Mystery"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show7",
    title: "Fallout",
    year: "2024-",
    rating: 8.7,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
  {
    id: "show8",
    title: "The Boys",
    year: "2019-",
    rating: 8.7,
    genres: ["Action", "Comedy", "Crime"],
    posterUrl: "/placeholder.svg?height=450&width=300",
  },
]

export default function TVShowsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Popular TV Shows</h1>
          <button className="flex items-center bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tvShows.map((show) => (
            <Link href={`/tv/${show.id}`} key={show.id} className="group">
              <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={show.posterUrl || "/placeholder.svg"}
                    alt={show.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3">
                  <div className="flex items-center mb-1">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{show.rating}</span>
                  </div>
                  <h2 className="font-medium group-hover:text-rose-500 transition-colors line-clamp-1">{show.title}</h2>
                  <p className="text-zinc-400 text-sm">{show.year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-6 rounded-md">Load More</button>
        </div>
      </div>
    </main>
  )
}
