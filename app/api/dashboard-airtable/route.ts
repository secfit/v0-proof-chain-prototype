import { type NextRequest, NextResponse } from "next/server"
import { airtableAuditService } from "@/lib/airtable-audit-service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    console.log("[v0] Dashboard Airtable API called for wallet:", walletAddress)

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Fetch comprehensive dashboard data from Airtable
    const dashboardData = await fetchDashboardDataFromAirtable(walletAddress)

    return NextResponse.json({
      success: true,
      data: dashboardData,
      source: "airtable"
    })

  } catch (error: any) {
    console.error("[v0] Dashboard Airtable API error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch dashboard data from Airtable" 
    }, { status: 500 })
  }
}

async function fetchDashboardDataFromAirtable(walletAddress: string): Promise<any> {
  console.log(`[v0] Fetching dashboard data from Airtable for wallet: ${walletAddress}`)

  try {
    // Get audit requests for the developer
    const auditRequests = await airtableAuditService.getAuditRequestsByDeveloper(walletAddress)
    console.log(`[v0] Found ${auditRequests.length} audit requests in Airtable`)

    // Get dashboard statistics
    const stats = await airtableAuditService.getDashboardStats(walletAddress)
    console.log(`[v0] Dashboard stats:`, stats)

    // Get detailed data for each audit request
    const enrichedProjects = await Promise.all(
      auditRequests.map(async (request: any) => {
        try {
          // Get detailed audit request data with all related records
          const details = await airtableAuditService.getAuditRequestWithDetails(request.id)
          
          // Calculate progress based on status
          let progress = 0
          if (request.Status === "Available") {
            progress = 0
          } else if (request.Status === "In Progress") {
            progress = 50
          } else if (request.Status === "Completed") {
            progress = 100
          }

          // Get findings from audit results (if available)
          let findings = null
          if (request.Status === "Completed" && details.nfts.length > 0) {
            // Try to fetch audit results from IPFS metadata
            try {
              const nft = details.nfts[0]
              if (nft['Metadata URI']) {
                const response = await fetch(nft['Metadata URI'].replace('ipfs://', 'https://ipfs.io/ipfs/'))
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
            name: request['Project Name'],
            description: request['Project Description'],
            commitmentHash: request['Repository Hash']?.substring(0, 12) + "...",
            status: request.Status?.toLowerCase().replace(" ", "-"),
            auditPackage: request.Complexity,
            auditor: "Pending Assignment", // This would come from audit owner data
            auditorWallet: undefined,
            progress,
            findings,
            createdAt: new Date(request['Created At']).toLocaleDateString(),
            verifiedAt: request.Status === "Completed" ? new Date(request['Updated At']).toLocaleDateString() : null,
            requestNftId: details.nfts[0]?.['Token ID'],
            ownerNftId: undefined,
            resultNftId: undefined,
            ipfsEvidenceHash: details.ipfsData[0]?.['IPFS Hash'],
            reportFileUrl: undefined,
            githubUrl: request['GitHub URL'],
            proposedPrice: request['Proposed Price'],
            acceptedPrice: request['Proposed Price'], // Same as proposed for now
            tags: request.Tags || [],
            // Additional Airtable-specific data
            airtable: {
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
            name: request['Project Name'],
            description: request['Project Description'],
            commitmentHash: request['Repository Hash']?.substring(0, 12) + "...",
            status: request.Status?.toLowerCase().replace(" ", "-"),
            auditPackage: request.Complexity,
            auditor: "Pending Assignment",
            auditorWallet: undefined,
            progress: 0,
            findings: null,
            createdAt: new Date(request['Created At']).toLocaleDateString(),
            verifiedAt: null,
            requestNftId: undefined,
            ownerNftId: undefined,
            resultNftId: undefined,
            ipfsEvidenceHash: undefined,
            reportFileUrl: undefined,
            githubUrl: request['GitHub URL'],
            proposedPrice: request['Proposed Price'],
            acceptedPrice: request['Proposed Price'],
            tags: request.Tags || [],
            airtable: {
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

    return {
      projects: enrichedProjects,
      stats,
      walletAddress,
      totalRecords: auditRequests.length,
      lastUpdated: new Date().toISOString()
    }

  } catch (error) {
    console.error(`[v0] Error fetching dashboard data from Airtable:`, error)
    throw error
  }
}
