import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieMeter - Vote on Movies, Earn Rewards",
  description: "Vote on your favorite films, earn rewards, and join the decentralized movie community.",
  keywords: ["movies", "voting", "rewards", "blockchain", "celo", "web3"],
  authors: [{ name: "MovieMeter Team" }],
  creator: "MovieMeter",
  publisher: "MovieMeter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://moviemeter.vercel.app"),
  openGraph: {
    title: "MovieMeter - Vote on Movies, Earn Rewards",
    description: "Vote on your favorite films, earn rewards, and join the decentralized movie community.",
    url: "https://moviemeter.vercel.app",
    siteName: "MovieMeter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MovieMeter - Vote on Movies, Earn Rewards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieMeter - Vote on Movies, Earn Rewards",
    description: "Vote on your favorite films, earn rewards, and join the decentralized movie community.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
