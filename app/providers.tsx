"use client"

import type React from "react"

import { ThirdwebProvider } from "thirdweb/react"
import { client } from "./client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      client={client}
      supportedChains={[
        {
          id: 44787,
          name: "Celo Alfajores",
          rpc: "https://alfajores-forno.celo-testnet.org",
          nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
        },
      ]}
    >
      {children}
    </ThirdwebProvider>
  )
}

