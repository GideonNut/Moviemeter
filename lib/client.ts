import { createThirdwebClient } from "thirdweb"

// Client-side configuration (safe to use in browser)
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "e56828eab87b58000cb9a78170fac45b",
})

// Server-side configuration (only use in server components or API routes)
export const serverClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "e56828eab87b58000cb9a78170fac45b",
  secretKey: process.env.THIRDWEB_SECRET_KEY,
})
