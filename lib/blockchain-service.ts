/**
 * Blockchain Service
 *
 * This service handles all interactions with the Celo blockchain through the Thirdweb SDK.
 * It provides a clean separation between UI components and blockchain logic.
 */

import { getContract, defineChain, prepareContractCall } from "thirdweb"
import { client } from "@/app/client"

// Define Celo Alfajores testnet with proper configuration
export const alfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores",
  rpc: "https://alfajores-forno.celo-testnet.org",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  // Add explorer URL for better debugging
  explorers: [
    {
      name: "Celo Explorer",
      url: "https://explorer.celo.org/alfajores",
    },
  ],
})

// Contract address with proper typing
export const CONTRACT_ADDRESS: string = "0x3eD5D4A503999C5aEB13CD71Eb1d395043368723"

// Get contract instance with proper configuration
export const getMovieMeterContract = () => {
  return getContract({
    client,
    chain: alfajores,
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
    return votes
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

  // Prepare the transaction with proper gas optimization
  return prepareContractCall({
    contract,
    method: "function vote(uint256, bool)",
    params: [BigInt(movieId), voteType],
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

