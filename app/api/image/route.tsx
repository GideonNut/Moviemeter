import type { NextRequest } from "next/server"
import { ImageResponse } from "next/og"

// Define movie data
const movies = [
  { id: "0", title: "Inception", description: "A thief enters dreams to steal secrets." },
  { id: "1", title: "Interstellar", description: "A space epic exploring love and time." },
  { id: "2", title: "The Dark Knight", description: "Batman faces off against the Joker." },
  { id: "3", title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
]

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const movieId = searchParams.get("id") || "0"
    const isOwner = searchParams.get("isOwner") === "true"

    // Find the movie by ID
    const movie = movies.find((m) => m.id === movieId) || movies[0]

    // Generate the image
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#18181b", // zinc-950
          color: "#e5e5e5", // neutral-200
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* MovieMeter Logo - Rendered as text with styling to match the logo */}
          <div
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#be123c", // rose-700
              fontFamily: "cursive, sans-serif",
              textAlign: "center",
            }}
          >
            MovieMeter
          </div>

          {isOwner && (
            <p
              style={{
                fontSize: "20px",
                marginBottom: "20px",
                color: "#fbbf24", // amber-400
              }}
            >
              Welcome back, MovieMeter creator!
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#27272a", // zinc-800
              borderRadius: "12px",
              padding: "24px",
              width: "80%",
              marginTop: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              {movie.title}
            </h2>
            <p
              style={{
                fontSize: "24px",
                color: "#a1a1aa", // zinc-400
                marginBottom: "24px",
              }}
            >
              {movie.description}
            </p>
            <p
              style={{
                fontSize: "20px",
                marginTop: "24px",
              }}
            >
              Do you like this movie?
            </p>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating image:", error)
    return new Response("Error generating image", { status: 500 })
  }
}

