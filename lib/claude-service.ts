/**
 * Claude AI Service
 *
 * This service handles interactions with the Anthropic Claude API for AI-powered movie recommendations
 * and other natural language processing tasks.
 */

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

// Types for movie recommendations
export interface MovieRecommendation {
  title: string
  description: string
  releaseYear: string
  genres: string[]
  rating?: number
  reason: string
  posterUrl?: string
}

/**
 * Get personalized movie recommendations based on user preferences
 * @param preferences - User's movie preferences as a string
 * @param count - Number of recommendations to return (default: 3)
 * @returns Array of movie recommendations
 */
export async function getPersonalizedRecommendations(preferences: string, count = 3): Promise<MovieRecommendation[]> {
  try {
    // Create a prompt for Claude
    const prompt = `
You are a highly knowledgeable film expert and recommendation system. 
Based on the following user preferences, recommend ${count} movies that they would enjoy.

User preferences: "${preferences}"

For each movie, provide:
1. Title
2. A brief description (1-2 sentences)
3. Release year
4. Genres (as an array)
5. Rating out of 10
6. A personalized reason why this movie matches their preferences

Format your response as a valid JSON array with objects containing these fields: title, description, releaseYear, genres, rating, reason.
Only return the JSON array, nothing else.
`

    // Call Claude API
    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.7,
      maxTokens: 2048,
    })

    // Parse the response
    const responseContent = text || "[]"
    let recommendations = []

    try {
      // Try to parse the JSON response
      recommendations = JSON.parse(responseContent)

      // If it's not an array, check if it's wrapped in an object
      if (!Array.isArray(recommendations)) {
        if (recommendations.recommendations && Array.isArray(recommendations.recommendations)) {
          recommendations = recommendations.recommendations
        } else {
          // If we can't find an array, return mock data
          return getMockRecommendations(preferences, count)
        }
      }
    } catch (parseError) {
      console.error("Error parsing Claude response:", parseError)
      return getMockRecommendations(preferences, count)
    }

    // Add poster URLs (in a real app, you would fetch these from a movie database API)
    const recommendationsWithPosters = recommendations.map((rec: MovieRecommendation) => {
      // Map of some popular movies to poster URLs
      const posterMap: Record<string, string> = {
        Inception: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        Interstellar:
          "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        "The Dark Knight":
          "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        Parasite:
          "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        "Everything Everywhere All at Once":
          "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
        "The Godfather":
          "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        "Pulp Fiction":
          "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        "The Shawshank Redemption":
          "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
      }

      // Try to find a matching poster or use a placeholder
      const posterUrl =
        posterMap[rec.title] || `https://placehold.co/300x450/222222/ffffff?text=${encodeURIComponent(rec.title)}`

      return {
        ...rec,
        posterUrl,
      }
    })

    return recommendationsWithPosters
  } catch (error) {
    console.error("Error getting recommendations from Claude:", error)
    return getMockRecommendations(preferences, count)
  }
}

/**
 * Analyze a movie and provide insights
 * @param movieTitle - Title of the movie to analyze
 * @returns Analysis of the movie
 */
export async function analyzeMovie(movieTitle: string): Promise<string> {
  try {
    const prompt = `
Provide a thoughtful analysis of the movie "${movieTitle}". Include:
1. Its cultural significance
2. Notable filmmaking techniques
3. Performances
4. Themes and messages

Keep your analysis concise but insightful, around 150-200 words.
`

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return text || getMockMovieAnalysis(movieTitle)
  } catch (error) {
    console.error("Error analyzing movie with Claude:", error)
    return getMockMovieAnalysis(movieTitle)
  }
}

/**
 * Generate movie discussion questions
 * @param movieTitle - Title of the movie
 * @param count - Number of questions to generate (default: 5)
 * @returns Array of discussion questions
 */
export async function generateDiscussionQuestions(movieTitle: string, count = 5): Promise<string[]> {
  try {
    const prompt = `
Generate ${count} thought-provoking discussion questions for a film club discussing "${movieTitle}".
The questions should encourage deep analysis and different perspectives.
Format your response as a JSON array of strings, with each string being a question.
Only return the JSON array, nothing else.
`

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.8,
      maxTokens: 1024,
    })

    try {
      const questions = JSON.parse(text)
      if (Array.isArray(questions)) {
        return questions.slice(0, count)
      }
      return getMockDiscussionQuestions(movieTitle, count)
    } catch (parseError) {
      console.error("Error parsing discussion questions:", parseError)
      return getMockDiscussionQuestions(movieTitle, count)
    }
  } catch (error) {
    console.error("Error generating discussion questions with Claude:", error)
    return getMockDiscussionQuestions(movieTitle, count)
  }
}

// Mock data functions for when Claude API is not available
function getMockRecommendations(preferences: string, count: number): MovieRecommendation[] {
  const mockRecommendations: MovieRecommendation[] = [
    {
      title: "Inception",
      description:
        "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.",
      releaseYear: "2010",
      genres: ["Action", "Adventure", "Sci-Fi"],
      rating: 8.8,
      reason:
        "This mind-bending thriller combines complex storytelling with stunning visuals, perfect for viewers who enjoy thought-provoking narratives.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    },
    {
      title: "The Dark Knight",
      description:
        "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      releaseYear: "2008",
      genres: ["Action", "Crime", "Drama"],
      rating: 9.0,
      reason:
        "Christopher Nolan's masterpiece combines intense action with deep character studies and moral complexity.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    },
    {
      title: "Parasite",
      description:
        "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      releaseYear: "2019",
      genres: ["Drama", "Thriller"],
      rating: 8.5,
      reason: "This Oscar-winning film brilliantly combines social commentary with suspense and dark humor.",
      posterUrl:
        "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    },
    {
      title: "Everything Everywhere All at Once",
      description:
        "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
      releaseYear: "2022",
      genres: ["Action", "Adventure", "Comedy"],
      rating: 8.0,
      reason: "This mind-bending multiverse adventure combines heart, humor, and stunning visuals in an original way.",
      posterUrl:
        "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
    },
  ]

  // Return a subset based on the requested count
  return mockRecommendations.slice(0, count)
}

function getMockMovieAnalysis(movieTitle: string): string {
  const analyses: Record<string, string> = {
    Inception:
      "Inception stands as a landmark in modern cinema, blending mind-bending concepts with spectacular visuals. Christopher Nolan's direction creates a labyrinthine narrative that explores the nature of reality and dreams. Leonardo DiCaprio delivers a nuanced performance as a man haunted by his past, while the supporting cast adds depth to the complex storyline. The film's innovative use of practical effects and Hans Zimmer's iconic score enhance its immersive quality. Thematically, Inception explores guilt, redemption, and the power of ideas, questioning how our perceptions shape our reality. Its ambiguous ending continues to spark debate among viewers, cementing its cultural significance as a film that rewards multiple viewings and interpretations.",
    "The Dark Knight":
      "The Dark Knight transcended the superhero genre to become a defining crime thriller of its era. Christopher Nolan's gritty direction brought a new level of realism and moral complexity to comic book adaptations. Heath Ledger's posthumous Oscar-winning performance as the Joker remains one of cinema's most chilling and captivating villains. The film's practical effects and IMAX cinematography created a visceral experience that influenced countless films that followed. Thematically, it explores the thin line between heroism and vigilantism, the nature of chaos versus order, and the sacrifices required to maintain social good. Its cultural impact extended beyond cinema, sparking discussions about surveillance ethics, terrorism, and the nature of heroism in the modern world.",
    default: `${movieTitle} represents a significant contribution to cinema, combining innovative filmmaking techniques with powerful performances. The director's unique vision is evident in the film's distinctive visual style and narrative approach. The cast delivers compelling performances that bring depth and authenticity to their characters. Thematically, the film explores universal concepts while offering fresh perspectives that resonate with contemporary audiences. Its cultural impact extends beyond entertainment, sparking meaningful conversations about important social and philosophical questions. The film's technical achievements in cinematography, sound design, and visual effects further enhance its storytelling power, creating an immersive experience that continues to influence filmmakers and captivate viewers.`,
  }

  return analyses[movieTitle] || analyses["default"]
}

function getMockDiscussionQuestions(movieTitle: string, count: number): string[] {
  const genericQuestions = [
    `How does ${movieTitle} reflect or challenge societal norms of its time?`,
    `What visual motifs or symbols did you notice throughout ${movieTitle}, and what might they represent?`,
    `How do the characters in ${movieTitle} evolve throughout the story, and what drives their transformation?`,
    `What themes in ${movieTitle} remain relevant today, and why?`,
    `How does the music and sound design in ${movieTitle} enhance the storytelling?`,
    `What moral or ethical dilemmas does ${movieTitle} present, and how are they resolved?`,
    `How does the film's ending affect your interpretation of the overall story?`,
    `What cinematic techniques used in ${movieTitle} were most effective in conveying its message?`,
    `How does ${movieTitle} compare to other films in the same genre or by the same director?`,
    `If you could change one aspect of ${movieTitle}, what would it be and why?`,
  ]

  // Return a subset based on the requested count
  return genericQuestions.slice(0, count)
}
