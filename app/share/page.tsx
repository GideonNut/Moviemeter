import type { Metadata } from "next"
import { movies } from "@/lib/movie-data"

interface PageProps {
  searchParams: { id?: string }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const id = searchParams.id || "0"
  const movie = movies.find((m) => m.id === id) || movies[0]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

  // Create the frame embed JSON according to the v2 spec
  const frameEmbed = {
    version: "next",
    imageUrl: `${baseUrl}/api/image?id=${id}`,
    button: {
      title: "Vote on this movie",
      action: {
        type: "launch_frame",
        url: `${baseUrl}/farcaster?id=${id}`,
        name: "MovieMeter",
        splashImageUrl: `${baseUrl}/mm-logo-new.png`,
        splashBackgroundColor: "#18181b",
      },
    },
  }

  return {
    title: `Vote on ${movie.title} | MovieMeter`,
    description: movie.description,
    openGraph: {
      title: `Vote on ${movie.title} | MovieMeter`,
      description: movie.description,
      images: [`${baseUrl}/api/image?id=${id}`],
    },
    other: {
      "fc:frame": JSON.stringify(frameEmbed),
    },
  }
}

export default function SharePage({ searchParams }: PageProps) {
  const id = searchParams.id || "0"
  const movie = movies.find((m) => m.id === id) || movies[0]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

  // Create the frame embed JSON for client-side rendering
  const frameEmbed = {
    version: "next",
    imageUrl: `${baseUrl}/api/image?id=${id}`,
    button: {
      title: "Vote on this movie",
      action: {
        type: "launch_frame",
        url: `${baseUrl}/farcaster?id=${id}`,
        name: "MovieMeter",
        splashImageUrl: `${baseUrl}/mm-logo-new.png`,
        splashBackgroundColor: "#18181b",
      },
    },
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Share {movie.title} on Farcaster</h1>
        <p className="mb-6">{movie.description}</p>

        {/* Display the movie poster */}
        <div className="relative w-64 h-96 mx-auto mb-6">
          <img
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Frame Embed URL</h2>
          <p className="text-zinc-400 mb-2">
            Copy this URL and paste it into Farcaster to share this movie with your followers.
          </p>
          <div className="bg-zinc-800 p-2 rounded text-sm overflow-x-auto">{`${baseUrl}/share?id=${id}`}</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Frame Embed JSON</h2>
          <pre className="bg-zinc-800 p-2 rounded text-sm overflow-x-auto text-left">
            {JSON.stringify(frameEmbed, null, 2)}
          </pre>
        </div>
      </div>

      {/* Hidden meta tag for frame embed */}
      <meta name="fc:frame" content={JSON.stringify(frameEmbed)} />
    </div>
  )
}

