import { type NextRequest, NextResponse } from "next/server"
import { supabaseAuditService } from "@/lib/supabase-audit-service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    console.log("[v0] Dashboard Supabase API called for wallet:", walletAddress)

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Fetch comprehensive dashboard data from Supabase
    const dashboardData = await fetchDashboardDataFromSupabase(walletAddress)

    return NextResponse.json({
      success: true,
      data: dashboardData,
      source: "supabase"
    })

  } catch (error: any) {
    console.error("[v0] Dashboard Supabase API error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch dashboard data from Supabase" 
    }, { status: 500 })
  }
}

async function fetchDashboardDataFromSupabase(walletAddress: string): Promise<any> {
  console.log(`[v0] Fetching comprehensive dashboard data from Supabase for wallet: ${walletAddress}`)

  try {
    // Get audit requests for the developer
    const auditRequests = await supabaseAuditService.getAuditRequestsByDeveloper(walletAddress)
    console.log(`[v0] Found ${auditRequests.length} audit requests in Supabase`)

    // Get dashboard statistics
    const stats = await supabaseAuditService.getDashboardStats(walletAddress)
    console.log(`[v0] Dashboard stats:`, stats)

    // Get developer profile information
    const developerProfile = await supabaseAuditService.getDeveloperProfile(walletAddress)
    console.log(`[v0] Developer profile:`, developerProfile)

    // Get all smart contracts related to this wallet
    const allContracts = await supabaseAuditService.getAllContractsByWallet(walletAddress)
    console.log(`[v0] Found ${allContracts.length} contracts`)

    // Get all NFTs related to this wallet
    const allNFTs = await supabaseAuditService.getAllNFTsByWallet(walletAddress)
    console.log(`[v0] Found ${allNFTs.length} NFTs`)

    // Get all IPFS data related to this wallet
    const allIPFSData = await supabaseAuditService.getAllIPFSDataByWallet(walletAddress)
    console.log(`[v0] Found ${allIPFSData.length} IPFS records`)

    // Get detailed data for each audit request
    const enrichedProjects = await Promise.all(
      auditRequests.map(async (request: any) => {
        try {
          // Get detailed audit request data with all related records
          const details = await supabaseAuditService.getAuditRequestWithDetails(request.id)
          
          // Calculate progress based on status
          let progress = 0
          if (request.status === "Available") {
            progress = 0
          } else if (request.status === "In Progress") {
            progress = 50
          } else if (request.status === "Completed") {
            progress = 100
          }

          // Get findings from audit results (if available)
          let findings = null
          if (request.status === "Completed" && details.nfts.length > 0) {
            // Try to fetch audit results from IPFS metadata
            try {
              const nft = details.nfts[0]
              if (nft.metadata_uri) {
                const response = await fetch(nft.metadata_uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
                if (response.ok) {
                  const metadata = await response.json()
                  if (metadata.attributes) {
                    // Extract findings from metadata attributes
                    const severityBreakdown = {
                      critical: 0,
                      high: 0,
                      medium: 0,
                      low: 0
                    }
                    
                    // Look for findings in attributes
                    metadata.attributes.forEach((attr: any) => {
                      if (attr.trait_type === "Critical Findings") {
                        severityBreakdown.critical = parseInt(attr.value) || 0
                      } else if (attr.trait_type === "High Findings") {
                        severityBreakdown.high = parseInt(attr.value) || 0
                      } else if (attr.trait_type === "Medium Findings") {
                        severityBreakdown.medium = parseInt(attr.value) || 0
                      } else if (attr.trait_type === "Low Findings") {
                        severityBreakdown.low = parseInt(attr.value) || 0
                      }
                    })
                    
                    findings = severityBreakdown
                  }
                }
              }
            } catch (error) {
              console.warn(`[v0] Could not fetch findings for audit request ${request.id}:`, error)
            }
          }

          return {
            id: request.id,
            name: request.project_name,
            description: request.project_description,
            commitmentHash: request.repository_hash?.substring(0, 12) + "...",
            status: request.status?.toLowerCase().replace(" ", "-"),
            auditPackage: request.complexity,
            auditor: "Pending Assignment", // This would come from audit owner data
            auditorWallet: undefined,
            progress,
            findings,
            createdAt: new Date(request.created_at).toLocaleDateString(),
            verifiedAt: request.status === "Completed" ? new Date(request.updated_at).toLocaleDateString() : null,
            requestNftId: details.nfts[0]?.token_id,
            ownerNftId: undefined,
            resultNftId: undefined,
            ipfsEvidenceHash: details.ipfsData[0]?.ipfs_hash,
            reportFileUrl: undefined,
            githubUrl: request.github_url,
            proposedPrice: request.proposed_price,
            acceptedPrice: request.proposed_price, // Same as proposed for now
            tags: request.tags || [],
            // Additional Supabase-specific data
            supabase: {
              auditRequestId: request.id,
              contracts: details.contracts,
              nfts: details.nfts,
              ipfsData: details.ipfsData
            }
          }
        } catch (error) {
          console.error(`[v0] Error enriching audit request ${request.id}:`, error)
          return {
            id: request.id,
            name: request.project_name,
            description: request.project_description,
            commitmentHash: request.repository_hash?.substring(0, 12) + "...",
            status: request.status?.toLowerCase().replace(" ", "-"),
            auditPackage: request.complexity,
            auditor: "Pending Assignment",
            auditorWallet: undefined,
            progress: 0,
            findings: null,
            createdAt: new Date(request.created_at).toLocaleDateString(),
            verifiedAt: null,
            requestNftId: undefined,
            ownerNftId: undefined,
            resultNftId: undefined,
            ipfsEvidenceHash: undefined,
            reportFileUrl: undefined,
            githubUrl: request.github_url,
            proposedPrice: request.proposed_price,
            acceptedPrice: request.proposed_price,
            tags: request.tags || [],
            supabase: {
              auditRequestId: request.id,
              contracts: [],
              nfts: [],
              ipfsData: []
            }
          }
        }
      })
    )

    console.log(`[v0] Enriched ${enrichedProjects.length} projects with detailed data`)

    // Calculate comprehensive wallet statistics
    const walletStats = {
      ...stats,
      totalContracts: allContracts.length,
      totalNFTs: allNFTs.length,
      totalIPFSFiles: allIPFSData.length,
      totalSpent: auditRequests.reduce((sum: number, req: any) => sum + (req.proposed_price || 0), 0),
      reputationScore: developerProfile?.reputation_score || 100,
      memberSince: developerProfile?.created_at || null,
      lastActivity: developerProfile?.last_activity || null
    }

    return {
      // Core project data
      projects: enrichedProjects,
      stats: walletStats,
      
      // Wallet information
      walletAddress,
      developerProfile,
      
      // Comprehensive data collections
      contracts: allContracts,
      nfts: allNFTs,
      ipfsData: allIPFSData,
      
      // Metadata
      totalRecords: auditRequests.length,
      lastUpdated: new Date().toISOString(),
      dataSource: "supabase"
    }

  } catch (error) {
    console.error(`[v0] Error fetching dashboard data from Supabase:`, error)
    throw error
  }
}
