"use client"

import React from "react"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { AuthProvider } from "@/components/auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThirdwebProvider>
  )
}


