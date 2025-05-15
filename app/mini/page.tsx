"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/farcaster-sdk"
import { ThumbsUp, ThumbsDown, Share2, Plus, User, ArrowRight, Film, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { movies } from "@/lib/movie-data"
import MiniAppNavigation from "@/components/mini-app-navigation"
import { safeParseInt } from "@/lib/bigint-utils"
import { motion } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"

// Dynamically import the blockchain components to prevent SSR issues
const BlockchainWrapper = dynamic(() => import("@/components/blockchain-wrapper"), {
  ssr: false,
  loading: () => <BlockchainFallback />,
})

// Fallback component when blockchain components are loading
function BlockchainFallback() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 pt-4">
        <Card className="w-full max-w-md mx-auto border-2 border-gray-200 shadow-md">
          <CardHeader className="bg-black text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">MovieMeter</h2>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center bg-white text-black min-h-[300px]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-32 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-48 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
          <CardFooter className="bg-black p-4 flex justify-center items-center text-white">
            <div className="flex items-center relative h-8 w-32">
              <Image src="/images/new-logo.png" alt="MovieMeter" fill className="object-contain" priority />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function MiniAppPage() {
  const [userFid, setUserFid] = useState<number | null>(null)
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const [isAppAdded, setIsAppAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, bottom: 0, left: 0, right: 0 })

  useEffect(() => {
    try {
      // Initialize the SDK
      const initSDK = async () => {
        try {
          await sdk.actions.ready()
          console.log("SDK initialized successfully")
        } catch (err) {
          console.error("Error initializing SDK:", err)
        }
      }

      initSDK()

      // Get user FID from context
      if (sdk?.context?.user?.fid) {
        // Safely parse FID as it might be a BigInt
        setUserFid(safeParseInt(sdk.context.user.fid))
      }

      // Check if app is added
      if (sdk?.context?.client?.added) {
        setIsAppAdded(true)
      }

      // Get safe area insets
      if (sdk?.context?.client?.safeAreaInsets) {
        setSafeAreaInsets(sdk.context.client.safeAreaInsets)
      }

      // Check if we've shown the welcome screen before
      try {
        const hasSeenWelcome = localStorage.getItem("moviemeter_seen_welcome")
        if (hasSeenWelcome) {
          setShowWelcome(false)
        }
      } catch (err) {
        console.error("Error accessing localStorage:", err)
        // If localStorage fails, just show the welcome screen
        setShowWelcome(true)
      }
    } catch (err) {
      console.error("Error initializing app:", err)
      setError("Failed to initialize app. Please try again.")
    }
  }, [])

  // Safely get the current movie
  const currentMovie = movies[currentMovieIndex] || movies[0]

  const handleVote = async (voteType: boolean) => {
    try {
      setIsVoting(true)
      setTransactionStatus("pending")

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTransactionStatus("success")

      // Send notification if app is added
      if (isAppAdded && userFid) {
        try {
          await fetch("/api/send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fid: userFid,
              movieId: currentMovie.id,
              movieTitle: currentMovie.title,
              message: `You voted ${voteType ? "👍" : "👎"} for ${currentMovie.title}`,
            }),
          })
        } catch (error) {
          console.error("Error sending notification:", error)
        }
      }

      // Show success toast
      try {
        if (sdk?.actions?.showToast) {
          await sdk.actions.showToast({
            message: `You voted ${voteType ? "👍" : "👎"} for ${currentMovie.title}`,
            type: "success",
          })
        }
      } catch (err) {
        console.error("Error showing toast:", err)
      }
    } catch (error) {
      console.error("Error voting:", error)
      setTransactionStatus("error")
    } finally {
      setIsVoting(false)
    }
  }

  const handleNextMovie = () => {
    setCurrentMovieIndex((prev) => (prev + 1) % movies.length)
    setTransactionStatus("idle")
  }

  const handleShare = async () => {
    try {
      if (sdk?.actions?.composeCast) {
        await sdk.actions.composeCast({
          text: `I'm voting on ${currentMovie.title} on MovieMeter! What do you think?`,
          embeds: [`https://moviemeter13.vercel.app/mini/movie/${currentMovie.id}`],
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleAddApp = async () => {
    try {
      if (sdk?.actions?.addFrame) {
        await sdk.actions.addFrame()
        setIsAppAdded(true)
      }
    } catch (error) {
      console.error("Error adding app:", error)
    }
  }

  const handleStartExploring = () => {
    setShowWelcome(false)
    try {
      localStorage.setItem("moviemeter_seen_welcome", "true")
    } catch (err) {
      console.error("Error saving to localStorage:", err)
    }
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
        style={{
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        }}
      >
        <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-black hover:bg-gray-900 text-white">
          Try Again
        </Button>
      </div>
    )
  }

  if (showWelcome) {
    return (
      <div
        className="flex flex-col min-h-screen"
        style={{
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        }}
      >
        <div className="px-4 pt-4 flex-1">
          <Card className="w-full max-w-md mx-auto border-2 border-gray-200 shadow-md">
            <CardHeader className="bg-black text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">MovieMeter</h2>
                {userFid && (
                  <Badge variant="outline" className="bg-white/10 text-white">
                    <User className="h-3 w-3 mr-1" />
                    FID: {userFid}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 flex flex-col items-center bg-white text-black">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="h-8 w-8 text-white" />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-2xl font-bold mb-4">
                  Do you love movies? <br />
                  Do you trust your movie taste? <br />
                  Do you like to earn?
                </h1>

                <p className="text-gray-600 mb-6">
                  Vote on your favorite films, earn rewards, and join the decentralized movie community.
                </p>
              </motion.div>

              <div className="w-full space-y-3">
                <Button
                  className="w-full bg-black hover:bg-gray-900 text-white flex items-center justify-center"
                  onClick={handleStartExploring}
                >
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {!isAppAdded && (
                  <Button variant="outline" className="w-full border-gray-300 text-black" onClick={handleAddApp}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add MovieMeter
                  </Button>
                )}
              </div>
            </CardContent>

            <CardFooter className="bg-black p-4 flex justify-center items-center">
              <div className="flex items-center relative h-8 w-32">
                <Image src="/images/new-logo.png" alt="MovieMeter" fill className="object-contain" priority />
              </div>
            </CardFooter>
          </Card>
        </div>

        <MiniAppNavigation />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }}
    >
      <div className="px-4 pt-4 flex-1">
        <Card className="w-full max-w-md mx-auto border-2 border-gray-200 shadow-md">
          <CardHeader className="bg-black text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">MovieMeter</h2>
              <div className="flex items-center gap-2">
                {userFid && (
                  <Badge variant="outline" className="bg-white/10 text-white">
                    <User className="h-3 w-3 mr-1" />
                    FID: {userFid}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-white text-black">
            <div className="aspect-[2/3] relative mb-4 rounded-md overflow-hidden bg-black">
              {currentMovie.posterUrl ? (
                <Image
                  src={currentMovie.posterUrl || "/placeholder.svg"}
                  alt={currentMovie.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold text-white">{currentMovie.title}</h3>
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2">{currentMovie.title}</h3>
            <p className="text-gray-600 mb-4">{currentMovie.description}</p>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <ThumbsUp className="h-5 w-5 text-black mr-1" />
                <span className="font-medium">{safeParseInt(currentMovie.voteCountYes)}</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="h-5 w-5 text-black mr-1" />
                <span className="font-medium">{safeParseInt(currentMovie.voteCountNo)}</span>
              </div>
            </div>

            {transactionStatus === "success" && (
              <div className="bg-gray-100 text-black p-3 rounded-md mb-4">
                Vote successfully recorded on the blockchain!
              </div>
            )}

            {transactionStatus === "error" && (
              <div className="bg-gray-100 text-black p-3 rounded-md mb-4">Transaction failed. Please try again.</div>
            )}

            <Button
              onClick={() => {}}
              className="w-full mb-4 bg-black text-white hover:bg-gray-800"
              disabled={isVoting}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet to Vote
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 p-4 bg-black">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-gray-100 text-black border-white"
                onClick={() => handleVote(true)}
                disabled={isVoting}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {isVoting ? "Voting..." : "Yes"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-gray-100 text-black border-white"
                onClick={() => handleVote(false)}
                disabled={isVoting}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {isVoting ? "Voting..." : "No"}
              </Button>
            </div>

            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1 text-white border-white" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-white hover:bg-gray-100 text-black"
                onClick={handleNextMovie}
              >
                Next Movie
              </Button>
            </div>

            {!isAppAdded && (
              <Button variant="outline" className="w-full border-white text-white" onClick={handleAddApp}>
                <Plus className="h-4 w-4 mr-2" />
                Add MovieMeter
              </Button>
            )}

            <div className="flex justify-center items-center mt-2">
              <div className="flex items-center relative h-8 w-32">
                <Image src="/images/new-logo.png" alt="MovieMeter" fill className="object-contain" priority />
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <MiniAppNavigation />
    </div>
  )
}
