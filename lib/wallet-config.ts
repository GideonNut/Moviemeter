import { inAppWallet, createWallet } from "thirdweb/wallets"
import { celoMainnet } from "./blockchain-service"

// Safe wallet creation that handles conflicts
export function createSafeWallet(type: string) {
  try {
    switch (type) {
      case "io.metamask":
        return createWallet("io.metamask")
      case "com.coinbase.wallet":
        return createWallet("com.coinbase.wallet")
      case "me.rainbow":
        return createWallet("me.rainbow")
      case "io.rabby":
        return createWallet("io.rabby")
      case "io.zerion.wallet":
        return createWallet("io.zerion.wallet")
      default:
        console.warn(`Unknown wallet type: ${type}`)
        return null
    }
  } catch (error) {
    console.warn(`Failed to create wallet ${type}:`, error)
    return null
  }
}

// Get all available wallets with error handling
export function getAvailableWallets() {
  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "telegram",
          "farcaster",
          "email",
          "x",
          "passkey",
          "phone",
          "apple",
        ],
      },
      chain: celoMainnet,
    })
  ]

  // Add external wallets with error handling
  const externalWalletTypes = [
    "io.metamask",
    "com.coinbase.wallet", 
    "me.rainbow",
    "io.rabby",
    "io.zerion.wallet"
  ]

  externalWalletTypes.forEach(type => {
    const wallet = createSafeWallet(type)
    if (wallet) {
      wallets.push(wallet)
    }
  })

  return wallets
}

// Check if ethereum object is available and handle conflicts
export function checkEthereumAvailability() {
  if (typeof window === 'undefined') return false
  
  try {
    // Check if ethereum is already defined
    if (window.ethereum) {
      // If it's already defined, don't redefine it
      return true
    }
    return false
  } catch (error) {
    console.warn('Error checking ethereum availability:', error)
    return false
  }
}

// Safe ethereum object access
export function getEthereumObject() {
  if (typeof window === 'undefined') return null
  
  try {
    return window.ethereum
  } catch (error) {
    console.warn('Error accessing ethereum object:', error)
    return null
  }
}
