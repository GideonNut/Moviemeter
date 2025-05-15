"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { initFarcasterSDK } from "@/lib/farcaster-sdk"
import { ThemeProvider } from "@/components/theme-provider"

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await initFarcasterSDK()
      setIsLoading(false)
    }

    init()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-black text-white">{children}</div>
    </ThemeProvider>
  )
}
