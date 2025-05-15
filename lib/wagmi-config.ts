import { http, createConfig } from "wagmi"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"

// Define Celo Alfajores testnet
export const celoAlfajores = {
  id: 44787,
  name: "Celo Alfajores",
  network: "celo-alfajores",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://alfajores-forno.celo-testnet.org"] },
    public: { http: ["https://alfajores-forno.celo-testnet.org"] },
  },
  blockExplorers: {
    default: { name: "Celo Explorer", url: "https://explorer.celo.org/alfajores" },
  },
}

// Create Wagmi config with error handling
export const wagmiConfig = createConfig({
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http(),
  },
  connectors: [
    // Wrap in try-catch to prevent errors
    (() => {
      try {
        return farcasterFrame()
      } catch (error) {
        console.error("Error creating farcaster connector:", error)
        return farcasterFrame({ shimDisconnect: true })
      }
    })(),
  ],
})
