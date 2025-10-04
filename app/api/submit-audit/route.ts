import { type NextRequest, NextResponse } from "next/server"
import { createAuditRequest, generateProjectTags } from "@/lib/airtable-service"
import { mintAuditRequestNFT, createAuditRequestMetadata } from "@/lib/nft-service"
import { createHash } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      projectName,
      projectDescription,
      githubUrl,
      complexity,
      estimatedDuration,
      proposedPrice,
      auditorCount,
      developerWallet,
      repoAnalysis,
      aiEstimation,
    } = body

    // Generate repository hash
    const repoHash = createHash("sha256")
      .update(githubUrl + Date.now())
      .digest("hex")

    // Generate project tags
    const tags = generateProjectTags(repoAnalysis, aiEstimation)

    // Create NFT metadata
    const nftMetadata = createAuditRequestMetadata({
      projectName,
      githubUrl,
      repoHash,
      complexity,
      estimatedDuration,
      proposedPrice,
      auditorCount,
      developerWallet,
      tags,
    })

    // Mint Audit Request NFT
    const nftResult = await mintAuditRequestNFT(nftMetadata, developerWallet)

    // Save to Airtable
    const auditRequest = await createAuditRequest({
      projectName,
      projectDescription,
      githubUrl,
      repoHash,
      complexity,
      estimatedDuration,
      proposedPrice,
      auditorCount,
      developerWallet,
      status: "Available",
      requestNftId: nftResult.tokenId,
      requestNftAddress: nftResult.transactionHash,
      tags,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      auditRequest,
      nft: {
        tokenId: nftResult.tokenId,
        transactionHash: nftResult.transactionHash,
        explorerUrl: `https://apechain.calderaexplorer.xyz/tx/${nftResult.transactionHash}`,
      },
    })
  } catch (error: any) {
    console.error("Error submitting audit:", error)
    return NextResponse.json({ error: error.message || "Failed to submit audit" }, { status: 500 })
  }
}
