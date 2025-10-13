"use client"

// x402 Payment Component - Updated for 50 CELO payments
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useActiveAccount, useSendTransaction } from "thirdweb/react"
import { prepareTransaction } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { 
  X402_CONFIG,
  formatX402PaymentAmount,
  createX402Error,
  X402ErrorType,
  type X402PaymentRequest,
  type X402PaymentResponse
} from "@/lib/x402-config"
import { X, Lock, Sparkles, CreditCard, Loader2 } from "lucide-react"

interface X402PaymentProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (paymentToken: string) => void
  paymentRequest: X402PaymentRequest
  userPreferences: string
}

// Component version: 2.0 - Updated for 50 CELO payments with solid colors

export default function X402Payment({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  paymentRequest,
  userPreferences 
}: X402PaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<'init' | 'processing' | 'verifying' | 'success'>('init')
  const account = useActiveAccount()
  const { mutate: sendTransaction } = useSendTransaction()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log('X402Payment modal opened - Version 2.0 - 50 CELO')
      setPaymentStep('init')
      setError(null)
      setIsProcessing(false)
    }
  }, [isOpen])

  const handleX402Payment = async () => {
    if (!account) {
      setError("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    setError(null)
    setPaymentStep('processing')

    try {
      // Prepare payment transaction
      const transaction = prepareTransaction({
        client,
        chain: celoMainnet,
        to: paymentRequest.recipient,
        value: BigInt(paymentRequest.amount),
        data: `0x${Buffer.from(JSON.stringify({
          description: paymentRequest.description,
          nonce: paymentRequest.nonce,
          timestamp: paymentRequest.timestamp
        })).toString('hex')}`,
      })

      // Send the payment transaction
      sendTransaction(transaction, {
        onSuccess: async (result) => {
          console.log("x402 payment successful:", result)
          setPaymentStep('verifying')
          
          // Verify payment and get payment token
          try {
            const paymentToken = await verifyPaymentAndGetToken(result.transactionHash)
            
            if (paymentToken) {
              setPaymentStep('success')
              
              // Small delay to show success state
              setTimeout(() => {
                onPaymentSuccess(paymentToken)
                onClose()
              }, 1500)
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError)
            setError("Payment verification failed. Please contact support.")
            setPaymentStep('init')
          }
        },
        onError: (error) => {
          console.error("x402 payment failed:", error)
          setError(error.message || X402_CONFIG.MESSAGES.PAYMENT_FAILED)
          setPaymentStep('init')
        },
      })
    } catch (err) {
      console.error("x402 payment error:", err)
      setError(err instanceof Error ? err.message : X402_CONFIG.MESSAGES.PAYMENT_FAILED)
      setPaymentStep('init')
    } finally {
      setIsProcessing(false)
    }
  }

  // Verify payment and get payment token
  const verifyPaymentAndGetToken = async (transactionHash: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/x402/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionHash,
          walletAddress: account?.address,
          paymentRequest
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.paymentToken
      }
      
      return null
    } catch (error) {
      console.error("Payment verification failed:", error)
      return null
    }
  }

  const getStepContent = () => {
    switch (paymentStep) {
      case 'init':
        return (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-zinc-800 p-3 rounded-full border border-zinc-700">
                <Lock className="text-white" size={24} />
              </div>
            <div>
              <h2 className="text-xl font-bold text-white">x402 Payment</h2>
              <p className="text-zinc-400 text-sm">Pay for AI recommendations</p>
            </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center">
                  <Sparkles className="text-white" size={12} />
                </div>
                <span className="text-zinc-300">AI-powered movie analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center">
                  <Sparkles className="text-white" size={12} />
                </div>
                <span className="text-zinc-300">Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center">
                  <Sparkles className="text-white" size={12} />
                </div>
                <span className="text-zinc-300">Detailed reasoning for each suggestion</span>
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-300 text-sm">Payment Amount</span>
                <span className="text-white font-semibold">{formatX402PaymentAmount()}</span>
              </div>
              <div className="text-xs text-zinc-400">
                One-time payment for AI recommendations
              </div>
            </div>

            {error && (
              <div className="bg-zinc-900/50 border border-red-500/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-zinc-800 text-zinc-300 py-3 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleX402Payment}
                disabled={isProcessing || !account}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <CreditCard size={16} />
                Pay {formatX402PaymentAmount()}
              </button>
            </div>
          </>
        )

      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="bg-zinc-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-zinc-700">
              <Loader2 className="text-white animate-spin" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Processing Payment</h3>
            <p className="text-zinc-400 text-sm">Sending payment to blockchain...</p>
          </div>
        )

      case 'verifying':
        return (
          <div className="text-center py-8">
            <div className="bg-zinc-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-zinc-700">
              <Loader2 className="text-white animate-spin" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Verifying Payment</h3>
            <p className="text-zinc-400 text-sm">Confirming transaction on blockchain...</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="bg-zinc-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-green-500">
              <Sparkles className="text-green-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Payment Successful!</h3>
            <p className="text-zinc-400 text-sm">Generating your AI recommendations...</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - only show on init step */}
            {paymentStep === 'init' && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {getStepContent()}

            {/* Wallet connection prompt */}
            {!account && paymentStep === 'init' && (
              <div className="mt-4 text-center">
                <p className="text-zinc-400 text-sm">
                  Please connect your wallet to make a payment
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
