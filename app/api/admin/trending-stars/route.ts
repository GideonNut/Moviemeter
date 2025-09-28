import { NextRequest, NextResponse } from "next/server"

// Mock data store - in production, this would be stored in a database
let trendingStars = [
  {
    id: "star1",
    name: "Zendaya",
    knownFor: "Dune: Part Two, Challengers",
    imageUrl: "https://i.postimg.cc/yd3Wmqwm/zendaya.jpg",
    order: 1
  },
  {
    id: "star2",
    name: "Timothée Chalamet",
    knownFor: "Dune: Part Two, Wonka",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOWU1Nzg0M2ItYjEzMi00ODliLThkODAtNGEyYzRkZTBmMmEzXkEyXkFqcGdeQXVyNDk2Mzk2NDg@._V1_.jpg",
    order: 2
  },
  {
    id: "star3",
    name: "Florence Pugh",
    knownFor: "Dune: Part Two, Oppenheimer",
    imageUrl: "https://i.postimg.cc/8P7DsBgv/florence.jpg",
    order: 3
  },
  {
    id: "star4",
    name: "Austin Butler",
    knownFor: "Dune: Part Two, Elvis",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOWU2MDQyNDMtYjI0OS00MmNiLTk0ZmYtYzU5ZjJkZGEzYTY4XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_.jpg",
    order: 4
  },
  {
    id: "star5",
    name: "Anya Taylor-Joy",
    knownFor: "Furiosa, The Queen's Gambit",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTgxNDcwMzU2Nl5BMl5BanBnXkFtZTgwNDc1MzQ2OTE@._V1_.jpg",
    order: 5
  },
  {
    id: "star6",
    name: "Pedro Pascal",
    knownFor: "The Last of Us, The Mandalorian",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDQ2ZmE2NTMtZDE3NC00YzFjLWJiNGYtNWZmZTBiZTc0MjYzXkEyXkFqcGdeQXVyMTM1MjAxMDc3._V1_.jpg",
    order: 6
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: trendingStars.sort((a, b) => a.order - b.order)
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch trending stars" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newStar = {
      id: body.id || `star-${Date.now()}`,
      name: body.name,
      knownFor: body.knownFor,
      imageUrl: body.imageUrl || "",
      order: body.order || trendingStars.length + 1
    }

    trendingStars.push(newStar)

    return NextResponse.json({
      success: true,
      message: "Trending star added successfully",
      data: newStar
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add trending star" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const starIndex = trendingStars.findIndex(star => star.id === id)
    if (starIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Star not found" },
        { status: 404 }
      )
    }

    trendingStars[starIndex] = { ...trendingStars[starIndex], ...updates }

    return NextResponse.json({
      success: true,
      message: "Trending star updated successfully",
      data: trendingStars[starIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update trending star" },
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
        { success: false, message: "Star ID is required" },
        { status: 400 }
      )
    }

    const starIndex = trendingStars.findIndex(star => star.id === id)
    if (starIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Star not found" },
        { status: 404 }
      )
    }

    trendingStars.splice(starIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Trending star deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete trending star" },
      { status: 500 }
    )
  }
}
