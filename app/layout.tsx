import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { ThirdwebProviderWrapper } from "@/components/thirdweb-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "ProofChain - ZKP Smart Contract Auditing",
  description: "Privacy-first smart contract auditing marketplace powered by Zero-Knowledge Proofs",
  generator: "ProofChain",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThirdwebProviderWrapper>
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthProvider>
        </ThirdwebProviderWrapper>
        <Analytics />
      </body>
    </html>
  )
}
