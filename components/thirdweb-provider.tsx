"use client"

import { ThirdwebProvider } from "thirdweb/react"
import { client } from "@/lib/client"

export function ThirdwebProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  )
}
