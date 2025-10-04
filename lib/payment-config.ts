/**
 * Payment Configuration for AI Recommendations
 * 
 * This file contains the configuration for the payment system used for AI movie recommendations.
 * It defines the payment amount, contract details, and related settings.
 */

import { defineChain } from "thirdweb"

// Payment amount in CELO (50 CELO = 50 * 10^18 wei)
export const PAYMENT_AMOUNT_CELO = 50
export const PAYMENT_AMOUNT_WEI = "50000000000000000000" // 50 CELO in wei

// Payment description for UI
export const PAYMENT_DESCRIPTION = "AI Movie Recommendations Access"

// Payment recipient configuration
export const PAYMENT_RECIPIENT_ADDRESS = "0xD2651cd396DFBfab5EB04788C176BB5fE9018E44" // Direct payment recipient

// Note: Using direct transfer to recipient instead of contract call
// This ensures payments go directly to the specified address

// Feature descriptions for the paywall
export const PAYWALL_FEATURES = [
  {
    icon: "Sparkles",
    title: "AI-powered movie analysis",
    description: "Advanced AI analyzes your preferences and movie data"
  },
  {
    icon: "Sparkles", 
    title: "Personalized recommendations",
    description: "Get recommendations tailored specifically to your taste"
  },
  {
    icon: "Sparkles",
    title: "Detailed reasoning",
    description: "Understand why each movie is recommended for you"
  }
]

// Payment status messages
export const PAYMENT_MESSAGES = {
  SUCCESS: "Payment successful! Preparing your recommendations...",
  FAILED: "Payment failed. Please try again.",
  PROCESSING: "Processing payment...",
  REQUIRED: "Payment required for AI recommendations",
  INSUFFICIENT_FUNDS: "Insufficient CELO balance. Please add funds to your wallet.",
  USER_REJECTED: "Payment cancelled by user",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
} as const

// Payment validation
export const validatePaymentAmount = (amount: string): boolean => {
  try {
    const parsedAmount = BigInt(amount)
    const minimumAmount = BigInt(PAYMENT_AMOUNT_WEI)
    return parsedAmount >= minimumAmount
  } catch {
    return false
  }
}

// Format payment amount for display
export const formatPaymentAmount = (amount: string): string => {
  try {
    const parsedAmount = BigInt(amount)
    const celoAmount = Number(parsedAmount) / 1e18
    return `${celoAmount} CELO`
  } catch {
    return "Invalid amount"
  }
}

// Payment receipt structure
export interface PaymentReceipt {
  transactionHash: string
  walletAddress: string
  amount: string
  timestamp: number
  description: string
}

// Create payment receipt
export const createPaymentReceipt = (
  transactionHash: string,
  walletAddress: string,
  amount: string = PAYMENT_AMOUNT_WEI
): PaymentReceipt => {
  return {
    transactionHash,
    walletAddress,
    amount,
    timestamp: Date.now(),
    description: PAYMENT_DESCRIPTION,
  }
}
