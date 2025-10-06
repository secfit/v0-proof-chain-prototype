import { createThirdwebClient } from "thirdweb"

// Create the ThirdWeb client with your client ID
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_UD || "",
})
