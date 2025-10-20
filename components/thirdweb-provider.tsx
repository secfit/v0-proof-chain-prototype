"use client"

import { ThirdwebProvider } from "thirdweb/react"
import { client } from "@/lib/thirdweb-config"

export function ThirdwebProviderWrapper({ children }: { children: React.ReactNode }) {
  // Debug: Log client information
  console.log("[ThirdwebProvider] Client:", client)
  console.log("[ThirdwebProvider] Client ID:", client?.clientId)
  console.log("[ThirdwebProvider] Client type:", typeof client)

  if (!client) {
    console.error("[ThirdwebProvider] Client is undefined!")
    return <div>Error: Thirdweb client not initialized</div>
  }

  if (!client.clientId) {
    console.error("[ThirdwebProvider] Client ID is undefined!")
    return <div>Error: Thirdweb client ID not set</div>
  }

  try {
    return (
      <ThirdwebProvider client={client}>
        {children}
      </ThirdwebProvider>
    )
  } catch (error) {
    console.error("[ThirdwebProvider] Error creating provider:", error)
    return <div>Error: Failed to create Thirdweb provider</div>
  }
}
