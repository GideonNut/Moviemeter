"use client"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface GoodDollarClaimProps {
  address?: string
}

// Renders GoodDollar's claim-button web component and configures wallet flow
export default function GoodDollarClaim(props: GoodDollarClaimProps) {
  const initializedRef = useRef(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [open, setOpen] = useState(false)
  const claimUrl = props.address
    ? `https://wallet.gooddollar.org/claim?address=${encodeURIComponent(props.address)}`
    : "https://wallet.gooddollar.org/claim"

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    // Load the GoodDollar claim-button script if not already present
    const existing = document.querySelector('script[data-gd-claim]') as HTMLScriptElement | null
    const ensureElement = () => {
      elementRef.current = document.getElementById("gd-claim-button") as HTMLElement | null
      if (!elementRef.current) return
      // Make sure the custom element takes up space visibly
      elementRef.current.style.display = "inline-block"
      try {
        // Optional: configure wallet/app metadata
        // @ts-ignore - property is set by the web component
        elementRef.current.appkitConfig = {
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
          metadata: {
            name: "MovieMeter",
            description: "Claim your daily GoodDollar UBI in-app",
            url: typeof window !== 'undefined' ? window.location.origin : "https://moviemeter.vercel.app",
            icons: ["https://moviemeter.vercel.app/moviemeter.png"],
          },
        }
        // If the custom element class is defined, mark as ready
        if (window.customElements && window.customElements.get("claim-button")) {
          setIsReady(true)
        } else {
          // Give the browser a moment to upgrade the element
          setTimeout(() => setIsReady(true), 300)
        }
      } catch {
        // noop: component will still render with defaults
      }
    }

    if (existing) {
      ensureElement()
      return
    }

    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@gooddollar/claim-button@latest/dist/claim-button.js"
    script.async = true
    script.setAttribute("data-gd-claim", "true")
    script.onload = ensureElement
    document.head.appendChild(script)

    return () => {
      // Keep script cached across navigations; no cleanup
    }
  }, [])

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <claim-button id="gd-claim-button" environment="production"></claim-button>

      {!isReady && (
        <a
          href={claimUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
        >
          Claim your daily UBI (G$)
        </a>
      )}

      <div className="text-xs text-zinc-400">or</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
            Claim in app
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Claim your daily GoodDollar (G$)</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh]">
            <iframe
              src={claimUrl}
              title="GoodDollar Claim"
              className="w-full h-full border-0"
              allow="clipboard-write; payment;"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


