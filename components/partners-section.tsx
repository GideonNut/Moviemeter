"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'

export default function PartnersSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const partners = [
    {
      name: "Celo",
      logo: "/celosvg.svg"
    },
    // Add more partners here as you get them
    {
      name: "GoodDollar",
      logo: "/GoodDollar.svg"
    },
    {
      name: "Celo Public Goods", 
      logo: "/celopg.svg"
    },
    // Add more as needed
  ]

  if (!mounted) return null

  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Powered by Industry Leaders
          </h2>
          <p className="text-muted-foreground">
            Built on cutting-edge blockchain technology
          </p>
        </motion.div>
        
        <InfiniteSlider 
          gap={80} 
          speed={50}
          speedOnHover={20}
          className="max-w-4xl mx-auto"
        >
          {partners.map((partner, index) => {
            let width = 80;
            let height = 40;
            
            if (index === 0) {
              width = 150;
              height = 40;
            } else if (index === 1) {
              width = 80;
              height = 40;
            } else if (index === 2) {
              width = 230;
              height = 30;
            }
            
            return (
              <div 
                key={index}
                className="flex items-center justify-center h-16 px-8 opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={width}
                  height={height}
                  className="object-contain"
                  style={{
                    filter: theme === "dark" ? "brightness(0) invert(1)" : "brightness(0)",
                  }}
                />
              </div>
            )
          })}
        </InfiniteSlider>
      </div>
    </section>
  )
}