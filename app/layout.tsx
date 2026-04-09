import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"

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
    <html lang="en">
      <head>
        <meta
          name="talentapp:project_verification"
          content="36e39149fe5b5e09fed2e247875ce5166dbbac1ace8f51586dbfce0e6a3836a1c5c381ba9a2b8555c61193f4e82972ff4e129b60e69ec36e20cf180252a049ec"
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
