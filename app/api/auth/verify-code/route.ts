import { NextResponse } from "next/server"
import { completeEmailAuth, getWalletInfo } from "@/lib/thirdweb-auth-service"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    console.log(`[Thirdweb Auth] Verifying code for: ${email}`)

    // Use official Thirdweb API to complete email authentication
    const authResponse = await completeEmailAuth(email, code)

    // Get additional wallet information
    const walletInfo = await getWalletInfo(authResponse.token)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        email,
        walletAddress: authResponse.walletAddress,
        authMethod: "email",
        token: authResponse.token,
        isNewUser: authResponse.isNewUser,
        profiles: walletInfo.profiles,
      },
    })
  } catch (error) {
    console.error("[Thirdweb Auth] Error verifying code:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to verify code" 
    }, { status: 500 })
  }
}
