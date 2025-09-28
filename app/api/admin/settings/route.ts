import { NextRequest, NextResponse } from "next/server"

// Mock settings store - in production, this would be stored in a database
let settings = {
  general: {
    siteName: "MovieMeter",
    maintenanceMode: false,
    enableComments: false,
    enableVoting: true,
    showRecommendations: true
  },
  explore: {
    moviesPage: {
      enableVoting: true,
      showRecommendations: true,
      enableComments: false
    },
    recommendationsPage: {
      enableAI: true,
      personalizedSuggestions: false
    },
    celebritiesPage: {
      showProfiles: true,
      enableVoting: false
    }
  },
  api: {
    openaiApiKey: "",
    rateLimit: 100
  },
  analytics: {
    totalUsers: 1234,
    activeUsers: 892,
    totalVotes: 5678,
    moviesInDatabase: 42,
    newMoviesThisWeek: 7
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { section, ...updates } = body

    if (!section) {
      return NextResponse.json(
        { success: false, message: "Section is required" },
        { status: 400 }
      )
    }

    if (settings[section as keyof typeof settings]) {
      settings[section as keyof typeof settings] = {
        ...settings[section as keyof typeof settings],
        ...updates
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid section" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: settings
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === "fetchNewMovies") {
      // Simulate fetching new movies
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      settings.analytics.moviesInDatabase += 3
      settings.analytics.newMoviesThisWeek += 3

      return NextResponse.json({
        success: true,
        message: "Successfully fetched 3 new movies",
        data: settings.analytics
      })
    }

    if (action === "updateAllMovies") {
      // Simulate updating all movies
      await new Promise(resolve => setTimeout(resolve, 3000))

      return NextResponse.json({
        success: true,
        message: "Successfully updated information for 10 movies"
      })
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to perform action" },
      { status: 500 }
    )
  }
}
