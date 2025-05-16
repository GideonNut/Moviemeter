import { getContract, defineChain } from "thirdweb"
import { client } from "@/app/client"

// Define Celo mainnet
const celoMainnet = defineChain({
  id: 42220,
  rpc: "https://forno.celo.org",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  shortName: "celo",
  name: "Celo Mainnet",
  chain: "CELO",
  testnet: false,
})

// Contract address on Celo mainnet
const contractAddress = "0x3eD5D4A503999C5aEB13CD71Eb1d395043368723"

// Get contract instance
export const getMovieContract = () => {
  return getContract({
    client,
    chain: celoMainnet,
    address: contractAddress,
  })
}

// Upvote a movie
export const upvoteMovie = async (movieId: number, walletAddress: string) => {
  try {
    const contract = getMovieContract()

    // Call the vote function on the contract
    const transaction = await contract.call("vote", [BigInt(movieId), true])

    return {
      success: true,
      transaction,
    }
  } catch (error) {
    console.error("Error upvoting movie:", error)
    return {
      success: false,
      error: "Failed to upvote movie",
    }
  }
}

// Downvote a movie
export const downvoteMovie = async (movieId: number, walletAddress: string) => {
  try {
    const contract = getMovieContract()

    // Call the vote function on the contract
    const transaction = await contract.call("vote", [BigInt(movieId), false])

    return {
      success: true,
      transaction,
    }
  } catch (error) {
    console.error("Error downvoting movie:", error)
    return {
      success: false,
      error: "Failed to downvote movie",
    }
  }
}

// Get votes for a movie
export const getMovieVotes = async (movieId: number) => {
  try {
    const contract = getMovieContract()

    // Call the getVotes function on the contract
    const votes = await contract.call("getVotes", [BigInt(movieId)])

    return {
      success: true,
      votes: Number(votes.yes) - Number(votes.no),
    }
  } catch (error) {
    console.error("Error getting votes for movie:", error)
    return {
      success: false,
      error: "Failed to get votes for movie",
    }
  }
}
