"use client"

import type React from "react"
import { ThirdwebProvider } from "thirdweb/react"
import { client } from "./client"
import { MovieProvider } from "@/lib/state/MovieContext"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define Celo mainnet as the only supported chain
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ThirdwebProvider 
        client={client}
        // Add error boundary and conflict handling
        onError={(error) => {
          console.warn("Thirdweb error:", error)
          // Don't crash the app on wallet conflicts
          if (error.message.includes("ethereum") || error.message.includes("redefine")) {
            return
          }
        }}
      >
        <MovieProvider>{children}</MovieProvider>
      </ThirdwebProvider>
    </NextThemesProvider>
  )
}
