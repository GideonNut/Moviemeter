"use client"

import type React from "react"
import { ThirdwebProvider } from "thirdweb/react"
import { client } from "./client"
import { MovieProvider } from "@/lib/state/MovieContext"

// Define Celo mainnet as the only supported chain
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      client={client}
      supportedChains={[
        {
          id: 42220,
          name: "Celo Mainnet",
          rpc: "https://forno.celo.org",
          nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
          explorers: [
            {
              name: "Celo Explorer",
              url: "https://explorer.celo.org",
            },
          ],
        },
      ]}
    >
      <MovieProvider>{children}</MovieProvider>
    </ThirdwebProvider>
  )
}
