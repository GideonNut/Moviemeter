"use client"

import { motion } from "framer-motion"
import { Wallet, Star, Coins } from "lucide-react"
import Link from "next/link"

export default function EarningProcess() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Begin by connecting your Web3 wallet to MovieMeter. We support all major wallets and sponsor your gas fees, so you can start earning immediately without any upfront costs.",
      icon: Wallet,
      position: "right"
    },
    {
      number: "02", 
      title: "Rate Movies & TV Shows",
      description: "Share your honest opinions about movies and TV shows you've watched. Each detailed review earns you 5 $G tokens instantly, with bonus rewards for highly-rated content.",
      icon: Star,
      position: "left"
    },
    {
      number: "03",
      title: "Earn $G Token Rewards",
      description: "Watch your $G token balance grow as you participate in the community. Vote on other reviews, maintain daily streaks, and unlock bonus multipliers to maximize your earnings.",
      icon: Coins,
      position: "right"
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm mb-6">
            <span className="text-muted-foreground">How it works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How to start earning with<br />MovieMeter rewards
          </h2>
          <Link
            href="/movies"
            className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Get started
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2 hidden md:block" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex items-center mb-16 last:mb-0 ${
                step.position === 'left' ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Step number dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold hidden md:flex z-10">
                {step.number}
              </div>
              
              {/* Content */}
              <div className={`md:w-1/2 ${step.position === 'left' ? 'md:pr-16' : 'md:pl-16'}`}>
                <div className=" p-8">
                  <div className="flex items-center gap-4 mb-4 md:hidden">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {step.number}
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon size={20} className="text-primary" />
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Empty space for other side on desktop */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}