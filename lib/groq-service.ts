/**
 * Groq AI Service
 *
 * This service handles interactions with the Groq API for AI-powered movie recommendations
 * and other natural language processing tasks.
 */

import { Groq } from "groq-sdk"

// Initialize the Groq client with API key from environment variables
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// })

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
// export async function getPersonalizedRecommendations(preferences: string, count = 3): Promise<MovieRecommendation[]> {
//   try {
//     // Create a prompt for the Groq model
//     const prompt = `
// You are a highly knowledgeable film expert and recommendation system. 
// Based on the following user preferences, recommend ${count} movies that they would enjoy.

// User preferences: "${preferences}"

// For each movie, provide:
// 1. Title
// 2. A brief description (1-2 sentences)
// 3. Release year
// 4. Genres (as an array)
// 5. Rating out of 10
// 6. A personalized reason why this movie matches their preferences

// Format your response as a valid JSON array with objects containing these fields: title, description, releaseYear, genres, rating, reason.
// Only return the JSON array, nothing else.
// `

//     // Call the Groq API
//     // const completion = await groq.chat.completions.create({
//     //   messages: [
//     //     {
//     //       role: "system",
//     //       content: "You are a movie recommendation expert that only responds with valid JSON.",
//     //     },
//     //     {
//     //       role: "user",
//     //       content: prompt,
//     //     },
//     //   ],
//     //   model: "llama3-70b-8192",
//     //   temperature: 0.7,
//     //   max_tokens: 2048,
//     //   response_format: { type: "json_object" },
//     // })

//     // Parse the response
//     // const responseContent = completion.choices[0]?.message?.content || "{}"
//     // const parsedResponse = JSON.parse(responseContent)

//     // Extract the recommendations array
//     // const recommendations = parsedResponse.recommendations || []

//     // Add poster URLs (in a real app, you would fetch these from a movie database API)
//     // const recommendationsWithPosters = recommendations.map((rec: MovieRecommendation) => {
//     // Map of some popular movies to poster URLs
//     const posterMap: Record<string, string> = {
//       Inception: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
//       Interstellar:
//         "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
//       "The Dark Knight":
//         "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
//       Parasite:
//         "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
//       "Everything Everywhere All at Once":
//         "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
//       "The Godfather":
//         "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
//       "Pulp Fiction":
//         "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
//       "The Shawshank Redemption":
//         "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
//     }

//     // Try to find a matching poster or use a placeholder
//     const posterUrl =
//       posterMap[rec.title] || `https://placehold.co/300x450/222222/ffffff?text=${encodeURIComponent(rec.title)}`

//     return {
//       ...rec,
//       posterUrl,
//     }
//   })

//   return recommendationsWithPosters
// } catch (error) {
//   console.error("Error getting recommendations from Groq:", error)
//   throw new Error("Failed to get movie recommendations")
// }
// }

/**
 * Analyze a movie and provide insights
 * @param movieTitle - Title of the movie to analyze
 * @returns Analysis of the movie
 */
// export async function analyzeMovie(movieTitle: string): Promise<string> {
//   try {
//     const prompt = `
// Provide a thoughtful analysis of the movie "${movieTitle}". Include:
// 1. Its cultural significance
// 2. Notable filmmaking techniques
// 3. Performances
// 4. Themes and messages

// Keep your analysis concise but insightful, around 150-200 words.
// `

//     const completion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: "You are a film critic and analyst with deep knowledge of cinema.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       model: "llama3-70b-8192",
//       temperature: 0.7,
//       max_tokens: 500,
//     })

//     return completion.choices[0]?.message?.content || ""
//   } catch (error) {
//     console.error("Error analyzing movie with Groq:", error)
//     throw new Error("Failed to analyze movie")
//   }
// }

/**
 * Generate movie discussion questions
 * @param movieTitle - Title of the movie
 * @param count - Number of questions to generate (default: 5)
 * @returns Array of discussion questions
 */
// export async function generateDiscussionQuestions(movieTitle: string, count = 5): Promise<string[]> {
//   try {
//     const prompt = `
// Generate ${count} thought-provoking discussion questions for a film club discussing "${movieTitle}".
// The questions should encourage deep analysis and different perspectives.
// Format your response as a JSON array of strings, with each string being a question.
// Only return the JSON array, nothing else.
// `

//     const completion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: "You are a film studies professor who creates engaging discussion questions.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       model: "llama3-70b-8192",
//       temperature: 0.8,
//       max_tokens: 1024,
//       response_format: { type: "json_object" },
//     })

//     const responseContent = completion.choices[0]?.message?.content || "{}"
//     const parsedResponse = JSON.parse(responseContent)

//     return parsedResponse.questions || []
//   } catch (error) {
//     console.error("Error generating discussion questions with Groq:", error)
//     throw new Error("Failed to generate discussion questions")
//   }
// }
