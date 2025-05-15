"use client"

import type React from "react"
import { WagmiProvider, createConfig } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { frameConnector } from "@farcaster/frame-wagmi-connector"
import { mainnet } from "viem/chains"
import { MovieProvider } from "@/lib/state/MovieContext"

const config = createConfig({
  chains: [mainnet],
  connectors: [frameConnector()],
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MovieProvider>{children}</MovieProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
