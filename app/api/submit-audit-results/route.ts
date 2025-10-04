import { type NextRequest, NextResponse } from "next/server"
import { uploadToIPFS } from "@/lib/ipfs-service"
import { mintAuditResultNFT, createAuditResultMetadata } from "@/lib/nft-service"
import { createAuditResult, updateAuditOwner, getAuditOwner } from "@/lib/airtable-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auditOwnerId, findings, vulnerabilities, auditNotes, staticAnalysisReports, evidenceFiles, contractHash } =
      body

    // Get the audit owner to link NFTs
    const auditOwner = await getAuditOwner(auditOwnerId)
    if (!auditOwner) {
      return NextResponse.json({ error: "Audit owner not found" }, { status: 404 })
    }

    // Prepare evidence package for IPFS
    const evidencePackage = {
      contractHash,
      findings,
      vulnerabilities,
      auditNotes,
      staticAnalysisReports,
      timestamp: new Date().toISOString(),
      auditorSignature: "0x...", // Would be actual signature in production
    }

    // Upload evidence to IPFS
    const ipfsHash = await uploadToIPFS(evidencePackage)
    console.log("[v0] Evidence uploaded to IPFS:", ipfsHash)

    // Upload individual evidence files if provided
    const evidenceFileHashes = []
    if (evidenceFiles && evidenceFiles.length > 0) {
      for (const file of evidenceFiles) {
        const fileHash = await uploadToIPFS(file)
        evidenceFileHashes.push(fileHash)
      }
    }

    const completionDate = new Date().toISOString()

    const severityBreakdown = {
      critical: findings.filter((f: any) => f.severity === "critical").length,
      high: findings.filter((f: any) => f.severity === "high").length,
      medium: findings.filter((f: any) => f.severity === "medium").length,
      low: findings.filter((f: any) => f.severity === "low").length,
    }

    // Create NFT metadata with reference to Audit Owner NFT
    const nftMetadata = createAuditResultMetadata({
      auditRequestNftId: auditOwner.auditRequestId || "0",
      auditOwnerNftId: auditOwner.ownerNftId || "0",
      contractHash,
      ipfsHash,
      findingsCount: findings.length,
      vulnerabilitiesCount: vulnerabilities.filter((v: any) => v.checked).length,
      severityBreakdown,
      completionDate,
    })

    // Mint Audit Result NFT
    const nftResult = await mintAuditResultNFT(nftMetadata, auditOwner.auditorWallet)

    // Save to Airtable
    const auditResult = await createAuditResult({
      auditRequestId: auditOwner.auditRequestId,
      auditOwnerId,
      ipfsHash,
      evidenceFileHashes: evidenceFileHashes.join(","),
      findingsCount: findings.length,
      vulnerabilitiesCount: vulnerabilities.filter((v: any) => v.checked).length,
      severityBreakdown,
      completionDate,
      resultNftId: nftResult.tokenId,
      resultNftAddress: nftResult.transactionHash,
      status: "Completed",
      createdAt: new Date().toISOString(),
    })

    // Update audit owner status
    await updateAuditOwner(auditOwnerId, {
      status: "Completed",
      completionDate,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      auditResult,
      ipfsHash,
      nft: {
        tokenId: nftResult.tokenId,
        transactionHash: nftResult.transactionHash,
        explorerUrl: `https://apechain.calderaexplorer.xyz/tx/${nftResult.transactionHash}`,
      },
    })
  } catch (error: any) {
    console.error("Error submitting audit results:", error)
    return NextResponse.json({ error: error.message || "Failed to submit audit results" }, { status: 500 })
  }
}
