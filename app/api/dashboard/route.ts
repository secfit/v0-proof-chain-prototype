import { NextResponse } from "next/server"
import { listAuditRequests, getAuditResult, listFindings } from "@/lib/airtable-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    console.log("[v0] Dashboard API called with wallet:", walletAddress)

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    let auditRequests = []
    try {
      // Fetch all audit requests for this developer
      const filter = `{developerWallet} = '${walletAddress}'`
      console.log("[v0] Fetching audit requests with filter:", filter)
      auditRequests = await listAuditRequests(filter)
      console.log("[v0] Found audit requests:", auditRequests.length)
    } catch (error) {
      console.error("[v0] Error fetching audit requests:", error)
      // Return empty data instead of failing completely
      return NextResponse.json({
        projects: [],
        stats: {
          totalProjects: 0,
          completedAudits: 0,
          inProgressAudits: 0,
          pendingAudits: 0,
          totalSpent: 0,
        },
        error: "Unable to fetch data from Airtable. Please check your configuration.",
      })
    }

    // Enrich each audit request with owner and result data
    const enrichedProjects = await Promise.all(
      auditRequests.map(async (request) => {
        // Get audit owner if exists
        let auditOwner = null
        if (request.status !== "Available") {
          try {
            // Find audit owner by auditRequestId
            const ownerFilter = `{auditRequestId} = '${request.id}'`
            const owners = await listAuditRequests(ownerFilter)
            if (owners.length > 0) {
              auditOwner = owners[0]
            }
          } catch (error) {
            console.error("Error fetching audit owner:", error)
          }
        }

        // Get audit result if completed
        let auditResult = null
        let findings = []
        if (request.status === "Completed") {
          try {
            auditResult = await getAuditResult(request.id!)
            if (auditResult) {
              findings = await listFindings(request.id!)
            }
          } catch (error) {
            console.error("Error fetching audit result:", error)
          }
        }

        // Calculate progress based on status
        let progress = 0
        if (request.status === "Available") {
          progress = 10
        } else if (request.status === "In Progress") {
          progress = 50
        } else if (request.status === "Completed") {
          progress = 100
        }

        return {
          id: request.id,
          name: request.projectName,
          description: request.projectDescription,
          commitmentHash: request.repoHash.substring(0, 12) + "...",
          status: request.status.toLowerCase().replace(" ", "-"),
          auditPackage: request.complexity,
          auditor: auditOwner?.auditorName || "Pending Assignment",
          auditorWallet: auditOwner?.auditorWallet,
          progress,
          findings: auditResult
            ? {
                critical: auditResult.severityBreakdown.critical,
                high: auditResult.severityBreakdown.high,
                medium: auditResult.severityBreakdown.medium,
                low: auditResult.severityBreakdown.low,
              }
            : null,
          createdAt: new Date(request.createdAt).toLocaleDateString(),
          verifiedAt: auditResult ? new Date(auditResult.completedAt).toLocaleDateString() : null,
          requestNftId: request.requestNftId,
          ownerNftId: auditOwner?.ownerNftId,
          resultNftId: auditResult?.resultNftId,
          ipfsEvidenceHash: auditResult?.ipfsEvidenceHash,
          reportFileUrl: auditResult?.reportFileUrl,
          githubUrl: request.githubUrl,
          proposedPrice: request.proposedPrice,
          acceptedPrice: auditOwner?.acceptedPrice,
          tags: request.tags,
        }
      }),
    )

    // Calculate statistics
    const stats = {
      totalProjects: enrichedProjects.length,
      completedAudits: enrichedProjects.filter((p) => p.status === "completed").length,
      inProgressAudits: enrichedProjects.filter((p) => p.status === "in-progress").length,
      pendingAudits: enrichedProjects.filter((p) => p.status === "available").length,
      totalSpent: enrichedProjects.reduce((sum, p) => sum + (p.acceptedPrice || p.proposedPrice), 0),
    }

    return NextResponse.json({
      projects: enrichedProjects,
      stats,
    })
  } catch (error) {
    console.error("[v0] Dashboard API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
