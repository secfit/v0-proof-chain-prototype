import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("[Audit Results API] Fetching audit results for ID:", id)

    // Fetch audit results with related data
    const { data: auditResults, error } = await supabase
      .from('audit_results')
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
          created_at,
          nfts (
            id,
            token_id,
            token_name,
            token_description,
            metadata_uri,
            owner_wallet,
            mint_transaction_hash,
            explorer_url
          )
        ),
        audit_owners (
          id,
          auditor_wallet,
          auditor_name,
          accepted_price,
          start_date,
          estimated_completion_date,
          status
        )
      `)
      .eq('audit_request_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("[Audit Results API] Supabase error:", error)
      return NextResponse.json({
        success: false,
        error: "Failed to fetch audit results"
      }, { status: 500 })
    }

    if (!auditResults || auditResults.length === 0) {
      console.error("[Audit Results API] No audit results found for ID:", id)
      return NextResponse.json({
        success: false,
        error: "Audit results not found"
      }, { status: 404 })
    }

    // Select the most recent audit result (first in the ordered list)
    const auditResult = auditResults[0]
    
    // Log warning if there are multiple results
    if (auditResults.length > 1) {
      console.warn(`[Audit Results API] Found ${auditResults.length} audit results for ID ${id}, selecting the most recent one`)
    }

    // Debug NFT data
    console.log("[Audit Results API] Raw audit result from DB:", auditResult)
    console.log("[Audit Results API] Using audit_request_id as Token ID:", auditResult.audit_request_id, "Type:", typeof auditResult.audit_request_id)
    console.log("[Audit Results API] NFT Contract Address from DB:", auditResult.result_nft_address)
    console.log("[Audit Results API] NFT Transaction Hash from DB:", auditResult.result_nft_transaction_hash)

    // Fetch audit findings for this audit
    const { data: findings, error: findingsError } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('audit_request_id', id)
      .order('created_at', { ascending: false })

    if (findingsError) {
      console.error("[Audit Results API] Error fetching findings:", findingsError)
    }

    // Transform data for frontend
    const transformedResult = {
      // Audit Result Information
      id: auditResult.id,
      auditRequestId: auditResult.audit_request_id,
      ipfsHash: auditResult.ipfs_hash,
      evidenceFileHashes: auditResult.evidence_file_hashes,
      findingsCount: auditResult.findings_count,
      vulnerabilitiesCount: auditResult.vulnerabilities_count,
      severityBreakdown: auditResult.severity_breakdown,
      completionDate: auditResult.completion_date,
      status: auditResult.status,
      
      // NFT Information
      resultNft: {
        id: auditResult.audit_request_id, // Use audit_request_id as Token ID
        address: auditResult.result_nft_address,
        transactionHash: auditResult.result_nft_transaction_hash,
        explorerUrl: auditResult.result_nft_explorer_url,
        metadataUri: auditResult.result_nft_metadata_uri,
      },
      
      // Audit Request Information
      auditRequest: {
        id: auditResult.audit_requests.id,
        projectName: auditResult.audit_requests.project_name,
        projectDescription: auditResult.audit_requests.project_description,
        complexity: auditResult.audit_requests.complexity,
        estimatedDuration: auditResult.audit_requests.estimated_duration,
        proposedPrice: auditResult.audit_requests.proposed_price,
        developerWallet: auditResult.audit_requests.developer_wallet,
        githubUrl: auditResult.audit_requests.github_url,
        repositoryHash: auditResult.audit_requests.repository_hash,
        createdAt: auditResult.audit_requests.created_at,
        requestNft: auditResult.audit_requests.nfts,
      },
      
      // Auditor Information
      auditor: {
        id: auditResult.audit_owners.id,
        wallet: auditResult.audit_owners.auditor_wallet,
        name: auditResult.audit_owners.auditor_name,
        acceptedPrice: auditResult.audit_owners.accepted_price,
        startDate: auditResult.audit_owners.start_date,
        estimatedCompletionDate: auditResult.audit_owners.estimated_completion_date,
        status: auditResult.audit_owners.status,
      },
      
      // Findings
      findings: findings || [],
    }

    console.log("[Audit Results API] Successfully fetched audit results for ID:", id)

    return NextResponse.json({
      success: true,
      data: transformedResult
    })

  } catch (error: any) {
    console.error("[Audit Results API] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}
