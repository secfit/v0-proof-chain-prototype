import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    // In production, verify the code from Redis/database
    // For demo purposes, we'll accept any 6-digit code
    if (code.length === 6 && /^\d+$/.test(code)) {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
        user: {
          email,
          authMethod: "email",
        },
      })
    }

    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error verifying code:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}
