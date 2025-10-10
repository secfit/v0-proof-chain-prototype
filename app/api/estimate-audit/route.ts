import { type NextRequest, NextResponse } from "next/server"
import { analyzeRepositoryWithGPT } from "@/lib/enhanced-gpt-service"

export async function POST(request: NextRequest) {
  try {
    const { githubUrl } = await request.json()

    console.log("[v0] Received estimation request for:", githubUrl)

    // Validate GitHub URL format
    if (!githubUrl || !githubUrl.includes("github.com")) {
      return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
    }

    // Analyze repository using GPT API (no GitHub API rate limits)
    const { repoAnalysis, estimation } = await analyzeRepositoryWithGPT(githubUrl)

    console.log("[v0] Repository analysis completed successfully")

    return NextResponse.json({
      success: true,
      repoAnalysis,
      estimation,
    })
  } catch (error: any) {
    console.error("[v0] Error in estimate-audit API:", error)
    return NextResponse.json({ error: error.message || "Failed to estimate audit" }, { status: 500 })
  }
}
