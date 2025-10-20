import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      auditOwnerId, 
      findings, 
      vulnerabilities, 
      auditNotes, 
      staticAnalysisReports, 
      evidenceFiles, 
      contractHash,
      auditorWallet,
      nftResult // NFT minting results from client-side
    } = body

    console.log("[Submit Audit Results] Processing submission for audit request:", auditOwnerId)

    // First, let's check if the audit request exists
    const { data: auditRequest, error: requestError } = await supabase
      .from('audit_requests')
      .select('id, status, project_name')
      .eq('id', auditOwnerId)
      .single()

    console.log("[Submit Audit Results] Audit request check:", { auditRequest, requestError })

    // Let's also check all audit owners for this audit request
    const { data: allAuditOwners, error: allOwnersError } = await supabase
      .from('audit_owners')
      .select('id, audit_request_id, auditor_wallet, status')
      .eq('audit_request_id', auditOwnerId)

    console.log("[Submit Audit Results] All audit owners for this request:", { allAuditOwners, allOwnersError })

    // Get the audit owner by audit request ID (since frontend passes audit request ID)
    // Handle multiple audit owners by getting the most recent one
    const { data: auditOwners, error: ownerError } = await supabase
      .from('audit_owners')
      .select(`
        *,
        audit_requests (
          id,
          project_name,
          project_description,
          complexity,
          estimated_duration,
          proposed_price,
          developer_wallet,
          github_url,
          repository_hash,
          nfts (token_id)
        )
      `)
      .eq('audit_request_id', auditOwnerId)
      .order('created_at', { ascending: false })

    // Get the most recent audit owner (first in the ordered list)
    const auditOwner = auditOwners && auditOwners.length > 0 ? auditOwners[0] : null

    console.log("[Submit Audit Results] Selected audit owner:", {
      totalOwners: auditOwners?.length || 0,
      selectedOwner: auditOwner ? {
        id: auditOwner.id,
        auditor_wallet: auditOwner.auditor_wallet,
        status: auditOwner.status,
        created_at: auditOwner.created_at
      } : null
    })

    // Warn about duplicate audit owners
    if (auditOwners && auditOwners.length > 1) {
      console.warn("[Submit Audit Results] Multiple audit owners found for this request. Using the most recent one:", auditOwners.length)
    }

    if (ownerError || !auditOwner) {
      console.error("[Submit Audit Results] Error fetching audit owner:", ownerError)
      
      // Provide more specific error message based on what we found
      if (!auditRequest) {
        return NextResponse.json({ error: "Audit request not found. Please check the audit ID." }, { status: 404 })
      } else if (!allAuditOwners || allAuditOwners.length === 0) {
        return NextResponse.json({ error: "No auditor has accepted this audit request yet. The audit must be accepted by an auditor before results can be submitted." }, { status: 404 })
      } else {
        return NextResponse.json({ error: "Audit owner not found for this audit request. Make sure the audit has been accepted by an auditor." }, { status: 404 })
      }
    }

    // NFT minting is now done client-side, we just need to save the results
    console.log("[Submit Audit Results] NFT minting completed client-side, saving results to database...")
    
    if (!nftResult || !nftResult.success) {
      console.error("[Submit Audit Results] No valid NFT result provided from client-side")
      return NextResponse.json({ error: "NFT minting must be completed client-side before saving results" }, { status: 400 })
    }

    console.log("[Submit Audit Results] NFT minted successfully:", nftResult.nftMintResult)
    console.log("[Submit Audit Results] NFT Token ID:", nftResult.nftMintResult?.tokenId, "Type:", typeof nftResult.nftMintResult?.tokenId)
    console.log("[Submit Audit Results] NFT Contract Address:", nftResult.nftContract?.address)
    console.log("[Submit Audit Results] NFT Transaction Hash:", nftResult.nftMintResult?.transactionHash)
    console.log("[Submit Audit Results] Storing to DB - result_nft_id:", nftResult.nftMintResult?.tokenId)

    const completionDate = new Date().toISOString()

    const severityBreakdown = {
      critical: findings.filter((f: any) => f.severity === "critical").length,
      high: findings.filter((f: any) => f.severity === "high").length,
      medium: findings.filter((f: any) => f.severity === "medium").length,
      low: findings.filter((f: any) => f.severity === "low").length,
    }

    // Save audit result to Supabase
    const { data: auditResult, error: resultError } = await supabase
      .from('audit_results')
      .insert([{
        audit_request_id: auditOwner.audit_request_id,
        audit_owner_id: auditOwner.id,
        ipfs_hash: nftResult.nftMintResult?.metadataUri || "",
        evidence_file_hashes: evidenceFiles.join(","),
        findings_count: findings.length,
        vulnerabilities_count: vulnerabilities.filter((v: any) => v.checked).length,
        severity_breakdown: severityBreakdown,
        completion_date: completionDate,
        result_nft_id: nftResult.nftMintResult?.tokenId,
        result_nft_address: nftResult.nftContract?.address,
        result_nft_transaction_hash: nftResult.nftMintResult?.transactionHash,
        result_nft_explorer_url: nftResult.nftMintResult?.explorerUrl,
        result_nft_metadata_uri: nftResult.nftMintResult?.metadataUri,
        status: 'Completed',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (resultError) {
      console.error("[Submit Audit Results] Error creating audit result:", resultError)
      return NextResponse.json({ error: "Failed to create audit result record" }, { status: 500 })
    }

    // Update audit owner status to completed
    const { error: ownerUpdateError } = await supabase
      .from('audit_owners')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', auditOwnerId)

    if (ownerUpdateError) {
      console.error("[Submit Audit Results] Error updating audit owner:", ownerUpdateError)
      return NextResponse.json({ error: "Failed to update audit owner status" }, { status: 500 })
    }

    // Update audit request status to completed
    const { error: requestUpdateError } = await supabase
      .from('audit_requests')
      .update({
        status: 'Completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', auditOwner.audit_request_id)

    if (requestUpdateError) {
      console.error("[Submit Audit Results] Error updating audit request:", requestUpdateError)
      return NextResponse.json({ error: "Failed to update audit request status" }, { status: 500 })
    }

    console.log("[Submit Audit Results] Successfully saved audit results to database:", auditOwnerId)

    return NextResponse.json({
      success: true,
      message: "Audit results saved successfully! NFT was minted client-side.",
      auditResult,
      ipfsHash: nftResult.nftMintResult?.metadataUri || "",
      nft: {
        tokenId: nftResult.nftMintResult?.tokenId,
        transactionHash: nftResult.nftMintResult?.transactionHash,
        contractAddress: nftResult.nftContract?.address,
        explorerUrl: nftResult.nftMintResult?.explorerUrl,
      },
      auditDetails: {
        projectName: auditOwner.audit_requests.project_name,
        auditorName: auditOwner.auditor_name,
        acceptedPrice: auditOwner.accepted_price,
        findingsCount: findings.length,
        vulnerabilitiesCount: vulnerabilities.filter((v: any) => v.checked).length,
        severityBreakdown
      }
    })
  } catch (error: any) {
    console.error("Error submitting audit results:", error)
    return NextResponse.json({ error: error.message || "Failed to submit audit results" }, { status: 500 })
  }
}
