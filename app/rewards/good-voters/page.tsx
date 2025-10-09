"use client"
import React, { useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActiveAccount } from "thirdweb/react"
import { ConnectButton } from "thirdweb/react"
import { darkTheme } from "thirdweb/react"
import { celoMainnet } from "@/lib/blockchain-service"
import { client } from "@/app/client"
import { supportedTokens, goodDollarToken } from "@/lib/token-config"
import { useToast } from "@/hooks/use-toast"
import GoodDollarClaim from "@/components/gooddollar-claim"
import { getContract, readContract } from "thirdweb"

const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const

export default function GoodVotersPage() {
  const router = useRouter()
  const account = useActiveAccount()
  const address: string | undefined = account?.address
  const { toast } = useToast()
  const [hasShownPrompt, setHasShownPrompt] = useState(false)
  const [gBalance, setGBalance] = useState<string>("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false)

  const wallets = useMemo(() => {
    try {
      // Lazy import to avoid bundle bloat
      const { inAppWallet, createWallet } = require("thirdweb/wallets")
      return [
        inAppWallet({
          auth: { options: ["google", "telegram", "email", "x", "passkey", "phone", "apple"] },
        }),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
        createWallet("io.rabby"),
        createWallet("io.zerion.wallet"),
      ]
    } catch {
      return []
    }
  }, [])

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      router.push("/rewards")
    }
  }

  useEffect(() => {
    if (!hasShownPrompt) {
      setHasShownPrompt(true)
      toast({
        title: "Claim your daily UBI",
        description: "Tap the button below to claim your daily GoodDollar (G$).",
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Claim handled in-app via GoodDollarClaim modal

  useEffect(() => {
    let cancelled = false
    const fetchBalance = async () => {
      if (!address) {
        setGBalance("0")
        return
      }
      setIsLoadingBalance(true)
      try {
        const contract = getContract({ client, chain: celoMainnet, address: goodDollarToken.address, abi: erc20Abi })
        const [raw, decimals] = await Promise.all([
          readContract({ contract, method: "balanceOf", params: [address] }) as Promise<bigint>,
          readContract({ contract, method: "decimals", params: [] }) as Promise<number>,
        ])
        const divisor = 10n ** BigInt(decimals)
        const whole = raw / divisor
        const fraction = raw % divisor
        const fractionStr = fraction.toString().padStart(decimals, "0").replace(/0+$/, "")
        const formatted = fractionStr.length > 0 ? `${whole.toString()}.${fractionStr.slice(0, 4)}` : whole.toString()
        if (!cancelled) setGBalance(formatted)
      } catch (err) {
        console.warn("Failed to fetch G$ balance", err)
        if (!cancelled) setGBalance("0")
      } finally {
        if (!cancelled) setIsLoadingBalance(false)
      }
    }
    fetchBalance()
    return () => { cancelled = true }
  }, [address])
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button onClick={handleBack} className="flex items-center text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="mr-2" /> Back
      </button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">GoodDollar Ecosystem Rewards</h1>
        {!address && (
          <div className="mb-4 flex justify-center">
            <ConnectButton
              client={client}
              appMetadata={{ name: "MovieMeter", url: "https://moviemeter.vercel.app" }}
              chain={celoMainnet}
              connectModal={{ showThirdwebBranding: false, size: "compact" }}
              theme={darkTheme({
                colors: {
                  accentText: "hsl(0, 0%, 100%)",
                  skeletonBg: "hsl(233, 12%, 15%)",
                  connectedButtonBg: "hsl(228, 12%, 8%)",
                },
              })}
              wallets={wallets}
              accountAbstraction={{ chain: celoMainnet, sponsorGas: true }}
              supportedTokens={supportedTokens}
            />
          </div>
        )}
        <div className="mb-4 flex justify-center">
          <GoodDollarClaim address={address} />
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md text-center">
          <h3 className="text-xl font-semibold mb-3">Your Total Rewards</h3>
          <div className="text-3xl font-bold text-blue-400">{address ? (isLoadingBalance ? "…" : `${gBalance} G$`) : "0 G$"}</div>
          <p className="text-zinc-400 mt-2">Total earned from all activities</p>
        </div>
      </div>

      {address ? (
        <div className="bg-zinc-800 rounded-lg p-6 text-zinc-400 mb-8">
          Live GoodDollar balance shown above. Detailed activity will appear here once available.
        </div>
      ) : (
        <div className="bg-zinc-800 rounded-lg p-8 text-center text-zinc-400 text-lg mb-8">
          Connect your wallet to view your GoodDollar balance.
        </div>
      )}

      <div className="mt-8 bg-zinc-800 rounded-lg p-4">
        <p className="text-zinc-300">
          <strong>How it works:</strong> Earn GoodDollar (G$) tokens by participating in community activities, voting on movies, and contributing to the ecosystem. All your rewards from the GoodDollar network will be displayed here.
        </p>
      </div>

    </div>
  )
} 