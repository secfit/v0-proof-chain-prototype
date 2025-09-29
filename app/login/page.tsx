"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const { requestCode, verifyCode, isVerified } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [stage, setStage] = useState<"email" | "code">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onRequest = async () => {
    setError(null)
    setLoading(true)
    try {
      await requestCode(email)
      setStage("code")
    } catch (e) {
      setError("Failed to request code")
    } finally {
      setLoading(false)
    }
  }

  const onVerify = async () => {
    setError(null)
    setLoading(true)
    try {
      const ok = await verifyCode(code)
      if (ok) router.push("/")
      else setError("Invalid code. Use 123456 in demo.")
    } catch (e) {
      setError("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your email, then confirm the verification code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "email" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <Button className="w-full mt-2" onClick={onRequest} disabled={!email || loading}>
                {loading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          )}
          {stage === "code" && (
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-digit code" />
              <Button className="w-full mt-2" onClick={onVerify} disabled={!code || loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          )}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {isVerified && <div className="text-sm text-green-600">Verified</div>}
        </CardContent>
      </Card>
    </div>
  )
}



