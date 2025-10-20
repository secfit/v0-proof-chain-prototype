import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = params.id

    console.log("[Audit Details API] Fetching audit details for ID:", auditId)

    // Get the audit request with all related data
    const { data: auditRequest, error: fetchError } = await supabase
      .from('audit_requests')
      .select(`
        *,
        smart_contracts (
          id,
          contract_address,
          contract_type,
          contract_name,
          contract_symbol,
          total_supply,
          decimals,
          deployment_hash,
          explorer_url
        ),
        nfts (
          id,
          token_id,
          token_name,
          token_description,
          metadata_uri,
          owner_wallet,
          mint_transaction_hash,
          explorer_url
        ),
        ipfs_data (
          id,
          ipfs_hash,
          ipfs_uri,
          content_type,
          file_size
        ),
        audit_owners (
          id,
          auditor_wallet,
          auditor_name,
          accepted_price,
          start_date,
          estimated_completion_date,
          owner_nft_id,
          owner_nft_address,
          status,
          created_at
        )
      `)
      .eq('id', auditId)
      .single()

    if (fetchError || !auditRequest) {
      console.error("[Audit Details API] Error fetching audit request:", fetchError)
      return NextResponse.json({ 
        success: false, 
        error: "Audit request not found" 
      }, { status: 404 })
    }

    // Transform data to match expected format
    const transformedAudit = {
      id: auditRequest.id,
      contractHash: auditRequest.smart_contracts?.[0]?.deployment_hash || `0x${auditRequest.id.slice(0, 40)}`,
      status: auditRequest.status?.toLowerCase() || 'available',
      auditPackage: getAuditPackage(auditRequest.complexity, auditRequest.estimated_duration),
      proposedPrice: auditRequest.proposed_price || 0,
      negotiatedPrice: auditRequest.audit_owners?.[0]?.accepted_price || null,
      deadline: calculateDeadline(auditRequest.created_at, auditRequest.estimated_duration),
      complexity: auditRequest.complexity || 'Medium',
      contractType: auditRequest.smart_contracts?.[0]?.contract_type || 'Smart Contract',
      linesOfCode: estimateLinesOfCode(auditRequest.complexity, auditRequest.smart_contracts?.[0]?.contract_type),
      specializations: auditRequest.tags || [],
      sanitized: true,
      obfuscated: false,
      auditorCount: auditRequest.auditor_count || 1,
      aiNegotiation: false,
      projectName: auditRequest.project_name,
      projectDescription: auditRequest.project_description,
      githubUrl: auditRequest.github_url,
      repositoryHash: auditRequest.repository_hash,
      developerWallet: auditRequest.developer_wallet,
      createdAt: auditRequest.created_at,
      updatedAt: auditRequest.updated_at,
      // NFT and contract references
      requestNftId: auditRequest.nfts?.[0]?.token_id,
      contractAddress: auditRequest.smart_contracts?.[0]?.contract_address,
      ipfsHash: auditRequest.ipfs_data?.[0]?.ipfs_hash,
      // Progress tracking
      progress: auditRequest.status === 'in-progress' ? Math.floor(Math.random() * 100) : 
                auditRequest.status === 'completed' ? 100 : 0,
      startDate: auditRequest.audit_owners?.[0]?.start_date || null,
      estimatedCompletionDate: auditRequest.audit_owners?.[0]?.estimated_completion_date || null,
      completedDate: auditRequest.status === 'completed' ? auditRequest.updated_at : null,
      // Auditor information
      auditorWallet: auditRequest.audit_owners?.[0]?.auditor_wallet || null,
      auditorName: auditRequest.audit_owners?.[0]?.auditor_name || null,
      ownerNftId: auditRequest.audit_owners?.[0]?.owner_nft_id || null,
      // Mock findings for completed audits
      findings: auditRequest.status === 'completed' ? {
        critical: Math.floor(Math.random() * 2),
        high: Math.floor(Math.random() * 3),
        medium: Math.floor(Math.random() * 5),
        low: Math.floor(Math.random() * 8)
      } : null
    }

    console.log("[Audit Details API] Successfully fetched audit details:", auditId)

    return NextResponse.json({
      success: true,
      data: transformedAudit
    })

  } catch (error: any) {
    console.error("[Audit Details API] Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal server error" 
    }, { status: 500 })
  }
}

// Helper functions
function getAuditPackage(complexity: string, duration: number): string {
  if (complexity === 'Critical' || duration > 14) return 'Deep'
  if (complexity === 'High' || duration > 7) return 'Standard'
  return 'Quick'
}

function calculateDeadline(createdAt: string, estimatedDuration: number): string {
  const created = new Date(createdAt)
  const deadline = new Date(created.getTime() + (estimatedDuration * 24 * 60 * 60 * 1000))
  const now = new Date()
  
  if (deadline < now) {
    return 'Overdue'
  }
  
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays === 1 ? '1 day' : `${diffDays} days`
}

function estimateLinesOfCode(complexity: string, contractType: string): number {
  const baseLines = {
    'Token': 200,
    'NFT': 400,
    'DeFi': 800,
    'Governance': 600,
    'Marketplace': 1000
  }
  
  const complexityMultiplier = {
    'Low': 0.5,
    'Medium': 1,
    'High': 1.5,
    'Critical': 2
  }
  
  const base = baseLines[contractType as keyof typeof baseLines] || 500
  const multiplier = complexityMultiplier[complexity as keyof typeof complexityMultiplier] || 1
  
  return Math.floor(base * multiplier)
}
