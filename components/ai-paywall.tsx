"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useActiveAccount, useSendTransaction } from "thirdweb/react"
import { prepareContractCall, getContract, prepareTransaction } from "thirdweb"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { 
  PAYMENT_RECIPIENT_ADDRESS, 
  PAYMENT_AMOUNT_WEI, 
  PAYMENT_DESCRIPTION,
  PAYWALL_FEATURES,
  PAYMENT_MESSAGES
} from "@/lib/payment-config"
import { X, Lock, Sparkles, CreditCard } from "lucide-react"

interface AIPaywallProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
  userPreferences: string
}

export default function AIPaywall({ isOpen, onClose, onPaymentSuccess, userPreferences }: AIPaywallProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const account = useActiveAccount()
  const { mutate: sendTransaction } = useSendTransaction()

  const handlePayment = async () => {
    if (!account) {
      setError("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Prepare direct transfer transaction to recipient
      const transaction = prepareTransaction({
        client,
        chain: celoMainnet,
        to: PAYMENT_RECIPIENT_ADDRESS,
        value: BigInt(PAYMENT_AMOUNT_WEI),
        data: "0x", // No data needed for simple transfer
      })

      // Send the transaction
      sendTransaction(transaction, {
        onSuccess: async (result) => {
          console.log("Payment successful:", result)
          
          // Mark user as paid in the backend
          try {
            await fetch('/api/movies/recommendations', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                walletAddress: account.address,
              }),
            })
          } catch (err) {
            console.error("Failed to mark user as paid:", err)
          }
          
          onPaymentSuccess()
          onClose()
        },
        onError: (error) => {
          console.error("Payment failed:", error)
          setError(PAYMENT_MESSAGES.FAILED)
        },
      })
    } catch (err) {
      console.error("Payment error:", err)
      setError(PAYMENT_MESSAGES.FAILED)
    } finally {
      setIsProcessing(false)
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
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-500/20 p-3 rounded-full">
                <Lock className="text-rose-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Premium AI Recommendations</h2>
                <p className="text-zinc-400 text-sm">Unlock personalized movie suggestions</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {PAYWALL_FEATURES.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <Sparkles className="text-rose-500" size={16} />
                  <span className="text-zinc-300">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* Payment section */}
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-300 text-sm">Payment Amount</span>
                <span className="text-white font-semibold">{PAYMENT_AMOUNT_CELO} CELO</span>
              </div>
              <div className="text-xs text-zinc-400">
                One-time payment for AI recommendations
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/20 border border-red-900 text-red-200 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-zinc-800 text-zinc-300 py-3 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing || !account}
                className="flex-1 bg-rose-600 text-white py-3 px-4 rounded-lg hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Pay {PAYMENT_AMOUNT_CELO} CELO
                  </>
                )}
              </button>
            </div>

            {/* Wallet connection prompt */}
            {!account && (
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
