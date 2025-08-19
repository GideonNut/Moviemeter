import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Watchlist from "@/models/Watchlist"
import Movie from "@/models/Movie"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Get all watchlist entries for the user
    const watchlistEntries = await Watchlist.find({ address }).populate("movieId")

    // Extract movie data from populated references
    const movies = watchlistEntries
      .map(entry => entry.movieId)
      .filter(movie => movie !== null) // Filter out any null references

    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { address, movieId } = await request.json()

    if (!address || !movieId) {
      return NextResponse.json({ error: "Address and movieId are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if movie exists
    const movie = await Movie.findById(movieId)
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    // Add to watchlist (will fail if already exists due to unique constraint)
    const watchlistEntry = new Watchlist({ address, movieId })
    await watchlistEntry.save()

    return NextResponse.json({ message: "Added to watchlist", success: true })
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error - already in watchlist
      return NextResponse.json({ message: "Already in watchlist", success: true })
    }
    
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const movieId = searchParams.get("movieId")

    if (!address || !movieId) {
      return NextResponse.json({ error: "Address and movieId are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Remove from watchlist
    const result = await Watchlist.findOneAndDelete({ address, movieId })

    if (!result) {
      return NextResponse.json({ error: "Watchlist entry not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Removed from watchlist", success: true })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
