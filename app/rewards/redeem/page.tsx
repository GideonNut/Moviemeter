"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Coins, DollarSign, Gift, ArrowRight, Shield, CheckCircle2, ArrowLeft } from "lucide-react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/app/client"
import { celoMainnet } from "@/lib/blockchain-service"
import { supportedTokens } from "@/lib/token-config"
import { SelfAppBuilder, getUniversalLink } from "@selfxyz/core"
import { SelfQRcodeWrapper } from '@selfxyz/qrcode'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from "next/navigation"

interface TokenOption {
  id: string
  name: string
  symbol: string
  icon: React.ReactNode
  pointsRequired: number
  tokenAmount: number
  description: string
}

// Utility to check if a string is a valid Ethereum address (0x-prefixed, 40 hex chars)
function isValidEthAddress(address: string | undefined): boolean {
  return !!address && /^0x[a-fA-F0-9]{40}$/.test(address)
}
// Utility to check if a string is a valid UUID (v4)
function isValidUUID(uuid: string | undefined): boolean {
  return !!uuid && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

export default function RedeemPage() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [points, setPoints] = useState(1000) // Mock points balance
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [proof, setProof] = useState<any>(null)
  const [publicSignals, setPublicSignals] = useState<any>(null)
  const account = useActiveAccount()
  const [showSelfQR, setShowSelfQR] = useState(false)
  const router = useRouter()

  // Initialize Self.xyz app only when we have an account
  const selfApp = account?.address ? new SelfAppBuilder({
    appName: "MovieMeter",
    scope: "moviemeter.io",
    endpoint: "https://moviemeter.io/api/verify/status",
    logoBase64: "https://moviemeter.io/logo.png", // Replace with your actual logo URL
    userIdType: "hex",
    userId: account.address,
  }).build() : null

  // Always use a UUID for the QR code userId
  const qrUserId = uuidv4()
  const userIdType: 'uuid' = 'uuid'
  let qrSelfApp: any = null
  try {
    qrSelfApp = new SelfAppBuilder({
      appName: 'MovieMeter',
      scope: 'moviemeter.io',
      endpoint: 'https://moviemeter.io/api/verify/status',
      logoBase64: 'https://moviemeter.io/logo.png',
      userId: qrUserId,
      userIdType,
      disclosures: {
        name: true,
        nationality: true,
        date_of_birth: true,
        minimumAge: 18,
        ofac: true,
      },
    }).build()
  } catch (e) {
    qrSelfApp = null
  }

  // Check verification status on mount and when account changes
  useEffect(() => {
    if (account?.address) {
      checkVerificationStatus()
    }
  }, [account?.address])

  // Listen for proof/publicSignals from Self.xyz (via window message)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Optionally check event.origin for security
      if (event.data && event.data.proof && event.data.publicSignals) {
        setProof(event.data.proof)
        setPublicSignals(event.data.publicSignals)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Submit proof to backend when received
  useEffect(() => {
    const submitProof = async () => {
      if (!proof || !publicSignals || !account?.address) return
      setIsVerifying(true)
      setVerificationError(null)
      try {
        const res = await fetch("/api/verify/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proof,
            publicSignals,
            address: account.address,
          }),
        })
        const data = await res.json()
        if (data.isVerified) {
          setIsVerified(true)
        } else {
          setVerificationError("Verification failed.")
        }
      } catch (err) {
        setVerificationError("Verification failed.")
      }
      setIsVerifying(false)
    }
    if (proof && publicSignals && account?.address) {
      submitProof()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proof, publicSignals, account?.address])

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
      icon: <DollarSign className="w-6 h-6 text-white" />,
      pointsRequired: 1000,
      tokenAmount: 1,
      description: "Stablecoin on the Celo network",
    },
    {
      id: "gooddollar",
      name: "GoodDollar",
      symbol: "G$",
      icon: <Coins className="w-6 h-6 text-white" />,
      pointsRequired: 1000,
      tokenAmount: 100,
      description: "Universal basic income token",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-white">Redeem Points</h1>
          <p className="text-gray-400 mb-8">
            Convert your earned points into cUSD or GoodDollar tokens
          </p>

          {/* Points Balance */}
          <div className="bg-[#18181b] rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">Your Points Balance</h2>
                <p className="text-3xl font-bold text-white">{points}</p>
              </div>
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Wallet Connection */}
          {!account && (
            <div className="bg-[#18181b] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Connect Wallet</h2>
              <p className="text-gray-400 mb-4">
                Connect your wallet to redeem points for tokens
              </p>
              <ConnectButton 
                client={client} 
                chain={celoMainnet}
                supportedTokens={supportedTokens}
              />
            </div>
          )}

          {/* Self.xyz Verification Button and QR code option */}
          {account && !isVerified && (
            <>
              {!showSelfQR && (
                <div className="flex justify-center mb-8">
                  <button
                    className="bg-gradient-to-r from-white/20 to-white/10 border-2 border-white text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:from-white/30 hover:to-white/20 transition-all duration-200 flex items-center gap-2"
                    onClick={() => setShowSelfQR(true)}
                  >
                    <Shield className="w-6 h-6 text-white" /> Verify with Self
                  </button>
                </div>
              )}
              {showSelfQR && !qrSelfApp && (
                <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-md mb-8 text-center">
                  Unable to generate QR code for Self.xyz verification. Please check your wallet connection or try refreshing the page.
                </div>
              )}
              {showSelfQR && qrSelfApp && (
                <div className="bg-[#18181b] rounded-lg p-6 mb-8">
                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-xl font-semibold mb-2 text-white">Verify with Self.xyz (QR Code)</h2>
                    <p className="text-gray-400 mb-4 text-center">
                      Scan this QR code with the Self.xyz app to verify your identity
                    </p>
                    <SelfQRcodeWrapper
                      selfApp={qrSelfApp}
                      onSuccess={() => {
                        checkVerificationStatus()
                      }}
                      onError={(data) => {
                        console.error('Self.xyz QR error', data)
                        setVerificationError(data?.reason || 'QR verification failed.')
                      }}
                      size={300}
                      darkMode={true}
                    />
                    <p className="text-sm text-gray-400 text-center">
                      Don't have the Self.xyz app?{' '}
                      <a
                        href="https://self.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-gray-300"
                      >
                        Download it here
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Verification Success */}
          {isVerified && (
            <div className="bg-white/10 border border-white rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-white">
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
                className={`bg-[#18181b] rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedToken === token.id ? "ring-2 ring-white" : "hover:bg-gray-800"
                } ${!isVerified ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => isVerified && setSelectedToken(token.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">{token.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                      <span className="text-white font-bold">{token.pointsRequired} pts</span>
                    </div>
                    <p className="text-gray-400 mt-1">{token.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        You'll receive: {token.tokenAmount} {token.symbol}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRedeem(token.id)
                        }}
                        className="flex items-center gap-2 bg-black border-2 border-white hover:bg-white hover:text-black text-white px-4 py-2 rounded-md text-sm font-bold transition-colors disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500"
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
            <h2 className="text-2xl font-bold mb-4 text-white">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#18181b] rounded-lg p-6">
                <div className="text-2xl font-bold text-white mb-2">1</div>
                <h3 className="font-semibold mb-2 text-white">Connect Wallet</h3>
                <p className="text-gray-400 text-sm">
                  Connect your Celo wallet to start the redemption process
                </p>
              </div>
              <div className="bg-[#18181b] rounded-lg p-6">
                <div className="text-2xl font-bold text-white mb-2">2</div>
                <h3 className="font-semibold mb-2 text-white">Verify Identity</h3>
                <p className="text-gray-400 text-sm">
                  Complete Self.xyz verification to ensure fair distribution
                </p>
              </div>
              <div className="bg-[#18181b] rounded-lg p-6">
                <div className="text-2xl font-bold text-white mb-2">3</div>
                <h3 className="font-semibold mb-2 text-white">Choose Token</h3>
                <p className="text-gray-400 text-sm">
                  Select between cUSD or GoodDollar tokens
                </p>
              </div>
              <div className="bg-[#18181b] rounded-lg p-6">
                <div className="text-2xl font-bold text-white mb-2">4</div>
                <h3 className="font-semibold mb-2 text-white">Confirm Transaction</h3>
                <p className="text-gray-400 text-sm">
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