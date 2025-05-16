import Link from "next/link"
import Image from "next/image"
import { movies } from "@/lib/movie-data"
import Header from "@/components/header"

export default function FrameEmbedsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Farcaster Frame Embeds</h1>

        <p className="text-zinc-300 mb-8 max-w-3xl">
          These are shareable links that you can post on Farcaster. When posted, they will display as frame embeds that
          allow users to vote on movies directly within Farcaster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-zinc-900 rounded-lg overflow-hidden">
              <div className="relative aspect-[2/3] w-full">
                <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{movie.description}</p>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-1">Share URL:</h3>
                    <div className="bg-zinc-800 p-2 rounded text-xs overflow-x-auto">
                      {`${baseUrl}/share?id=${movie.id}`}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-1">Direct Embed URL:</h3>
                    <div className="bg-zinc-800 p-2 rounded text-xs overflow-x-auto">
                      {`${baseUrl}/api/frame-embed/${movie.id}`}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/share?id=${movie.id}`}
                      className="inline-block bg-rose-600 hover:bg-rose-700 text-white text-sm py-2 px-4 rounded w-full text-center"
                    >
                      View Share Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

