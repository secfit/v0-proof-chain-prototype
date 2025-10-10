import { NextResponse } from "next/server"
import { initiateEmailAuth } from "@/lib/thirdweb-auth-service"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    console.log(`[Thirdweb Auth] Initiating email authentication for: ${email}`)

    // Use official Thirdweb API to initiate email authentication
    const authResponse = await initiateEmailAuth(email)

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      challenge: authResponse.challenge,
      expiresAt: authResponse.expiresAt,
    })
  } catch (error) {
    console.error("[Thirdweb Auth] Error sending verification code:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to send verification code" 
    }, { status: 500 })
  }
}
