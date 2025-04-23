import { createThirdwebClient } from "thirdweb"

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "5762e4f1365956c24064f7d7554beba6",
})

