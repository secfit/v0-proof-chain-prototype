import { NextResponse } from "next/server"
import { listAuditRequests } from "@/lib/airtable-service"

export async function GET() {
  try {
    console.log("[v0] Admin stats API called")

    // Fetch all audit requests
    let allRequests = []
    try {
      allRequests = await listAuditRequests()
      console.log("[v0] Found total audit requests:", allRequests.length)
    } catch (error) {
      console.error("[v0] Error fetching audit requests:", error)
      // Return empty stats instead of failing completely
      return NextResponse.json({
        stats: {
          totalAudits: 0,
          availableAudits: 0,
          inProgressAudits: 0,
          completedAudits: 0,
          cancelledAudits: 0,
          totalRevenue: 0,
          averagePrice: 0,
          complexityBreakdown: {
            Quick: 0,
            Standard: 0,
            Deep: 0,
          },
        },
        recentActivity: [],
        error: "Unable to fetch data from Airtable. Please check your configuration.",
      })
    }

    // Calculate statistics
    const stats = {
      totalAudits: allRequests.length,
      availableAudits: allRequests.filter((r) => r.status === "Available").length,
      inProgressAudits: allRequests.filter((r) => r.status === "In Progress").length,
      completedAudits: allRequests.filter((r) => r.status === "Completed").length,
      cancelledAudits: allRequests.filter((r) => r.status === "Cancelled").length,
      totalRevenue: allRequests.reduce((sum, r) => sum + r.proposedPrice, 0),
      averagePrice:
        allRequests.length > 0 ? allRequests.reduce((sum, r) => sum + r.proposedPrice, 0) / allRequests.length : 0,
      complexityBreakdown: {
        Quick: allRequests.filter((r) => r.complexity === "Quick").length,
        Standard: allRequests.filter((r) => r.complexity === "Standard").length,
        Deep: allRequests.filter((r) => r.complexity === "Deep").length,
      },
    }

    // Recent activity (last 10 audits)
    const recentActivity = allRequests
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        projectName: r.projectName,
        status: r.status,
        complexity: r.complexity,
        proposedPrice: r.proposedPrice,
        createdAt: r.createdAt,
        developerWallet: r.developerWallet,
      }))

    return NextResponse.json({
      stats,
      recentActivity,
    })
  } catch (error) {
    console.error("[v0] Admin stats API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
