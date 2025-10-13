import { type NextRequest, NextResponse } from "next/server"
import { 
  X402_CONFIG,
  createX402Error,
  X402ErrorType,
  type X402PaymentRequest
} from "@/lib/x402-config"

/**
 * x402 Payment Verification API Route
 * 
 * This endpoint verifies x402 micropayments and generates payment tokens
 * for authenticated access to AI recommendation services.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { transactionHash, walletAddress, paymentRequest } = body

    if (!transactionHash || !walletAddress || !paymentRequest) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Verify the transaction on the blockchain
    const isValidTransaction = await verifyTransactionOnBlockchain(
      transactionHash,
      walletAddress,
      paymentRequest
    )

    if (!isValidTransaction) {
      return NextResponse.json(
        { 
          error: "Transaction verification failed",
          valid: false 
        },
        { status: 400 }
      )
    }

    // Generate payment token for future authenticated requests
    const paymentToken = await generatePaymentToken(
      transactionHash,
      walletAddress,
      paymentRequest
    )

    // Store payment record (in production, use a database)
    await storePaymentRecord({
      transactionHash,
      walletAddress,
      paymentToken,
      amount: paymentRequest.amount,
      timestamp: Date.now()
    })

    return NextResponse.json({
      success: true,
      paymentToken,
      message: "Payment verified successfully",
      valid: true
    })

  } catch (error) {
    console.error("x402 verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Verify transaction on the blockchain
 */
async function verifyTransactionOnBlockchain(
  transactionHash: string,
  walletAddress: string,
  paymentRequest: X402PaymentRequest
): Promise<boolean> {
  try {
    // In a real implementation, you would:
    // 1. Connect to your blockchain provider (Alchemy, Infura, etc.)
    // 2. Fetch the transaction details
    // 3. Verify the transaction is confirmed
    // 4. Check that the amount, recipient, and sender match
    // 5. Verify the transaction is recent (within reasonable timeframe)
    
    console.log("Verifying transaction:", {
      transactionHash,
      walletAddress,
      expectedAmount: paymentRequest.amount,
      expectedRecipient: paymentRequest.recipient
    })

    // For demo purposes, we'll simulate successful verification
    // In production, implement actual blockchain verification:
    /*
    const provider = new ethers.providers.JsonRpcProvider(process.env.CELO_RPC_URL)
    const transaction = await provider.getTransaction(transactionHash)
    const receipt = await provider.getTransactionReceipt(transactionHash)
    
    if (!transaction || !receipt || receipt.status !== 1) {
      return false
    }
    
    // Verify transaction details
    const isValidAmount = transaction.value.toString() === paymentRequest.amount
    const isValidRecipient = transaction.to?.toLowerCase() === paymentRequest.recipient.toLowerCase()
    const isValidSender = transaction.from?.toLowerCase() === walletAddress.toLowerCase()
    
    return isValidAmount && isValidRecipient && isValidSender
    */

    // Simulate verification for demo
    return transactionHash.length > 10 && walletAddress.length > 10
  } catch (error) {
    console.error("Blockchain verification failed:", error)
    return false
  }
}

/**
 * Generate payment token for authenticated access
 */
async function generatePaymentToken(
  transactionHash: string,
  walletAddress: string,
  paymentRequest: X402PaymentRequest
): Promise<string> {
  try {
    // In a real implementation, you would:
    // 1. Create a JWT token with payment details
    // 2. Sign it with a secret key
    // 3. Include expiration time
    // 4. Return the signed token
    
    const tokenData = {
      transactionHash,
      walletAddress,
      amount: paymentRequest.amount,
      recipient: paymentRequest.recipient,
      nonce: paymentRequest.nonce,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }

    // For demo, create a simple base64 encoded token
    // In production, use proper JWT signing
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64')
    
    return `x402_${token}`
  } catch (error) {
    console.error("Token generation failed:", error)
    throw error
  }
}

/**
 * Store payment record for audit and verification
 */
async function storePaymentRecord(paymentRecord: {
  transactionHash: string
  walletAddress: string
  paymentToken: string
  amount: string
  timestamp: number
}): Promise<void> {
  try {
    // In production, store in your database
    // For demo, we'll just log it
    console.log("Payment record stored:", paymentRecord)
    
    // You could also store in a simple in-memory cache or Redis
    // global.paymentRecords = global.paymentRecords || new Map()
    // global.paymentRecords.set(paymentRecord.paymentToken, paymentRecord)
  } catch (error) {
    console.error("Failed to store payment record:", error)
    throw error
  }
}

/**
 * GET endpoint to verify payment token
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentToken = searchParams.get('token')

    if (!paymentToken) {
      return NextResponse.json(
        { error: "Payment token is required" },
        { status: 400 }
      )
    }

    const isValidToken = await verifyPaymentToken(paymentToken)
    
    return NextResponse.json({
      valid: isValidToken.valid,
      expiresAt: isValidToken.expiresAt,
      message: isValidToken.valid ? "Token is valid" : "Token is invalid or expired"
    })

  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Verify payment token
 */
async function verifyPaymentToken(paymentToken: string): Promise<{
  valid: boolean
  expiresAt?: number
}> {
  try {
    if (!paymentToken.startsWith('x402_')) {
      return { valid: false }
    }

    // Decode the token
    const tokenData = JSON.parse(
      Buffer.from(paymentToken.replace('x402_', ''), 'base64').toString()
    )

    // Check if token is expired
    if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
      return { valid: false, expiresAt: tokenData.expiresAt }
    }

    // In production, you would also verify the signature
    // and check against your stored payment records

    return { valid: true, expiresAt: tokenData.expiresAt }
  } catch (error) {
    console.error("Token verification failed:", error)
    return { valid: false }
  }
}
