import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import FeaturedMovie from "@/models/FeaturedMovie"

export async function GET() {
  try {
    await connectToDatabase()
    const items = await FeaturedMovie.find({}).sort({ order: 1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured movies" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const count = await FeaturedMovie.countDocuments()
    const doc = await FeaturedMovie.create({
      slug: body.id || `movie-${Date.now()}`,
      title: body.title || "",
      description: body.description || "",
      trailerUrl: body.trailerUrl || "",
      imageUrl: body.imageUrl || "",
      posterUrl: body.posterUrl || "",
      duration: body.duration || "2:00",
      order: body.order || count + 1,
    })
    return NextResponse.json({ success: true, message: "Featured movie added successfully", data: doc })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add featured movie" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()

    if (Array.isArray(body?.items)) {
      const items = body.items as any[]
      // Upsert each item and set order in provided sequence
      for (let i = 0; i < items.length; i++) {
        const m = items[i]
        await FeaturedMovie.findOneAndUpdate(
          { slug: m.id || m.slug },
          {
            slug: m.id || m.slug,
            title: m.title || "",
            description: m.description || "",
            trailerUrl: m.trailerUrl || "",
            imageUrl: m.imageUrl || "",
            posterUrl: m.posterUrl || "",
            duration: m.duration || "2:00",
            order: i + 1,
          },
          { upsert: true }
        )
      }
      const saved = await FeaturedMovie.find({}).sort({ order: 1 }).lean()
      return NextResponse.json({ success: true, message: "Featured movies saved successfully", data: saved })
    }

    const { id, ...updates } = body
    const updated = await FeaturedMovie.findOneAndUpdate(
      { slug: id },
      { ...updates },
      { new: true }
    )
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, message: "Featured movie updated successfully", data: updated })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update featured movie" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Movie ID is required" },
        { status: 400 }
      )
    }

    await FeaturedMovie.findOneAndDelete({ slug: id })

    return NextResponse.json({ success: true, message: "Featured movie deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete featured movie" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const order = body?.order as string[]

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order array is required" },
        { status: 400 }
      )
    }

    for (let i = 0; i < order.length; i++) {
      const id = order[i]
      await FeaturedMovie.findOneAndUpdate({ slug: id }, { order: i + 1 })
    }

    const items = await FeaturedMovie.find({}).sort({ order: 1 }).lean()
    return NextResponse.json({ success: true, message: "Featured movies reordered successfully", data: items })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to reorder featured movies" },
      { status: 500 }
    )
  }
}