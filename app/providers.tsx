"use client"

import type React from "react"
import { ThirdwebProvider } from "thirdweb/react"
import { client } from "./client"
import { MovieProvider } from "@/lib/state/MovieContext"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define Celo mainnet as the only supported chain
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {/* <ThirdwebProvider client={client}> */}
      <ThirdwebProvider>
        <MovieProvider>{children}</MovieProvider>
      </ThirdwebProvider>
    </NextThemesProvider>
  )
}
