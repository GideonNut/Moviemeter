"use client"

import type React from "react"

import { ThirdwebProvider } from "thirdweb/react"
import { client } from "./client"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider client={client}>{children}</ThirdwebProvider>
}

