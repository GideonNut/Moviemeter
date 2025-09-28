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
