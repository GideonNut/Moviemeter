/**
 * Blockchain Service
 *
 * This service handles all interactions with the Celo blockchain through the Thirdweb SDK.
 * It provides a clean separation between UI components and blockchain logic.
 */

import { getContract, defineChain, prepareContractCall, readContract } from "thirdweb"
import { client } from "@/app/client"
import { safeParseInt } from "./bigint-utils"

// Define Celo mainnet with proper configuration
export const celo = defineChain({
  id: 42220,
  name: "Celo",
  rpc: "https://forno.celo.org",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  // Add explorer URL for better debugging
  explorers: [
    {
      name: "Celo Explorer",
      url: "https://explorer.celo.org",
      standard: "EIP3091"
    },
  ],
})

// Contract address with proper typing
export const CONTRACT_ADDRESS: string = "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828"

// Contract ABI
export const CONTRACT_ABI = [
  {
    inputs: [
      { name: "movieId", type: "uint256" },
      { name: "vote", type: "bool" }
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "movieId", type: "uint256" }],
    name: "getVotes",
    outputs: [
      { name: "yes", type: "uint256" },
      { name: "no", type: "uint256" },
      { name: "voters", type: "address[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const

// Get contract instance with proper configuration
export const getMovieMeterContract = () => {
  return getContract({
    client,
    chain: celo,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
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
    const votes = await readContract({
      contract,
      method: "getVotes",
      params: [BigInt(movieId)],
    })
    
    // The votes are returned as a tuple [yes, no, voters]
    return votes
      ? {
          yes: safeParseInt(votes[0]),
          no: safeParseInt(votes[1]),
          voters: votes[2] || [],
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
  const safeMovieId = typeof movieId === "string" ? BigInt(movieId) : BigInt(movieId)

  // Prepare the transaction with proper gas optimization
  return prepareContractCall({
    contract,
    method: "vote",
    params: [safeMovieId, voteType],
    gas: BigInt(300000),
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
