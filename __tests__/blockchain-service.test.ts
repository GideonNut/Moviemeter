/**
 * Blockchain Service Tests
 *
 * Tests for the blockchain service functions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { getMovieVotes, hasUserVotedForMovie, prepareVoteTransaction } from "@/lib/blockchain-service"

// Mock the thirdweb imports
vi.mock("thirdweb", () => ({
  getContract: vi.fn(() => ({
    read: vi.fn(async (method, params) => {
      if (method === "getVotes") {
        const movieId = params[0]
        // Mock data for testing
        if (movieId === "1") {
          return {
            yes: 10n,
            no: 5n,
            voters: ["0x123", "0x456"],
          }
        }
        return {
          yes: 0n,
          no: 0n,
          voters: [],
        }
      }
      return null
    }),
  })),
  defineChain: vi.fn((config) => config),
  prepareContractCall: vi.fn((config) => ({
    contract: config.contract,
    method: config.method,
    params: config.params,
    gas: config.gas,
  })),
}))

// Mock the client import
vi.mock("@/app/client", () => ({
  client: {},
}))

describe("Blockchain Service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getMovieVotes", () => {
    it("should return vote data for a movie", async () => {
      const votes = await getMovieVotes("1")
      expect(votes).toEqual({
        yes: 10n,
        no: 5n,
        voters: ["0x123", "0x456"],
      })
    })

    it("should return empty vote data for a movie with no votes", async () => {
      const votes = await getMovieVotes("2")
      expect(votes).toEqual({
        yes: 0n,
        no: 0n,
        voters: [],
      })
    })
  })

  describe("hasUserVotedForMovie", () => {
    it("should return true if user has voted for the movie", async () => {
      const hasVoted = await hasUserVotedForMovie("1", "0x123")
      expect(hasVoted).toBe(true)
    })

    it("should return false if user has not voted for the movie", async () => {
      const hasVoted = await hasUserVotedForMovie("1", "0x789")
      expect(hasVoted).toBe(false)
    })
  })

  describe("prepareVoteTransaction", () => {
    it("should prepare a vote transaction correctly", () => {
      const transaction = prepareVoteTransaction("1", true)
      expect(transaction).toMatchObject({
        method: "function vote(uint256, bool)",
        params: [1n, true],
        gas: 300000n,
      })
    })
  })
})

