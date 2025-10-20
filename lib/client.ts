import { createThirdwebClient } from "thirdweb"

// Create the ThirdWeb client with your client ID
// Use hardcoded client ID to avoid server-side rendering issues
const clientId = "30f238d7e42614f3c0fefcc95616ac9c"

// Create client function
function createClient() {
  if (typeof window !== 'undefined') {
    console.log("[Client] Creating Thirdweb client with ID:", clientId)
    const client = createThirdwebClient({
      clientId: clientId,
    })
    console.log("[Client] Thirdweb client created:", client)
    return client
  } else {
    console.log("[Client] Server side - client not created yet")
    return null
  }
}

// Create the client
const client = createClient()

export { client }
