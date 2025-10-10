"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Mail, Wallet, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/lib/client"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [mounted, setMounted] = useState(false)
  const account = useActiveAccount()

  // Email auth state
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
        console.log("Verification code sent to:", email)
      } else {
        setError(data.error || "Failed to send verification code")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      const data = await response.json()

      if (response.ok) {
        // Thirdweb auth provides both email and wallet address
        const userData = {
          email: data.user.email,
          walletAddress: data.user.walletAddress,
          authMethod: "email" as const,
          verifiedAt: new Date().toISOString(),
          token: data.user.token,
          isNewUser: data.user.isNewUser,
          profiles: data.user.profiles,
        }

        login(userData)
        router.push("/dashboard")
      } else {
        setError(data.error || "Invalid verification code")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletLogin = () => {
    if (account?.address) {
      // Check if user already has an email verified
      const existingUser = localStorage.getItem("proofchain_user")
      let userData = {
        walletAddress: account.address,
        authMethod: "wallet" as const,
        verifiedAt: new Date().toISOString(),
      }

      if (existingUser) {
        const parsedUser = JSON.parse(existingUser)
        if (parsedUser.email) {
          userData = {
            ...userData,
            email: parsedUser.email,
            authMethod: "both" as const,
          }
        }
      }

      login(userData)
      router.push("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to ProofChain</h1>
        <p className="text-muted-foreground">Sign in to access your audit dashboard</p>
      </div>

      {/* Login Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Choose your preferred authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </TabsTrigger>
            </TabsList>

            {/* Email Authentication */}
            <TabsContent value="email" className="space-y-4">
              {!codeSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button onClick={handleSendCode} disabled={isLoading || !email} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Code sent to <span className="font-medium">{email}</span>
                    </p>
                    <p className="text-xs text-primary font-medium">
                      Check your email for the verification code
                    </p>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="space-y-2">
                    <Button
                      onClick={handleVerifyCode}
                      disabled={isLoading || verificationCode.length !== 6}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" onClick={() => setCodeSent(false)} className="w-full">
                      Use different email
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Wallet Authentication */}
            <TabsContent value="wallet" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to sign in securely with your blockchain address.
                </p>
                {mounted ? (
                  <div className="flex flex-col items-center space-y-4">
                    <ConnectButton client={client} />
                    {account?.address && (
                      <Button onClick={handleWalletLogin} className="w-full">
                        Continue with Wallet
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
