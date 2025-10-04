import { type NextRequest, NextResponse } from "next/server"
import { fetchRepoContents, parseGitHubUrl } from "@/lib/github-service"
import { estimateAuditWithAI } from "@/lib/ai-estimation-service"

export async function POST(request: NextRequest) {
  try {
    const { githubUrl } = await request.json()

    console.log("[v0] Received estimation request for:", githubUrl)

    // Parse GitHub URL
    const repoInfo = parseGitHubUrl(githubUrl)
    if (!repoInfo) {
      return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
    }

    // Fetch repository contents
    const repoAnalysis = await fetchRepoContents(repoInfo)

    if (repoAnalysis.solidityFiles === 0) {
      return NextResponse.json({ error: "No Solidity files found in repository" }, { status: 400 })
    }

    // Get combined code sample for AI analysis
    const codeSample = repoAnalysis.files
      .map((f) => f.content)
      .join("\n\n")
      .slice(0, 5000) // Limit to 5000 chars

    // Get AI estimation
    const estimation = await estimateAuditWithAI(
      githubUrl,
      codeSample,
      repoAnalysis.totalLines,
      repoAnalysis.solidityFiles,
    )

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
