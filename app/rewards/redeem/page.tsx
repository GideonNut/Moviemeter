"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Coins, DollarSign, Gift, ArrowRight, Shield, CheckCircle2 } from "lucide-react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { SelfAppBuilder, getUniversalLink } from "@selfxyz/core"

interface TokenOption {
  id: string
  name: string
  symbol: string
  icon: React.ReactNode
  pointsRequired: number
  tokenAmount: number
  description: string
}

export default function RedeemPage() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [points, setPoints] = useState(1000) // Mock points balance
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const account = useActiveAccount()

  // Initialize Self.xyz app only when we have an account
  const selfApp = account?.address ? new SelfAppBuilder({
    appName: "MovieMeter",
    scope: "moviemeter.app",
    endpoint: "https://moviemeter.app/api/verify",
    logoBase64: "https://moviemeter.app/logo.png", // Replace with your actual logo URL
    userIdType: "hex",
    userId: account.address,
  }).build() : null

  // Check verification status on mount and when account changes
  useEffect(() => {
    if (account?.address) {
      checkVerificationStatus()
    }
  }, [account?.address])

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/verify/status?address=${account?.address}`)
      const data = await response.json()
      setIsVerified(data.isVerified)
    } catch (error) {
      console.error("Failed to check verification status:", error)
    }
  }

  const handleVerify = async () => {
    if (!account || !selfApp) return

    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Get the deeplink for Self.xyz app
      const deeplink = getUniversalLink(selfApp)

      // Open the deeplink in a new window/tab
      window.open(deeplink, "_blank")

      // Start polling for verification status
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/verify/status?address=${account.address}`)
          const data = await response.json()
          
          if (data.isVerified) {
            clearInterval(pollInterval)
            setIsVerified(true)
            setIsVerifying(false)
          }
        } catch (error) {
          console.error("Failed to check verification status:", error)
        }
      }, 5000) // Poll every 5 seconds

      // Clear interval after 5 minutes (timeout)
      setTimeout(() => {
        clearInterval(pollInterval)
        if (!isVerified) {
          setIsVerifying(false)
          setVerificationError("Verification timed out. Please try again.")
        }
      }, 300000) // 5 minutes timeout

    } catch (error) {
      console.error("Verification failed:", error)
      setVerificationError("Failed to start verification. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleRedeem = async (tokenId: string) => {
    if (!account) {
      alert("Please connect your wallet first")
      return
    }

    if (!isVerified) {
      alert("Please complete Self.xyz verification first")
      return
    }

    const selectedOption = tokenOptions.find((option) => option.id === tokenId)
    if (!selectedOption) return

    if (points < selectedOption.pointsRequired) {
      alert("Not enough points")
      return
    }

    // Here you would implement the actual redemption logic
    // For now, we'll just show a success message
    alert(`Successfully redeemed ${selectedOption.tokenAmount} ${selectedOption.symbol}`)
    setPoints(points - selectedOption.pointsRequired)
  }

  const tokenOptions: TokenOption[] = [
    {
      id: "cusd",
      name: "Celo Dollar",
      symbol: "cUSD",
      icon: <DollarSign className="w-6 h-6 text-green-400" />,
      pointsRequired: 1000,
      tokenAmount: 1,
      description: "Stablecoin on the Celo network",
    },
    {
      id: "gooddollar",
      name: "GoodDollar",
      symbol: "G$",
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
      pointsRequired: 1000,
      tokenAmount: 100,
      description: "Universal basic income token",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Redeem Points</h1>
          <p className="text-zinc-400 mb-8">
            Convert your earned points into cUSD or GoodDollar tokens
          </p>

          {/* Points Balance */}
          <div className="bg-zinc-900 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Points Balance</h2>
                <p className="text-3xl font-bold text-rose-500">{points}</p>
              </div>
              <Gift className="w-8 h-8 text-rose-500" />
            </div>
          </div>

          {/* Wallet Connection */}
          {!account && (
            <div className="bg-zinc-900 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
              <p className="text-zinc-400 mb-4">
                Connect your wallet to redeem points for tokens
              </p>
              <ConnectButton client={client} chain={celoMainnet} />
            </div>
          )}

          {/* Self.xyz Verification */}
          {account && !isVerified && (
            <div className="bg-zinc-900 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Self.xyz Verification Required</h2>
                  <p className="text-zinc-400 mb-4">
                    To prevent abuse and ensure fair distribution, please verify your identity with Self.xyz
                  </p>
                  {verificationError && (
                    <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-md mb-4">
                      {verificationError}
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isVerifying ? "Verifying..." : "Verify with Self.xyz"}
                      {isVerifying && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    </button>
                    <p className="text-sm text-zinc-400 text-center">
                      Don't have the Self.xyz app?{" "}
                      <a
                        href="https://self.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Download it here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Success */}
          {isVerified && (
            <div className="bg-green-900/20 border border-green-900 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>Successfully verified with Self.xyz</span>
              </div>
            </div>
          )}

          {/* Token Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {tokenOptions.map((token) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-zinc-900 rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedToken === token.id ? "ring-2 ring-rose-500" : "hover:bg-zinc-800"
                } ${!isVerified ? "opacity-50" : ""}`}
                onClick={() => isVerified && setSelectedToken(token.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg">{token.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{token.name}</h3>
                      <span className="text-rose-500 font-bold">{token.pointsRequired} pts</span>
                    </div>
                    <p className="text-zinc-400 mt-1">{token.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-zinc-400">
                        You'll receive: {token.tokenAmount} {token.symbol}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRedeem(token.id)
                        }}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        disabled={!account || !isVerified || points < token.pointsRequired}
                      >
                        Redeem
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">1</div>
                <h3 className="font-semibold mb-2">Connect Wallet</h3>
                <p className="text-zinc-400 text-sm">
                  Connect your Celo wallet to start the redemption process
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">2</div>
                <h3 className="font-semibold mb-2">Verify Identity</h3>
                <p className="text-zinc-400 text-sm">
                  Complete Self.xyz verification to ensure fair distribution
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">3</div>
                <h3 className="font-semibold mb-2">Choose Token</h3>
                <p className="text-zinc-400 text-sm">
                  Select between cUSD or GoodDollar tokens
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6">
                <div className="text-2xl font-bold text-rose-500 mb-2">4</div>
                <h3 className="font-semibold mb-2">Confirm Transaction</h3>
                <p className="text-zinc-400 text-sm">
                  Confirm the transaction to receive your tokens
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 