// Simple in-memory analytics for demo purposes
// In production, use a database or analytics service

interface FrameView {
  timestamp: number
  movieId: string
  fid?: number
}

interface FrameInteraction {
  timestamp: number
  movieId: string
  action: "vote_yes" | "vote_no" | "next_movie"
  fid?: number
}

// In-memory storage (would be a database in production)
const frameViews: FrameView[] = []
const frameInteractions: FrameInteraction[] = []

export function trackFrameView(movieId: string, fid?: number) {
  frameViews.push({
    timestamp: Date.now(),
    movieId,
    fid,
  })

  console.log(`Frame view tracked: Movie ID ${movieId}, FID: ${fid || "anonymous"}`)
  return true
}

export function trackFrameInteraction(movieId: string, action: "vote_yes" | "vote_no" | "next_movie", fid?: number) {
  frameInteractions.push({
    timestamp: Date.now(),
    movieId,
    action,
    fid,
  })

  console.log(`Frame interaction tracked: Movie ID ${movieId}, Action: ${action}, FID: ${fid || "anonymous"}`)
  return true
}

export function getAnalytics() {
  // Get analytics for the last 24 hours
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

  const recentViews = frameViews.filter((view) => view.timestamp >= oneDayAgo)
  const recentInteractions = frameInteractions.filter((interaction) => interaction.timestamp >= oneDayAgo)

  // Calculate metrics
  const totalViews = recentViews.length
  const totalInteractions = recentInteractions.length
  const interactionRate = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0

  // Count by movie ID
  const viewsByMovie: Record<string, number> = {}
  const interactionsByMovie: Record<string, number> = {}

  recentViews.forEach((view) => {
    viewsByMovie[view.movieId] = (viewsByMovie[view.movieId] || 0) + 1
  })

  recentInteractions.forEach((interaction) => {
    interactionsByMovie[interaction.movieId] = (interactionsByMovie[interaction.movieId] || 0) + 1
  })

  // Count by action type
  const interactionsByType: Record<string, number> = {
    vote_yes: 0,
    vote_no: 0,
    next_movie: 0,
  }

  recentInteractions.forEach((interaction) => {
    interactionsByType[interaction.action] += 1
  })

  return {
    totalViews,
    totalInteractions,
    interactionRate,
    viewsByMovie,
    interactionsByMovie,
    interactionsByType,
  }
}
