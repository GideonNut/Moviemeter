import { NextRequest, NextResponse } from "next/server"

// Mock data store - in production, this would be stored in a database
let featuredContent = [
  {
    id: "sxsw",
    title: "2025 SXSW Film & TV Festival Cheat Sheet",
    description: "See our picks",
    gradient: "custom-gradient-1",
    type: "list",
    order: 1
  },
  {
    id: "trending-stars",
    title: "Trending: Stars to Watch",
    description: "See the gallery",
    gradient: "custom-gradient-2",
    type: "photos",
    order: 2
  },
  {
    id: "upcoming-releases",
    title: "Most Anticipated Spring Releases",
    description: "View the list",
    gradient: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400",
    type: "list",
    order: 3
  },
  {
    id: "award-winners",
    title: "Oscar Winners 2024",
    description: "Celebrate excellence",
    gradient: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
    type: "list",
    order: 4
  },
  {
    id: "indie-gems",
    title: "Hidden Indie Gems",
    description: "Discover more",
    gradient: "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
    type: "list",
    order: 5
  },
  {
    id: "classic-cinema",
    title: "Classic Cinema Collection",
    description: "Timeless masterpieces",
    gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600",
    type: "list",
    order: 6
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: featuredContent.sort((a, b) => a.order - b.order)
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured content" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newContent = {
      id: body.id || `content-${Date.now()}`,
      title: body.title,
      description: body.description,
      gradient: body.gradient || "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400",
      type: body.type || "list",
      order: body.order || featuredContent.length + 1
    }

    featuredContent.push(newContent)

    return NextResponse.json({
      success: true,
      message: "Featured content added successfully",
      data: newContent
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add featured content" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const contentIndex = featuredContent.findIndex(content => content.id === id)
    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      )
    }

    featuredContent[contentIndex] = { ...featuredContent[contentIndex], ...updates }

    return NextResponse.json({
      success: true,
      message: "Featured content updated successfully",
      data: featuredContent[contentIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update featured content" },
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
        { success: false, message: "Content ID is required" },
        { status: 400 }
      )
    }

    const contentIndex = featuredContent.findIndex(content => content.id === id)
    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      )
    }

    featuredContent.splice(contentIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Featured content deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete featured content" },
      { status: 500 }
    )
  }
}
