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
  icons: {
    icon: {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20png-r3dxjfHmuTVCaDvJ5i6eDlG2qHoJ5N.png",
      sizes: "512x512",
      type: "image/png",
    },
    apple: {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20png-r3dxjfHmuTVCaDvJ5i6eDlG2qHoJ5N.png",
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
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
