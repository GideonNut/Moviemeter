import { NextRequest, NextResponse } from "next/server"

// Mock data store - in production, this would be stored in a database
let featuredMovies = [
  {
    id: "mission-impossible-final-reckoning",
    title: "Mission: Impossible - The Final Reckoning",
    description: "Ethan Hunt and his IMF team embark on their most dangerous mission yet, facing a mysterious enemy that threatens all of humanity.",
    trailerUrl: "https://www.youtube.com/embed/fsQgc9pCyDU",
    imageUrl: "https://i.postimg.cc/MGNwGPQb/mission-impossible.jpg",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDc0YTQ5NGEtMWQ4OC00NjM2LThmNDAtZTI0MDI5OGYzYjFjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    duration: "2:35",
    order: 1
  },
  {
    id: "dune-2",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    imageUrl: "https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjhkZWY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    duration: "2:35",
    order: 2
  },
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    description: "Wade Wilson's peaceful life is interrupted when former colleagues come calling, forcing him to team up with Wolverine.",
    trailerUrl: "https://www.youtube.com/embed/4sUQfaQjKd8",
    imageUrl: "https://i.ytimg.com/vi/4sUQfaQjKd8/maxresdefault.jpg",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQ5MGQyODAtNTg3OC00Y2VjLTkzODktNmU0MWYyZjZmMmRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    duration: "2:15",
    order: 3
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: featuredMovies.sort((a, b) => a.order - b.order)
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured movies" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newMovie = {
      id: body.id || `movie-${Date.now()}`,
      title: body.title,
      description: body.description,
      trailerUrl: body.trailerUrl || "",
      imageUrl: body.imageUrl || "",
      posterUrl: body.posterUrl || "",
      duration: body.duration || "2:00",
      order: body.order || featuredMovies.length + 1
    }

    featuredMovies.push(newMovie)

    return NextResponse.json({
      success: true,
      message: "Featured movie added successfully",
      data: newMovie
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add featured movie" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    // Bulk replace mode
    if (Array.isArray(body?.items)) {
      const items = body.items

      // Basic validation and normalization
      let nextOrder = 1
      featuredMovies = items.map((m: any) => ({
        id: m.id,
        title: m.title || "",
        description: m.description || "",
        trailerUrl: m.trailerUrl || "",
        imageUrl: m.imageUrl || "",
        posterUrl: m.posterUrl || "",
        duration: m.duration || "2:00",
        order: typeof m.order === "number" ? m.order : nextOrder++
      }))
      featuredMovies.sort((a, b) => a.order - b.order)

      return NextResponse.json({
        success: true,
        message: "Featured movies saved successfully",
        data: featuredMovies
      })
    }

    // Single item update mode
    const { id, ...updates } = body

    const movieIndex = featuredMovies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      )
    }

    featuredMovies[movieIndex] = { ...featuredMovies[movieIndex], ...updates }

    return NextResponse.json({
      success: true,
      message: "Featured movie updated successfully",
      data: featuredMovies[movieIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update featured movie" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Movie ID is required" },
        { status: 400 }
      )
    }

    const movieIndex = featuredMovies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      )
    }

    featuredMovies.splice(movieIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Featured movie deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete featured movie" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const order = body?.order as string[]

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order array is required" },
        { status: 400 }
      )
    }

    // Update order based on provided array of ids
    const idToIndex = new Map(order.map((id: string, index: number) => [id, index + 1]))
    featuredMovies = featuredMovies.map(movie => {
      const newOrder = idToIndex.get(movie.id)
      return newOrder ? { ...movie, order: newOrder } : movie
    })

    // Normalize any movies not included to end
    const missing = featuredMovies.filter(m => !idToIndex.has(m.id))
    if (missing.length > 0) {
      // Place missing after provided, preserving relative order
      const maxProvided = order.length
      let offset = 1
      featuredMovies = featuredMovies.map(movie => {
        if (!idToIndex.has(movie.id)) {
          return { ...movie, order: maxProvided + offset++ }
        }
        return movie
      })
    }

    featuredMovies.sort((a, b) => a.order - b.order)

    return NextResponse.json({
      success: true,
      message: "Featured movies reordered successfully",
      data: featuredMovies
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to reorder featured movies" },
      { status: 500 }
    )
  }
}