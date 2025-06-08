/**
 * Blockchain Service
 *
 * This service handles all interactions with the Celo mainnet through the Thirdweb SDK.
 * It provides a clean separation between UI components and blockchain logic.
 */

import { getContract, defineChain, prepareContractCall } from "thirdweb"
import { client } from "@/lib/client"

// Define Celo mainnet with proper configuration
export const celoMainnet = defineChain({
  id: 42220,
  name: "Celo Mainnet",
  rpc: "https://forno.celo.org",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  // Add explorer URL for better debugging
  explorers: [
    {
      name: "Celo Explorer",
      url: "https://explorer.celo.org",
    },
  ],
})

// Contract address on Celo mainnet
export const CONTRACT_ADDRESS: string = "0x6d83eF793A7e82BFa20B57a60907F85c06fB8828"

// Get contract instance with proper configuration
export const getMovieMeterContract = () => {
  return getContract({
    client,
    chain: celoMainnet,
    address: CONTRACT_ADDRESS,
  })
}

// Add Divvi configuration
const DIVVI_CONSUMER = '0xc49b8e093600f684b69ed6ba1e36b7dfad42f982' // Replace with your Divvi identifier
const DIVVI_PROVIDERS: string[] = [] // Add your provider addresses here

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
 * Vote for a movie with Divvi referral tracking
 * @param movieId - The ID of the movie to vote for
 * @param voteType - True for yes, false for no
 * @returns Prepared transaction for the vote
 */
export function prepareVoteTransaction(movieId: string | number, voteType: boolean) {
  const contract = getMovieMeterContract()

  // Get the base transaction data
  const baseTransaction = prepareContractCall({
    contract,
    method: "function vote(uint256, bool)",
    params: [BigInt(movieId), voteType],
    gas: 300000n,
  })

  // Add Divvi referral data if available
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Dynamically import the Divvi SDK
      const { getDataSuffix } = require('@divvi/referral-sdk')
      const dataSuffix = getDataSuffix({
        consumer: DIVVI_CONSUMER,
        providers: DIVVI_PROVIDERS,
      })
      
      // Append the data suffix to the transaction data
      return {
        ...baseTransaction,
        data: baseTransaction.data + dataSuffix,
      }
    } catch (error) {
      console.warn('Divvi referral SDK not available, proceeding with base transaction')
      return baseTransaction
    }
  }

  return baseTransaction
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
