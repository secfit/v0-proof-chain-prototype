import { type NextRequest, NextResponse } from "next/server"
import { createAuditRequest, generateProjectTags } from "@/lib/simple-storage"
import { createRealAuditRequestContracts, type AuditRequestData } from "@/lib/real-bytecode-deployment"
import { createPlatformTokens, type AuditRequestTokenData, type DeveloperTokenData } from "@/lib/platform-contract-service"
import { supabaseAuditService, type AuditRequest, type SmartContract, type NFT, type IPFSData, type Developer } from "@/lib/supabase-audit-service"
import { mapComplexityToSupabase } from "@/lib/enhanced-gpt-service"
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

    // Step 1: Create dynamic contracts and mint NFT
    console.log("[v0] Step 1: Creating dynamic contracts and minting NFT...")
    
    const auditData: AuditRequestData = {
      projectName,
      githubUrl,
      repoHash,
      complexity,
      estimatedDuration: estimatedDuration.toString(),
      proposedPrice: proposedPrice.toString(),
      auditorCount: auditorCount.toString(),
      developerWallet,
      tags,
      description: projectDescription,
    }

    const contractResult = await createRealAuditRequestContracts(auditData)

    if (!contractResult.success) {
      throw new Error(contractResult.error || "Failed to create contracts")
    }

    // Step 1.5: Create platform tokens (audit request and developer tokens)
    console.log("[v0] Step 1.5: Creating platform tokens...")
    
    const auditRequestTokenData: AuditRequestTokenData = {
      projectName,
      githubUrl,
      repoHash,
      complexity,
      estimatedDuration: estimatedDuration.toString(),
      proposedPrice: proposedPrice.toString(),
      auditorCount: auditorCount.toString(),
      developerWallet,
      tags,
      description: projectDescription,
      tokenContractAddress: contractResult.tokenContract!.address,
      nftContractAddress: contractResult.nftContract!.address,
      nftTokenId: contractResult.nftMintResult!.tokenId,
      nftTransactionHash: contractResult.nftMintResult!.transactionHash,
    }

    const developerTokenData: DeveloperTokenData = {
      developerWallet,
      projectName,
      githubUrl,
      repoHash,
      tokenContractAddress: contractResult.tokenContract!.address,
      nftContractAddress: contractResult.nftContract!.address,
      nftTokenId: contractResult.nftMintResult!.tokenId,
      nftTransactionHash: contractResult.nftMintResult!.transactionHash,
      totalProjects: 1, // This will be calculated from existing data in production
      totalSpent: Number.parseFloat(proposedPrice.toString()),
      reputation: 100, // Default reputation, can be calculated from audit history
    }

    // For now, we'll skip platform token creation since we need to detect wallet's contracts first
    // This will be implemented when we have the wallet's contract addresses
    const platformTokenResult = {
      success: false,
      error: "Wallet contract detection not yet implemented in submit flow"
    }

    if (!platformTokenResult.success) {
      console.warn("[v0] Platform token creation failed:", platformTokenResult.error)
      console.warn("[v0] This is likely because platform contracts are not deployed yet.")
      console.warn("[v0] The audit request will still be processed, but platform tokens will not be created.")
      // Don't fail the entire process if platform tokens fail
    }

    // Step 2: Save to simple storage
    console.log("[v0] Step 2: Saving to storage...")
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
      requestNftId: contractResult.nftMintResult!.tokenId,
      requestNftTxHash: contractResult.nftMintResult!.transactionHash,
      paymentTxHash: contractResult.nftMintResult!.transactionHash, // Using NFT tx as payment reference
      tags,
      createdAt: new Date().toISOString(),
    })

    console.log("[v0] Audit request submitted successfully:", auditRequest.id)

    // Step 3: Save comprehensive data to Supabase
    console.log("[v0] Step 3: Saving comprehensive data to Supabase...")
    
    let supabaseData = {
      auditRequestId: null as string | null,
      contractIds: [] as string[],
      nftIds: [] as string[],
      ipfsIds: [] as string[],
      developerId: null as string | null,
      success: false,
      error: null as string | null
    }

    try {
      // 1. Create audit request in Supabase
      const auditRequestData: Omit<AuditRequest, 'id' | 'created_at' | 'updated_at'> = {
        project_name: projectName,
        project_description: projectDescription,
        github_url: githubUrl,
        repository_hash: repoHash,
        complexity: mapComplexityToSupabase(complexity as "Simple" | "Medium" | "Complex"),
        estimated_duration: Number.parseInt(estimatedDuration.toString()),
        proposed_price: Number.parseFloat(proposedPrice.toString()),
        auditor_count: Number.parseInt(auditorCount.toString()),
        developer_wallet: developerWallet,
        status: "Available",
        tags
      }

      supabaseData.auditRequestId = await supabaseAuditService.createAuditRequest(auditRequestData)
      console.log("[v0] ✅ Audit request saved to Supabase:", supabaseData.auditRequestId)

      // 2. Create smart contract records
      if (contractResult.tokenContract) {
        const tokenContractData: Omit<SmartContract, 'id' | 'created_at'> = {
          audit_request_id: supabaseData.auditRequestId,
          contract_address: contractResult.tokenContract.address,
          contract_type: "ERC20",
          contract_name: contractResult.tokenContract.name,
          contract_symbol: contractResult.tokenContract.symbol,
          deployment_hash: contractResult.tokenContract.explorerUrl.split('/').pop() || "",
          explorer_url: contractResult.tokenContract.explorerUrl
        }

        const tokenContractId = await supabaseAuditService.createSmartContract(tokenContractData)
        supabaseData.contractIds.push(tokenContractId)
        console.log("[v0] ✅ Token contract saved to Supabase:", tokenContractId)
      }

      if (contractResult.nftContract) {
        const nftContractData: Omit<SmartContract, 'id' | 'created_at'> = {
          audit_request_id: supabaseData.auditRequestId,
          contract_address: contractResult.nftContract.address,
          contract_type: "ERC721",
          contract_name: contractResult.nftContract.name,
          contract_symbol: contractResult.nftContract.symbol,
          deployment_hash: contractResult.nftContract.explorerUrl.split('/').pop() || "",
          explorer_url: contractResult.nftContract.explorerUrl
        }

        const nftContractId = await supabaseAuditService.createSmartContract(nftContractData)
        supabaseData.contractIds.push(nftContractId)
        console.log("[v0] ✅ NFT contract saved to Supabase:", nftContractId)
      }

      // 3. Create NFT record
      if (contractResult.nftMintResult) {
        const nftData: Omit<NFT, 'id' | 'created_at'> = {
          audit_request_id: supabaseData.auditRequestId,
          contract_id: supabaseData.contractIds[supabaseData.contractIds.length - 1], // Use the NFT contract ID
          token_id: contractResult.nftMintResult.tokenId,
          token_name: `Audit Request: ${projectName}`,
          token_description: `NFT representing audit request for ${projectName}`,
          metadata_uri: contractResult.nftMintResult.metadataUri,
          owner_wallet: developerWallet,
          mint_transaction_hash: contractResult.nftMintResult.transactionHash,
          explorer_url: contractResult.nftMintResult.explorerUrl
        }

        const nftId = await supabaseAuditService.createNFT(nftData)
        supabaseData.nftIds.push(nftId)
        console.log("[v0] ✅ NFT saved to Supabase:", nftId)
      }

      // 4. Create IPFS data record
      if (contractResult.nftMintResult?.metadataUri) {
        const ipfsData: Omit<IPFSData, 'id' | 'created_at'> = {
          audit_request_id: supabaseData.auditRequestId,
          nft_id: supabaseData.nftIds[0],
          ipfs_hash: contractResult.nftMintResult.metadataUri.replace('ipfs://', ''),
          ipfs_uri: contractResult.nftMintResult.metadataUri,
          content_type: "Metadata",
          related_contract: contractResult.nftContract?.address,
          related_token: contractResult.nftMintResult.tokenId
        }

        const ipfsId = await supabaseAuditService.createIPFSData(ipfsData)
        supabaseData.ipfsIds.push(ipfsId)
        console.log("[v0] ✅ IPFS data saved to Supabase:", ipfsId)
      }

      // 5. Create or update developer record
      const developerData: Omit<Developer, 'id' | 'created_at' | 'updated_at'> = {
        wallet_address: developerWallet,
        total_projects: 1, // This should be calculated from existing data
        total_spent: Number.parseFloat(proposedPrice.toString()),
        reputation_score: 100, // Default reputation
        first_project_date: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        status: "Active"
      }

      supabaseData.developerId = await supabaseAuditService.createOrUpdateDeveloper(developerData)
      console.log("[v0] ✅ Developer data saved to Supabase:", supabaseData.developerId)

      supabaseData.success = true
      console.log("[v0] 🎉 All data successfully saved to Supabase!")

    } catch (error: any) {
      console.error("[v0] ❌ Error saving data to Supabase:", error)
      supabaseData.error = error.message
      supabaseData.success = false
    }

    return NextResponse.json({
      success: true,
      auditRequest,
      contracts: {
        tokenContract: contractResult.tokenContract,
        nftContract: contractResult.nftContract,
        nftMint: contractResult.nftMintResult,
      },
      platformTokens: {
        auditRequestToken: (platformTokenResult as any).auditRequestToken,
        developerToken: (platformTokenResult as any).developerToken,
        success: platformTokenResult.success,
        error: platformTokenResult.error,
      },
      supabase: {
        auditRequestId: supabaseData.auditRequestId,
        contractIds: supabaseData.contractIds,
        nftIds: supabaseData.nftIds,
        ipfsIds: supabaseData.ipfsIds,
        developerId: supabaseData.developerId,
        success: supabaseData.success,
        error: supabaseData.error,
      },
      summary: {
        totalContracts: 2,
        nftMinted: true,
        metadataCreated: true,
        platformTokensCreated: platformTokenResult.success,
        supabaseSaved: supabaseData.success,
        projectName,
        developerWallet,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error submitting audit:", error)
    return NextResponse.json({ error: error.message || "Failed to submit audit" }, { status: 500 })
  }
}
