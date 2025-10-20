import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const complexity = searchParams.get('complexity')
    const specialization = searchParams.get('specialization')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const auditorWallet = searchParams.get('auditorWallet')
    const limit = searchParams.get('limit') || '50'

    console.log("[Audits API] Fetching audit requests with filters:", {
      status, complexity, specialization, minPrice, maxPrice, auditorWallet, limit
    })

    // Build query with audit_owners join
    let query = supabase
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
          status
        )
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    // Apply filters with auditor-specific logic
    if (auditorWallet) {
      // For connected auditor: show Available + their own audits (In Progress, Completed, Cancelled)
      // Use proper Supabase syntax for OR conditions
      query = query.or(`status.eq.Available,status.in.(In Progress,Completed,Cancelled)`)
      // Then filter for auditor-specific non-available audits
      // We'll handle this in post-processing since Supabase doesn't support complex nested OR conditions easily
    } else {
      // For non-connected users: show only Available audits
      query = query.eq('status', 'Available')
    }

    // Apply additional filters
    if (status && status !== 'All') {
      if (auditorWallet) {
        // For connected auditor, respect status filter
        if (status === 'Available') {
          query = query.eq('status', 'Available')
        } else {
          // For other statuses, filter by status (auditor filtering handled in post-processing)
          query = query.eq('status', status)
        }
      } else {
        // For non-connected users, only show Available
        query = query.eq('status', 'Available')
      }
    }

    if (complexity && complexity !== 'All') {
      query = query.eq('complexity', complexity)
    }

    if (specialization && specialization !== 'All') {
      query = query.contains('tags', [specialization])
    }

    if (minPrice) {
      query = query.gte('proposed_price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('proposed_price', parseFloat(maxPrice))
    }

    const { data: auditRequests, error } = await query

    if (error) {
      console.error("[Audits API] Supabase error:", error)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch audit requests" 
      }, { status: 500 })
    }

    // Post-process filtering for auditor-specific logic
    let filteredAuditRequests = auditRequests || []
    
    if (auditorWallet) {
      // Filter out non-available audits that don't belong to the connected auditor
      filteredAuditRequests = auditRequests?.filter((audit: any) => {
        // Always include Available audits
        if (audit.status === 'Available') {
          return true
        }
        
        // For non-available audits, only include if they belong to the connected auditor
        const auditOwner = audit.audit_owners?.[0]
        return auditOwner?.auditor_wallet === auditorWallet
      }) || []
    }

    // Transform data to match expected format
    const transformedAudits = filteredAuditRequests?.map((audit: any) => {
      const auditOwner = audit.audit_owners?.[0] // Get the first (and should be only) audit owner
      
      return {
        id: audit.id,
        contractHash: audit.smart_contracts?.[0]?.deployment_hash || `0x${audit.id.slice(0, 40)}`,
        status: audit.status || 'Available',
        auditPackage: getAuditPackage(audit.complexity, audit.estimated_duration),
        proposedPrice: audit.proposed_price || 0,
        negotiatedPrice: auditOwner?.accepted_price || null,
        deadline: calculateDeadline(audit.created_at, audit.estimated_duration),
        complexity: audit.complexity || 'Medium',
        contractType: audit.smart_contracts?.[0]?.contract_type || 'Smart Contract',
        linesOfCode: estimateLinesOfCode(audit.complexity, audit.smart_contracts?.[0]?.contract_type),
        specializations: audit.tags || [],
        sanitized: true, // All contracts are sanitized
        obfuscated: false, // Can be enhanced later
        auditorCount: audit.auditor_count || 1,
        aiNegotiation: false, // Can be enhanced later
        projectName: audit.project_name,
        projectDescription: audit.project_description,
        githubUrl: audit.github_url,
        repositoryHash: audit.repository_hash,
        developerWallet: audit.developer_wallet,
        createdAt: audit.created_at,
        updatedAt: audit.updated_at,
        // NFT and contract references
        requestNftId: audit.nfts?.[0]?.token_id,
        contractAddress: audit.smart_contracts?.[0]?.contract_address,
        ipfsHash: audit.ipfs_data?.[0]?.ipfs_hash,
        // Progress tracking
        progress: audit.status === 'In Progress' ? Math.floor(Math.random() * 100) : 
                  audit.status === 'Completed' ? 100 : 0,
        startDate: auditOwner?.start_date || (audit.status === 'In Progress' ? audit.created_at : null),
        completedDate: audit.status === 'Completed' ? audit.updated_at : null,
        estimatedCompletionDate: auditOwner?.estimated_completion_date,
        // Auditor information
        auditorWallet: auditOwner?.auditor_wallet,
        auditorName: auditOwner?.auditor_name,
        // Mock findings for completed audits
        findings: audit.status === 'Completed' ? {
          critical: Math.floor(Math.random() * 2),
          high: Math.floor(Math.random() * 3),
          medium: Math.floor(Math.random() * 5),
          low: Math.floor(Math.random() * 8)
        } : null
      }
    }) || []

    console.log(`[Audits API] Successfully fetched ${transformedAudits.length} audit requests`)

    return NextResponse.json({
      success: true,
      data: {
        audits: transformedAudits,
        total: transformedAudits.length,
        filters: {
          status,
          complexity,
          specialization,
          minPrice,
          maxPrice
        }
      }
    })

  } catch (error: any) {
    console.error("[Audits API] Error:", error)
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
