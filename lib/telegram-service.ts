/**
 * Telegram Service
 *
 * This service handles interactions with the Telegram API to fetch updates
 * from the Movies Society channel (t.me/movies_society) using the GIDEON_DERNBOT.
 */

import axios from "axios"

// Telegram channel and bot information
const TELEGRAM_CHANNEL = "movies_society"
const TELEGRAM_BOT_USERNAME = "GIDEON_DERNBOT"
const TELEGRAM_API_BASE = "https://api.telegram.org"

// Types for Telegram API responses
interface TelegramMessage {
  message_id: number
  date: number
  text: string
  entities?: {
    type: string
    offset: number
    length: number
  }[]
  photo?: {
    file_id: string
    file_unique_id: string
    width: number
    height: number
    file_size: number
  }[]
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  channel_post?: TelegramMessage
}

interface TelegramResponse {
  ok: boolean
  result: TelegramUpdate[]
}

export interface MovieRecommendation {
  id: string
  title: string
  description: string
  imageUrl?: string
  source: "telegram"
  sourceUrl: string
  postedDate: Date
}

/**
 * Fetch recent movie recommendations from the Telegram channel
 * @param limit - Maximum number of recommendations to fetch
 * @returns Array of movie recommendations
 */
export async function fetchTelegramRecommendations(limit = 10): Promise<MovieRecommendation[]> {
  try {
    // In a real implementation, you would use the Telegram Bot API with your bot token
    // For this example, we'll use a mock implementation since we can't access your bot token here

    // Mock data based on typical Telegram channel content
    const mockRecommendations: MovieRecommendation[] = [
      {
        id: "tg-1",
        title: "Dune: Part Two",
        description:
          "Just watched Dune: Part Two and it's absolutely mind-blowing! Denis Villeneuve has outdone himself with this epic sci-fi masterpiece. The visuals, sound design, and performances are all top-notch. Highly recommended for any sci-fi fan! #DunePartTwo #SciFi",
        imageUrl:
          "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjhkZWY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        source: "telegram",
        sourceUrl: "https://t.me/movies_society",
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: "tg-2",
        title: "Poor Things",
        description:
          "Poor Things is a bizarre but brilliant film that defies categorization. Emma Stone delivers a career-best performance in this strange, beautiful, and thought-provoking movie. Yorgos Lanthimos continues to push boundaries with his unique vision. #PoorThings #EmmaStone",
        imageUrl:
          "https://m.media-amazon.com/images/M/MV5BNGIyYWMzNjktNDE3MC00YWQyLWEyMmEtN2ZmNzZhZDk3NGJlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
        source: "telegram",
        sourceUrl: "https://t.me/movies_society",
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: "tg-3",
        title: "Oppenheimer",
        description:
          "Oppenheimer is Christopher Nolan at his finest. This historical drama about the father of the atomic bomb is a masterclass in filmmaking. Cillian Murphy's performance is haunting and the technical aspects are flawless. A must-watch for history buffs and film enthusiasts alike. #Oppenheimer #ChristopherNolan",
        imageUrl:
          "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
        source: "telegram",
        sourceUrl: "https://t.me/movies_society",
        postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        id: "tg-4",
        title: "The Holdovers",
        description:
          "The Holdovers is a heartwarming gem that deserves more attention. Set in a boarding school during Christmas break, it features outstanding performances from Paul Giamatti and Da'Vine Joy Randolph. Alexander Payne's direction is subtle yet powerful. Perfect for those who enjoy character-driven stories. #TheHoldovers #PaulGiamatti",
        imageUrl:
          "https://m.media-amazon.com/images/M/MV5BNDc2MzNkMjMtZDY5NC00NmQ0LWI1NjctZjRhNWIzZjc4MGRiXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg",
        source: "telegram",
        sourceUrl: "https://t.me/movies_society",
        postedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        id: "tg-5",
        title: "Past Lives",
        description:
          "Past Lives is a beautiful, subtle exploration of love, fate, and cultural identity. Celine Song's directorial debut is remarkably assured, with nuanced performances and gorgeous cinematography. It's a quiet film that leaves a lasting impact. Highly recommended for fans of thoughtful, character-driven dramas. #PastLives #CelineSong",
        imageUrl:
          "https://m.media-amazon.com/images/M/MV5BOTkzYmMxNTItZDAxNC00NGM0LWIyODMtMWYzMzRkMjIyMTE1XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg",
        source: "telegram",
        sourceUrl: "https://t.me/movies_society",
        postedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      },
    ]

    // Return limited number of recommendations
    return mockRecommendations.slice(0, limit)
  } catch (error) {
    console.error("Error fetching Telegram recommendations:", error)
    return []
  }
}

/**
 * Implementation using your existing GIDEON_DERNBOT
 * This requires your bot token to be set as an environment variable TELEGRAM_BOT_TOKEN
 */
export async function fetchTelegramRecommendationsWithBot(limit = 10): Promise<MovieRecommendation[]> {
  try {
    // Get the bot token from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set")
    }

    // Fetch updates from the Telegram API
    const response = await axios.get<TelegramResponse>(`${TELEGRAM_API_BASE}/bot${botToken}/getUpdates?limit=${limit}`)

    if (!response.data.ok) {
      throw new Error("Failed to fetch updates from Telegram API")
    }

    // Process the messages to extract movie recommendations
    const recommendations: MovieRecommendation[] = response.data.result
      .filter((update) => {
        // Filter for channel posts or messages that contain movie-related content
        const post = update.channel_post || update.message
        if (!post?.text) return false

        // Check if the message contains movie-related hashtags or keywords
        return (
          post.text.includes("#movie") ||
          post.text.includes("#recommendation") ||
          post.text.includes("#review") ||
          post.text.toLowerCase().includes("movie") ||
          post.text.toLowerCase().includes("film") ||
          post.text.toLowerCase().includes("watch")
        )
      })
      .map((update) => {
        const post = update.channel_post || update.message!

        // Try to extract title from hashtags or first line
        let title = "Unknown Movie"
        let description = post.text

        // Look for title in first line or hashtags
        const lines = post.text.split("\n")
        if (lines.length > 0) {
          title = lines[0].trim()
          description = lines.slice(1).join("\n").trim()
        }

        // Extract hashtags for better title detection
        const hashtags: string[] = []
        if (post.entities) {
          post.entities.forEach((entity) => {
            if (entity.type === "hashtag") {
              const hashtag = post.text.substring(entity.offset + 1, entity.offset + entity.length)
              hashtags.push(hashtag)
            }
          })
        }

        // Try to get a better title from hashtags
        if (hashtags.length > 0) {
          // Look for movie title hashtags (usually CamelCase or with "movie" in them)
          const movieHashtags = hashtags.filter(
            (tag) => tag.includes("Movie") || tag.includes("Film") || /[A-Z]/.test(tag.substring(1)), // Has uppercase letters after first char
          )

          if (movieHashtags.length > 0) {
            // Use the first movie hashtag as title
            title = movieHashtags[0]
              .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
              .replace(/^[a-z]/, (match) => match.toUpperCase()) // Capitalize first letter
              .trim()
          }
        }

        // Get image if available
        let imageUrl: string | undefined
        if (post.photo && post.photo.length > 0) {
          // Get the largest photo
          const photo = post.photo.reduce((largest, current) =>
            current.width * current.height > largest.width * largest.height ? current : largest,
          )

          // In a real implementation, you would need to get the file path
          // using getFile API and then construct the URL
          imageUrl = `${TELEGRAM_API_BASE}/file/bot${botToken}/${photo.file_id}`
        }

        return {
          id: `tg-${update.update_id}`,
          title,
          description,
          imageUrl,
          source: "telegram",
          sourceUrl: `https://t.me/${TELEGRAM_CHANNEL}/${post.message_id}`,
          postedDate: new Date(post.date * 1000),
        }
      })

    return recommendations.slice(0, limit)
  } catch (error) {
    console.error("Error fetching Telegram recommendations with bot:", error)
    return []
  }
}

/**
 * Function to send a message to the Telegram channel using the bot
 * This can be used to notify the channel about new votes or activity on MovieMeter
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set")
    }

    // Send message to the channel
    const response = await axios.post(`${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`, {
      chat_id: `@${TELEGRAM_CHANNEL}`,
      text: message,
      parse_mode: "HTML", // Allows for basic formatting
    })

    return response.data.ok
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    return false
  }
}

/**
 * Function to send a movie recommendation to the Telegram channel
 * This can be used when users want to share their votes or recommendations
 */
export async function shareMovieToTelegram(
  movieTitle: string,
  description: string,
  imageUrl?: string,
  userVote?: "yes" | "no",
): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set")
    }

    // Create message text with HTML formatting
    const messageText = `
<b>🎬 ${movieTitle}</b>

${description}

${userVote ? `<b>User Vote:</b> ${userVote === "yes" ? "👍 Yes" : "👎 No"}` : ""}

<i>Shared from MovieMeter</i>
#${movieTitle.replace(/\s+/g, "")} #MovieRecommendation
    `.trim()

    // If there's an image, send a photo with caption
    if (imageUrl) {
      const response = await axios.post(`${TELEGRAM_API_BASE}/bot${botToken}/sendPhoto`, {
        chat_id: `@${TELEGRAM_CHANNEL}`,
        photo: imageUrl,
        caption: messageText,
        parse_mode: "HTML",
      })

      return response.data.ok
    } else {
      // Otherwise just send a text message
      const response = await axios.post(`${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`, {
        chat_id: `@${TELEGRAM_CHANNEL}`,
        text: messageText,
        parse_mode: "HTML",
      })

      return response.data.ok
    }
  } catch (error) {
    console.error("Error sharing movie to Telegram:", error)
    return false
  }
}
