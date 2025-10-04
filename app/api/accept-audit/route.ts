import { type NextRequest, NextResponse } from "next/server"
import { createAuditOwner, getAuditRequest, updateAuditRequest } from "@/lib/airtable-service"
import { mintAuditOwnerNFT, createAuditOwnerMetadata } from "@/lib/nft-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auditRequestId, auditorWallet, auditorName, acceptedPrice, estimatedCompletionDays } = body

    // Get the audit request to link NFTs
    const auditRequest = await getAuditRequest(auditRequestId)
    if (!auditRequest) {
      return NextResponse.json({ error: "Audit request not found" }, { status: 404 })
    }

    const startDate = new Date().toISOString()
    const estimatedCompletionDate = new Date(Date.now() + estimatedCompletionDays * 24 * 60 * 60 * 1000).toISOString()

    // Create NFT metadata with reference to Audit Request NFT
    const nftMetadata = createAuditOwnerMetadata({
      auditRequestNftId: auditRequest.requestNftId || "0",
      auditorWallet,
      auditorName,
      acceptedPrice,
      startDate,
      estimatedCompletionDate,
    })

    // Mint Audit Owner NFT
    const nftResult = await mintAuditOwnerNFT(nftMetadata, auditorWallet)

    // Save to Airtable
    const auditOwner = await createAuditOwner({
      auditRequestId,
      auditorWallet,
      auditorName,
      acceptedPrice,
      startDate,
      estimatedCompletionDate,
      ownerNftId: nftResult.tokenId,
      ownerNftAddress: nftResult.transactionHash,
      status: "Accepted",
      createdAt: new Date().toISOString(),
    })

    // Update audit request status
    await updateAuditRequest(auditRequestId, {
      status: "In Progress",
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      auditOwner,
      nft: {
        tokenId: nftResult.tokenId,
        transactionHash: nftResult.transactionHash,
        explorerUrl: `https://apechain.calderaexplorer.xyz/tx/${nftResult.transactionHash}`,
      },
    })
  } catch (error: any) {
    console.error("Error accepting audit:", error)
    return NextResponse.json({ error: error.message || "Failed to accept audit" }, { status: 500 })
  }
}
