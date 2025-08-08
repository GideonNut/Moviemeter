import { createThirdwebClient } from "thirdweb"

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  console.warn("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set. Using default client ID.")
}

// Client-side configuration (safe to use in browser)
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "e56828eab87b58000cb9a78170fac45b",
}) 