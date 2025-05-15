"use client"

import { useEffect, useState } from "react"
import { Search, Film, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { movies } from "@/lib/movie-data"
import MiniAppNavigation from "@/components/mini-app-navigation"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DiscoverPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMovies, setFilteredMovies] = useState(movies)

  useEffect(() => {
    if (searchQuery) {
      setFilteredMovies(
        movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredMovies(movies)
    }
  }, [searchQuery])

  const handleMovieClick = (movieId: string) => {
    // Use internal navigation instead of external URL
    router.push(`/mini/movie/${movieId}`)
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Card className="w-full max-w-md mx-auto border-2 border-gray-200 shadow-md m-4">
        <CardHeader className="bg-black text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Discover Movies</h2>
            <Badge variant="outline" className="bg-white text-black">
              MovieMeter
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 bg-white text-black">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-black"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-md font-semibold flex items-center mb-3">
              <TrendingUp className="h-5 w-5 text-black mr-2" />
              Trending Movies
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredMovies.slice(0, 4).map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="aspect-[2/3] relative">
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center p-2">
                          <h4 className="text-sm font-medium text-black">{movie.title}</h4>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-sm font-medium truncate">{movie.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600">Votes: {movie.voteCountYes + movie.voteCountNo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-md font-semibold flex items-center mb-3">
              <Film className="h-5 w-5 text-black mr-2" />
              All Movies
            </h3>
            <div className="space-y-3">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="w-16 h-24 relative">
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Film className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1">
                    <h4 className="font-medium">{movie.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{movie.description}</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="text-xs bg-white text-black">
                        👍 {movie.voteCountYes}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-white text-black ml-2">
                        👎 {movie.voteCountNo}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <MiniAppNavigation />
    </div>
  )
}
