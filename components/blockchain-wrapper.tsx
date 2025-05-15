"use client"

import { WagmiConfig } from "wagmi"
import { wagmiConfig } from "@/lib/wagmi-config"
import type { ReactNode } from "react"

interface BlockchainWrapperProps {
  children: ReactNode
}

export default function BlockchainWrapper({ children }: BlockchainWrapperProps) {
  try {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
  } catch (error) {
    console.error("Error in BlockchainWrapper:", error)
    return <>{children}</>
  }
}
