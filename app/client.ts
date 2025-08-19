import { createThirdwebClient } from "thirdweb"

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  console.warn("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set. Using default client ID.")
}

// Handle ethereum object conflicts
if (typeof window !== 'undefined') {
  // Check if ethereum is already defined
  if (window.ethereum && !window.ethereum.isThirdweb) {
    // Store the original ethereum object
    const originalEthereum = window.ethereum
    
    // Create a proxy to handle conflicts
    window.ethereum = new Proxy(originalEthereum, {
      get(target, prop) {
        // If thirdweb tries to set ethereum, allow it
        if (prop === 'isThirdweb') {
          return false
        }
        return target[prop]
      },
      set(target, prop, value) {
        // Allow setting properties but prevent redefinition
        if (prop === 'isThirdweb') {
          return true
        }
        try {
          target[prop] = value
          return true
        } catch (e) {
          // If we can't set the property, just return true to avoid errors
          return true
        }
      }
    })
  }
}

// Client-side configuration (safe to use in browser)
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "e56828eab87b58000cb9a78170fac45b",
}) 