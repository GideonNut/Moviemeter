/**
 * Payment Test Utilities
 * 
 * This file contains utilities for testing the payment system.
 * It can be used to simulate payments and test the paywall functionality.
 */

import { PAYMENT_AMOUNT_WEI, validatePaymentAmount, formatPaymentAmount } from "./payment-config"

/**
 * Test if payment validation works correctly
 */
export function testPaymentValidation(): boolean {
  console.log("Testing payment validation...")
  
  // Test valid amount
  const validAmount = PAYMENT_AMOUNT_WEI
  const isValid = validatePaymentAmount(validAmount)
  console.log(`Valid amount ${validAmount}: ${isValid}`)
  
  // Test invalid amount (too small)
  const invalidAmount = "1000000000000000000" // 1 CELO (less than 50 CELO required)
  const isInvalid = validatePaymentAmount(invalidAmount)
  console.log(`Invalid amount ${invalidAmount}: ${isInvalid}`)
  
  // Test formatting
  const formatted = formatPaymentAmount(validAmount)
  console.log(`Formatted amount: ${formatted}`)
  
  return isValid && !isInvalid
}

/**
 * Simulate a successful payment for testing
 */
export function simulatePayment(walletAddress: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`Simulating payment for wallet: ${walletAddress}`)
    console.log(`Payment recipient: 0xD2651cd396DFBfab5EB04788C176BB5fE9018E44`)
    console.log(`Payment amount: 50 CELO`)
    
    // Simulate API call to mark user as paid
    setTimeout(() => {
      console.log("Payment simulation completed")
      resolve(true)
    }, 1000)
  })
}

/**
 * Test the complete payment flow
 */
export async function testPaymentFlow(walletAddress: string): Promise<boolean> {
  try {
    console.log("Starting payment flow test...")
    
    // Test validation
    const validationPassed = testPaymentValidation()
    if (!validationPassed) {
      console.error("Payment validation failed")
      return false
    }
    
    // Simulate payment
    const paymentSuccessful = await simulatePayment(walletAddress)
    if (!paymentSuccessful) {
      console.error("Payment simulation failed")
      return false
    }
    
    console.log("Payment flow test completed successfully")
    return true
  } catch (error) {
    console.error("Payment flow test failed:", error)
    return false
  }
}
