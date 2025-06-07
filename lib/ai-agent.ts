import { OpenAIStream, StreamingTextResponse } from 'ai'
import { openai } from "@ai-sdk/openai"

// Types for movie data
export interface MovieData {
  id: string
  title: string
  description: string
  releaseDate: string
  posterUrl?: string
  rating?: number
  genres?: string[]
  isNew?: boolean
  lastUpdated: string
  backdropUrl?: string
}

// Mock database for storing fetched movies
// In a real implementation, this would be replaced with a database like Supabase, MongoDB, etc.
let movieDatabase: MovieData[] = [
  {
    id: "0",
    title: "Inception",
    description: "A thief enters dreams to steal secrets.",
    releaseDate: "2010-07-16",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "1",
    title: "Interstellar",
    description: "A space epic exploring love and time.",
    releaseDate: "2014-11-07",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    title: "The Dark Knight",
    description: "Batman faces off against the Joker.",
    releaseDate: "2008-07-18",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Avengers: Endgame",
    description: "The Avengers assemble for one last fight.",
    releaseDate: "2019-04-26",
    lastUpdated: new Date().toISOString(),
  },
]

// Function to get all movies
export async function getAllMovies(): Promise<MovieData[]> {
  return movieDatabase
}

// Function to get new movies (added in the last 7 days)
export async function getNewMovies(): Promise<MovieData[]> {
  return movieDatabase.filter((movie) => movie.isNew)
}

// Function to get a movie by ID
export async function getMovieById(id: string): Promise<MovieData | null> {
  return movieDatabase.find((movie) => movie.id === id) || null
}

// AI Agent to fetch new movie data
export async function fetchNewMovies(): Promise<MovieData[]> {
  try {
    // Use AI to generate information about new movies
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Generate information about 3 new movies that were released recently. Include title, description, release date, and genres. Format as JSON array."
        }
      ],
      temperature: 0.7,
    })

    // Parse the generated text as JSON
    const text = response.choices[0]?.message?.content || "[]"
    const newMoviesData = JSON.parse(text) as Partial<MovieData>[]

    // Process and add the new movies to our database
    const newMovies = newMoviesData.map((movie, index) => {
      // High-quality movie poster URLs for AI-generated movies
      const hdPosterUrls = [
        "https://m.media-amazon.com/images/M/MV5BNzQ5MGQyODAtNTg3OC00Y2VjLTkzODktNmU0MWYyZjZmMmRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg", // Deadpool & Wolverine
        "https://m.media-amazon.com/images/M/MV5BMTU0MjAwMDkxNV5BMl5BanBnXkFtZTgwMTA4ODIxNjM@._V1_.jpg", // A Quiet Place
        "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg", // Furiosa
        "https://m.media-amazon.com/images/M/MV5BNzVkOWM5YTEtMDdkNi00YjMzLWEzNWEtODEwN2IyZTc4Yjg2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg", // Kingdom of the Planet of the Apes
      ]

      const newMovie: MovieData = {
        id: (movieDatabase.length + index).toString(),
        title: movie.title || "Unknown Title",
        description: movie.description || "No description available",
        releaseDate: movie.releaseDate || new Date().toISOString().split("T")[0],
        genres: movie.genres || [],
        isNew: true,
        lastUpdated: new Date().toISOString(),
        // Use a high-quality poster image instead of a placeholder
        posterUrl: hdPosterUrls[index % hdPosterUrls.length],
        // Add backdrop URL for better visuals
        backdropUrl: `https://m.media-amazon.com/images/M/MV5BMTg0NTM3MTI1MF5BMl5BanBnXkFtZTgwMTAzNTAzNzE@._V1_.jpg`,
      }
      return newMovie
    })

    // Add new movies to the database
    movieDatabase = [...movieDatabase, ...newMovies]

    return newMovies
  } catch (error) {
    console.error("Error fetching new movies:", error)
    return []
  }
}

// AI Agent to update existing movie information
export async function updateMovieInformation(movieId: string): Promise<MovieData | null> {
  try {
    const movie = await getMovieById(movieId)
    if (!movie) return null

    // Use AI to generate updated information about the movie
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Update the information for the movie "${movie.title}". Generate a more detailed description, updated rating, and any new information. Format as JSON.`
        }
      ],
      temperature: 0.7,
    })

    // Parse the generated text as JSON
    const text = response.choices[0]?.message?.content || "{}"
    const updatedData = JSON.parse(text) as Partial<MovieData>

    // Update the movie in our database
    const updatedMovie: MovieData = {
      ...movie,
      description: updatedData.description || movie.description,
      rating: updatedData.rating || movie.rating,
      lastUpdated: new Date().toISOString(),
    }

    // Update the movie in the database
    movieDatabase = movieDatabase.map((m) => (m.id === movieId ? updatedMovie : m))

    return updatedMovie
  } catch (error) {
    console.error(`Error updating movie ${movieId}:`, error)
    return null
  }
}

// AI Agent to recommend movies based on user preferences
export async function getMovieRecommendations(userPreferences: string): Promise<MovieData[]> {
  try {
    // Use AI to generate movie recommendations based on user preferences
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Based on the user preferences: "${userPreferences}", recommend 3 movies from this list: ${JSON.stringify(movieDatabase.map((m) => m.title))}. Explain why each movie is recommended. Format as JSON array with title and reason fields.`
        }
      ],
      temperature: 0.7,
    })

    // Parse the generated text as JSON
    const text = response.choices[0]?.message?.content || "[]"
    const recommendations = JSON.parse(text) as { title: string; reason: string }[]

    // Find the recommended movies in our database
    const recommendedMovies = recommendations
      .map((rec) => {
        const movie = movieDatabase.find((m) => m.title.toLowerCase() === rec.title.toLowerCase())
        if (movie) {
          return {
            ...movie,
            recommendationReason: rec.reason,
          }
        }
        return null
      })
      .filter(Boolean) as (MovieData & { recommendationReason: string })[]

    return recommendedMovies
  } catch (error) {
    console.error("Error getting movie recommendations:", error)
    return []
  }
}
