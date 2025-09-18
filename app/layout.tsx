import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieMeter - Vote on Movies",
  description: "Vote on your favorite movies and earn rewards",
}

// Global error handler for ethereum conflicts
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('Cannot redefine property: ethereum') ||
         event.error.message.includes('ethereum'))) {
      event.preventDefault()
      console.warn('Ethereum object conflict detected and handled:', event.error.message)
    }
  })
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
