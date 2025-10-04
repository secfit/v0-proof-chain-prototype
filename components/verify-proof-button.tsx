"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface VerifyProofButtonProps {
  hash?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  showIcon?: boolean
}

export function VerifyProofButton({
  hash,
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
}: VerifyProofButtonProps) {
  const router = useRouter()

  const handleVerify = () => {
    if (hash) {
      router.push(`/verification?hash=${hash}`)
    } else {
      router.push("/verification")
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleVerify}>
      {showIcon && <Shield className="w-4 h-4 mr-2" />}
      Verify Proof
    </Button>
  )
}
