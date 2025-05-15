/**
 * Divvi Referral Service
 *
 * This service handles integration with Divvi's referral system,
 * allowing MovieMeter to earn rewards for driving on-chain activity.
 */

import { getDataSuffix, submitReferral } from "@divvi/referral-sdk"

// Divvi configuration
const DIVVI_CONSUMER = "0xc49B8e093600f684b69ed6Ba1E36b7dFaD42F982"
const DIVVI_PROVIDERS = [
  "0x5f0a55FaD9424ac99429f635dfb9bF20c3360Ab8",
  "0xB06a1b291863f923E7417E9F302e2a84018c33C5",
  "0x6226ddE08402642964f9A6de844ea3116F0dFc7e",
]

/**
 * Generate Divvi referral data suffix
 * @returns The data suffix to append to transaction data
 */
export function getDivviDataSuffix(): string {
  return getDataSuffix({
    consumer: DIVVI_CONSUMER,
    providers: DIVVI_PROVIDERS,
  })
}

/**
 * Submit a transaction to Divvi for referral tracking
 * @param txHash The transaction hash
 * @param chainId The chain ID where the transaction was sent
 * @returns Promise that resolves when the referral is submitted
 */
export async function submitDivviReferral(txHash: string, chainId: number): Promise<void> {
  try {
    await submitReferral({
      txHash,
      chainId,
    })
    console.log(`Divvi referral submitted for tx: ${txHash} on chain: ${chainId}`)
    return Promise.resolve()
  } catch (error) {
    console.error("Error submitting Divvi referral:", error)
    return Promise.reject(error)
  }
}

/**
 * Track a user's first interaction with the app
 * This should be called when a user performs their first on-chain action
 * @param address The user's wallet address
 * @param txHash The transaction hash
 * @param chainId The chain ID
 */
export async function trackFirstUserInteraction(address: string, txHash: string, chainId: number): Promise<void> {
  try {
    // Store that we've tracked this user to avoid duplicate submissions
    localStorage.setItem(`divvi_tracked_${address.toLowerCase()}`, "true")

    // Submit the referral to Divvi
    await submitDivviReferral(txHash, chainId)
  } catch (error) {
    console.error("Error tracking first user interaction:", error)
  }
}

/**
 * Check if a user has been tracked by Divvi
 * @param address The user's wallet address
 * @returns Boolean indicating if the user has been tracked
 */
export function hasUserBeenTracked(address: string): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(`divvi_tracked_${address.toLowerCase()}`) === "true"
}
