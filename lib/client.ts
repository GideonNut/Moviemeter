import { createThirdwebClient } from "thirdweb"

// Use the environment variable for the client ID
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
})
