import { type NextRequest, NextResponse } from "next/server"
import { 
  X402_CONFIG, 
  createX402PaymentRequest,
  validateX402PaymentResponse,
  createX402Error,
  X402ErrorType,
  type X402PaymentRequest,
  type X402PaymentResponse
} from "@/lib/x402-config"

/**
 * x402 Payment API Route
 * 
 * This endpoint handles x402 payment protocol requests for AI recommendations.
 * It returns a 402 Payment Required status with payment details when payment is needed.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { preferences, walletAddress, paymentToken } = body

    if (!preferences) {
      return NextResponse.json(
        { error: "User preferences are required" },
        { status: 400 }
      )
    }

    // If payment token is provided, verify it
    if (paymentToken) {
      const isValidToken = await verifyPaymentToken(paymentToken)
      if (isValidToken) {
        // Payment verified, process AI recommendations
        const recommendations = await processAIRecommendations(preferences)
        return NextResponse.json({
          success: true,
          recommendations,
          message: "AI recommendations generated successfully"
        })
      }
    }

    // No valid payment token, return 402 Payment Required
    const paymentRequest = createX402PaymentRequest()
    
    return NextResponse.json(
      {
        error: X402_CONFIG.MESSAGES.PAYMENT_REQUIRED,
        payment: paymentRequest,
        requiresPayment: true
      },
      { 
        status: 402,
        headers: {
          [X402_CONFIG.HEADERS.PAYMENT_AMOUNT]: paymentRequest.amount,
          [X402_CONFIG.HEADERS.PAYMENT_RECIPIENT]: paymentRequest.recipient,
          [X402_CONFIG.HEADERS.PAYMENT_DESCRIPTION]: paymentRequest.description,
          [X402_CONFIG.HEADERS.PAYMENT_NONCE]: paymentRequest.nonce,
        }
      }
    )

  } catch (error) {
    console.error("x402 payment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Verify payment token from blockchain transaction
 */
async function verifyPaymentToken(paymentToken: string): Promise<boolean> {
  try {
    // In a real implementation, you would:
    // 1. Decode the payment token
    // 2. Verify the transaction hash on the blockchain
    // 3. Check that the payment amount and recipient match
    // 4. Verify the transaction is confirmed and recent
    
    // For now, we'll simulate token verification
    // In production, integrate with your blockchain service
    console.log("Verifying payment token:", paymentToken)
    
    // Simulate token verification
    return paymentToken.length > 10 // Basic validation for demo
  } catch (error) {
    console.error("Payment token verification failed:", error)
    return false
  }
}

/**
 * Process AI recommendations after payment verification
 */
async function processAIRecommendations(preferences: string): Promise<any[]> {
  try {
    // Import and use the existing AI recommendation function
    const { getMovieRecommendations } = await import("@/lib/ai-agent")
    return await getMovieRecommendations(preferences)
  } catch (error) {
    console.error("AI recommendations processing failed:", error)
    return []
  }
}

/**
 * GET endpoint to check payment status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentToken = searchParams.get('token')
    const walletAddress = searchParams.get('wallet')

    if (!paymentToken || !walletAddress) {
      return NextResponse.json(
        { error: "Payment token and wallet address are required" },
        { status: 400 }
      )
    }

    const isValidToken = await verifyPaymentToken(paymentToken)
    
    return NextResponse.json({
      valid: isValidToken,
      message: isValidToken ? "Payment verified" : "Payment not verified"
    })

  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
