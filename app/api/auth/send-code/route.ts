import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // In production, send this via email service (SendGrid, AWS SES, etc.)
    // For demo purposes, we'll log it and return it
    console.log(`[v0] Verification code for ${email}: ${code}`)

    // Store the code in memory (in production, use Redis or database)
    // For demo, we'll return it directly
    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      // Remove this in production - only for demo
      code: code,
    })
  } catch (error) {
    console.error("[v0] Error sending verification code:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
