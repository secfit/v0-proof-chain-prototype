import { NextResponse } from "next/server"
import { listAuditRequests, getAuditResult, listFindings } from "@/lib/airtable-service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Fetch all audit requests
    const allRequests = await listAuditRequests()

    // Enrich with results and findings
    const enrichedAudits = await Promise.all(
      allRequests.map(async (request) => {
        let auditResult = null
        let findings = []

        if (request.status === "Completed") {
          try {
            auditResult = await getAuditResult(request.id!)
            if (auditResult) {
              findings = await listFindings(request.id!)
            }
          } catch (error) {
            console.error("Error fetching audit details:", error)
          }
        }

        return {
          ...request,
          auditResult,
          findingsCount: findings.length,
        }
      }),
    )

    return NextResponse.json({ audits: enrichedAudits })
  } catch (error) {
    console.error("Admin audits API error:", error)
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 })
  }
}
