"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/farcaster-sdk"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import MiniAppNavigation from "@/components/mini-app-navigation"

export default function SimpleMiniAppPage() {
  const [isAppAdded, setIsAppAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize SDK
        try {
          await sdk.actions.ready()
          console.log("SDK initialized successfully")
        } catch (err) {
          console.error("Error initializing SDK:", err)
        }

        // Check if app is added
        if (sdk?.context?.client?.added) {
          setIsAppAdded(true)
        }
      } catch (err) {
        console.error("Error initializing app:", err)
        setError("Failed to initialize app. Please try again.")
      }
    }

    initApp()
  }, [])

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-black text-white">
        <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-white hover:bg-gray-200 text-black">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-[300px] h-[150px] mb-8">
          <Image src="/images/new-logo.png" alt="MovieMeter Logo" fill className="object-contain" priority />
        </div>

        <p className="text-white text-center mb-8">
          Your <span className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">Blockchain</span> IMDb.
        </p>

        {!isAppAdded && (
          <Button variant="outline" className="border-white text-white hover:bg-gray-900" onClick={handleAddApp}>
            <Plus className="h-4 w-4 mr-2" />
            Add MovieMeter
          </Button>
        )}
      </div>

      <MiniAppNavigation />
    </div>
  )
}
