"use client"

import type React from "react"
import { ThirdwebProvider } from "thirdweb/react"
import { MovieProvider } from "@/lib/state/MovieContext"
import { celo } from "thirdweb/chains"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      supportedChains={[celo]}
    >
      <MovieProvider>
        {children}
      </MovieProvider>
    </ThirdwebProvider>
  )
}
