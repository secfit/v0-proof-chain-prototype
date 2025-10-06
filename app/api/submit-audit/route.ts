import { type NextRequest, NextResponse } from "next/server"
import { createAuditRequest, generateProjectTags } from "@/lib/simple-storage"
import { processERC20Payment, mintAuditRequestNFT } from "@/lib/thirdweb-contracts"
import { createHash } from "crypto"

export const dynamic = "force-dynamic"

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

    console.log("[v0] Submitting audit request for:", projectName)

    // Generate repository hash
    const repoHash = createHash("sha256")
      .update(githubUrl + Date.now())
      .digest("hex")

    // Generate project tags
    const tags = generateProjectTags(repoAnalysis, aiEstimation)

    // Step 1: Process ERC-20 payment ($0.000055)
    console.log("[v0] Step 1: Processing initial engagement payment...")
    const paymentTxHash = await processERC20Payment(null) // Pass account when available

    // Step 2: Mint ERC-721 Audit Request NFT
    console.log("[v0] Step 2: Minting Audit Request NFT...")
    const nftResult = await mintAuditRequestNFT(null, {
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

    // Step 3: Save to simple storage
    console.log("[v0] Step 3: Saving to storage...")
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
      requestNftTxHash: nftResult.transactionHash,
      paymentTxHash,
      tags,
      createdAt: new Date().toISOString(),
    })

    console.log("[v0] Audit request submitted successfully:", auditRequest.id)

    return NextResponse.json({
      success: true,
      auditRequest,
      payment: {
        amount: "0.000055",
        currency: "USD",
        transactionHash: paymentTxHash,
        explorerUrl: `https://apechain.calderaexplorer.xyz/tx/${paymentTxHash}`,
      },
      nft: {
        tokenId: nftResult.tokenId,
        transactionHash: nftResult.transactionHash,
        explorerUrl: `https://apechain.calderaexplorer.xyz/tx/${nftResult.transactionHash}`,
        metadata: {
          projectName,
          complexity,
          proposedPrice,
          auditorCount,
          tags,
        },
      },
    })
  } catch (error: any) {
    console.error("[v0] Error submitting audit:", error)
    return NextResponse.json({ error: error.message || "Failed to submit audit" }, { status: 500 })
  }
}
