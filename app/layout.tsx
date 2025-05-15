import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieMeter - Your Blockchain IMDb",
  description: "Vote for your favorite movies on the blockchain",
  openGraph: {
    title: "MovieMeter - Your Blockchain IMDb",
    description: "Vote for your favorite movies on the blockchain",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new%20favicon-iBH197m4BzR8Uw2qerbRRSBIUhjj5h.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new%20favicon-iBH197m4BzR8Uw2qerbRRSBIUhjj5h.png",
    "fc:frame:button:1": "Connect Wallet",
    "fc:frame:post_url": "https://your-domain.com/api/frame", // Replace with your actual domain
  },
  icons: {
    icon: {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new%20favicon-iBH197m4BzR8Uw2qerbRRSBIUhjj5h.png",
      sizes: "512x512",
      type: "image/png",
    },
    apple: {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new%20favicon-iBH197m4BzR8Uw2qerbRRSBIUhjj5h.png",
      sizes: "512x512",
      type: "image/png",
    },
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 to-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
