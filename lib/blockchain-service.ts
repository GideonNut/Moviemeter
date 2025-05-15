/**
 * Blockchain Service
 *
 * This service handles all interactions with the Celo blockchain through the Thirdweb SDK.
 * It provides a clean separation between UI components and blockchain logic.
 */

import { safeParseInt } from "./bigint-utils"
import { celoAlfajores } from "wagmi/chains";

// Contract address with proper typing
export const CONTRACT_ADDRESS: string = "0x3eD5D4A503999C5aEB13CD71Eb1d395043368723"

// Get contract instance with proper configuration
export const getMovieMeterContract = () => {
  return getContract({
    client,
    chain: celoAlfajores,
    address: CONTRACT_ADDRESS,
  })
}

/**
 * Get votes for a specific movie
 * @param movieId - The ID of the movie to get votes for
 * @returns Promise with vote data or null if error
 */
export async function getMovieVotes(movieId: string) {
  try {
    const contract = getMovieMeterContract()
    const votes = await contract.read("getVotes", [movieId])

    // Safely convert BigInt values to regular numbers or strings
    return votes
      ? {
        yes: safeParseInt(votes.yes),
        no: safeParseInt(votes.no),
        voters: votes.voters || [],
      }
      : null
  } catch (error) {
    console.error(`Error getting votes for movie ${movieId}:`, error)
    return null
  }
}

/**
 * Vote for a movie
 * @param movieId - The ID of the movie to vote for
 * @param voteType - True for yes, false for no
 * @returns Prepared transaction for the vote
 */
export function prepareVoteTransaction(movieId: string | number, voteType: boolean) {
  const contract = getMovieMeterContract()

  // Convert movieId to a safe value
  const safeMovieId = typeof movieId === "string" ? Number.parseInt(movieId, 10) : movieId

  // Prepare the transaction with proper gas optimization
  return prepareContractCall({
    contract,
    functionName: "function vote(uint256, bool)",
    args: [safeMovieId, voteType],
    // Add gas limit to prevent unexpected costs
    gas: 300000n,
  })
}

/**
 * Check if a user has voted for a specific movie
 * @param movieId - The ID of the movie to check
 * @param address - The user's wallet address
 * @returns Promise<boolean> - True if the user has voted, false otherwise
 */
export async function hasUserVotedForMovie(movieId: string, address: string): Promise<boolean> {
  try {
    const votes = await getMovieVotes(movieId)
    return votes?.voters.includes(address) || false
  } catch (error) {
    console.error(`Error checking if user ${address} voted for movie ${movieId}:`, error)
    return false
  }
}

/**
 * Refresh vote data for all movies
 * @param movieIds - Array of movie IDs to refresh
 * @param address - User's wallet address
 * @returns Promise with vote data for all movies
 */
export async function refreshAllVotes(movieIds: number[], address: string) {
  try {
    const votesData = await Promise.all(
      movieIds.map(async (id) => {
        try {
          const voteData = await getMovieVotes(id.toString())
          return {
            id,
            voteCountYes: voteData ? Number(voteData.yes) : 0,
            voteCountNo: voteData ? Number(voteData.no) : 0,
            hasVoted: voteData ? voteData.voters.includes(address) : false,
          }
        } catch (err) {
          console.error(`Error loading votes for movie ${id}:`, err)
          return {
            id,
            voteCountYes: 0,
            voteCountNo: 0,
            hasVoted: false,
          }
        }
      }),
    )
    return votesData
  } catch (error) {
    console.error("Error refreshing all votes:", error)
    return []
  }
}
