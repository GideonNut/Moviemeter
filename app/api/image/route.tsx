import type { NextRequest } from "next/server"
import { ImageResponse } from "next/og"
import { movies } from "@/lib/movie-data"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const movieId = searchParams.get("id") || "0"

    // Find the movie by ID
    const movie = movies.find((m) => m.id === movieId) || movies[0]

    // Load the movie poster image
    let posterImageData
    try {
      const posterRes = await fetch(movie.posterUrl)
      posterImageData = await posterRes.arrayBuffer()
    } catch (error) {
      console.error("Error loading poster image:", error)
    }

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
            width: "100%",
            maxWidth: "1000px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Movie Poster */}
          {posterImageData && (
            <div
              style={{
                position: "relative",
                width: "250px",
                height: "375px",
                marginRight: "40px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
              }}
            >
              <img
                src={`data:image/jpeg;base64,${Buffer.from(posterImageData).toString("base64")}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Movie Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* MovieMeter Logo */}
            <img
              src={`data:image/png;base64,${Buffer.from(await fetch(new URL("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20new%20png-8zbnlahmwmM17hQbwnPKIWLDdr6pvq.png")).then((res) => res.arrayBuffer())).toString("base64")}`}
              alt="MovieMeter"
              style={{
                width: "240px",
                marginBottom: "20px",
              }}
            />

            <h2
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "12px",
                lineHeight: 1.2,
              }}
            >
              {movie.title}
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                color: "#a1a1aa", // zinc-400
              }}
            >
              <span style={{ fontSize: "20px" }}>{movie.releaseYear}</span>
              {movie.rating && (
                <>
                  <span style={{ margin: "0 8px" }}>•</span>
                  <span style={{ display: "flex", alignItems: "center", fontSize: "20px" }}>⭐ {movie.rating}</span>
                </>
              )}
              {movie.genres && (
                <>
                  <span style={{ margin: "0 8px" }}>•</span>
                  <span style={{ fontSize: "20px" }}>{movie.genres.slice(0, 2).join(", ")}</span>
                </>
              )}
            </div>

            <p
              style={{
                fontSize: "24px",
                color: "#d4d4d8", // zinc-300
                marginBottom: "24px",
                lineHeight: 1.4,
              }}
            >
              {movie.description.length > 120 ? movie.description.substring(0, 120) + "..." : movie.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#be123c", // rose-700
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "24px",
                fontWeight: "bold",
                width: "fit-content",
              }}
            >
              Vote on this movie
            </div>
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

