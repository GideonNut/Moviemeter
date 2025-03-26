import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThirdwebProvider } from "thirdweb/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movie Voting DApp on Celo",
  description: "Vote for your favorite movies on the Celo blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  )
}



import './globals.css'