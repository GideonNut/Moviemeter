/**
 * x402 Payment Protocol Configuration
 * 
 * x402 is an open payment standard that enables services to charge for access to their APIs
 * and content directly over HTTP using the HTTP 402 Payment Required status code.
 * 
 * This configuration handles payments for AI recommendations using the x402 protocol.
 */

// x402 Payment Configuration
export const X402_CONFIG = {
  // Payment amount in wei (50 CELO for AI recommendations)
  PAYMENT_AMOUNT_WEI: "50000000000000000000", // 50 CELO
  PAYMENT_AMOUNT_DISPLAY: "50 CELO",
  
  // Payment recipient for x402 payments
  PAYMENT_RECIPIENT: "0xD2651cd396DFBfab5EB04788C176BB5fE9018E44",
  
  // x402 Protocol headers
  HEADERS: {
    PAYMENT_REQUIRED: "402 Payment Required",
    PAYMENT_TOKEN: "X-Payment-Token",
    PAYMENT_AMOUNT: "X-Payment-Amount", 
    PAYMENT_RECIPIENT: "X-Payment-Recipient",
    PAYMENT_DESCRIPTION: "X-Payment-Description",
    PAYMENT_NONCE: "X-Payment-Nonce",
    PAYMENT_SIGNATURE: "X-Payment-Signature",
  },
  
  // Payment descriptions for different services
  DESCRIPTIONS: {
    AI_RECOMMENDATIONS: "AI Movie Recommendations Access",
    AI_ANALYSIS: "AI Movie Analysis Service",
    AI_INSIGHTS: "AI Movie Insights Service",
  },
  
  // Payment status messages
  MESSAGES: {
    PAYMENT_REQUIRED: "Payment required for AI recommendations",
    PAYMENT_SUCCESS: "Payment successful, processing recommendations...",
    PAYMENT_FAILED: "Payment failed, please try again",
    INSUFFICIENT_FUNDS: "Insufficient balance for payment",
    INVALID_PAYMENT: "Invalid payment signature",
    PAYMENT_PROCESSING: "Processing payment...",
  },
  
  // Timeout for payment verification (in milliseconds)
  PAYMENT_TIMEOUT: 30000, // 30 seconds
  
  // Maximum number of retry attempts for payment verification
  MAX_RETRY_ATTEMPTS: 3,
} as const

// x402 Payment Request Interface
export interface X402PaymentRequest {
  amount: string
  recipient: string
  description: string
  nonce: string
  timestamp: number
}

// x402 Payment Response Interface  
export interface X402PaymentResponse {
  success: boolean
  transactionHash?: string
  paymentToken?: string
  message: string
  timestamp: number
}

// x402 Payment Token Interface
export interface X402PaymentToken {
  token: string
  amount: string
  recipient: string
  description: string
  nonce: string
  timestamp: number
  signature: string
}

// Generate payment nonce for request uniqueness
export const generatePaymentNonce = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Create x402 payment request
export const createX402PaymentRequest = (
  description: string = X402_CONFIG.DESCRIPTIONS.AI_RECOMMENDATIONS
): X402PaymentRequest => {
  return {
    amount: X402_CONFIG.PAYMENT_AMOUNT_WEI,
    recipient: X402_CONFIG.PAYMENT_RECIPIENT,
    description,
    nonce: generatePaymentNonce(),
    timestamp: Date.now(),
  }
}

// Validate x402 payment response
export const validateX402PaymentResponse = (response: any): boolean => {
  return (
    response &&
    typeof response.success === 'boolean' &&
    response.transactionHash &&
    typeof response.transactionHash === 'string' &&
    response.message &&
    typeof response.message === 'string'
  )
}

// Format x402 payment amount for display
export const formatX402PaymentAmount = (): string => {
  return X402_CONFIG.PAYMENT_AMOUNT_DISPLAY
}

// x402 Error types
export enum X402ErrorType {
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  INVALID_PAYMENT = 'INVALID_PAYMENT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
}

// x402 Error interface
export interface X402Error {
  type: X402ErrorType
  message: string
  code: number
  details?: any
}

// Create x402 error
export const createX402Error = (
  type: X402ErrorType,
  message: string,
  code: number = 402,
  details?: any
): X402Error => {
  return { type, message, code, details }
}
