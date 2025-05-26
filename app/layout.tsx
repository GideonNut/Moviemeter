import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieMeter - Your Blockchain IMDb",
  description: "Vote for your favorite movies on the blockchain",
  icons: {
    icon: {
      url: "/mm-logo-new.png",
      sizes: "512x512",
      type: "image/png",
    },
    apple: {
      url: "/mm-logo-new.png",
      sizes: "512x512",
      type: "image/png",
    },
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
