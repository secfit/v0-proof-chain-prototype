import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auditRequestId, auditorWallet, auditorName, acceptedPrice, estimatedCompletionDays } = body

    console.log("[Accept Audit] Processing acceptance request:", { auditRequestId, auditorWallet, auditorName, acceptedPrice, estimatedCompletionDays })

    // Get the audit request from Supabase
    const { data: auditRequest, error: fetchError } = await supabase
      .from('audit_requests')
      .select('*')
      .eq('id', auditRequestId)
      .single()

    if (fetchError || !auditRequest) {
      console.error("[Accept Audit] Error fetching audit request:", fetchError)
      return NextResponse.json({ error: "Audit request not found" }, { status: 404 })
    }

    console.log("[Accept Audit] Fetched audit request:", { 
      id: auditRequest.id, 
      status: auditRequest.status, 
      projectName: auditRequest.project_name 
    })

    // Check if audit is still available (handle both cases)
    const status = auditRequest.status?.toLowerCase()
    if (status !== 'available') {
      console.log("[Accept Audit] Audit status is not available:", auditRequest.status)
      return NextResponse.json({ error: "Audit request is no longer available" }, { status: 400 })
    }

    const startDate = new Date().toISOString()
    const estimatedCompletionDate = new Date(Date.now() + estimatedCompletionDays * 24 * 60 * 60 * 1000).toISOString()

    // Create audit owner record in Supabase (without NFT data)
    const { data: auditOwner, error: ownerError } = await supabase
      .from('audit_owners')
      .insert([{
        audit_request_id: auditRequestId,
        auditor_wallet: auditorWallet,
        auditor_name: auditorName,
        accepted_price: acceptedPrice,
        start_date: startDate,
        estimated_completion_date: estimatedCompletionDate,
        status: 'accepted',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (ownerError) {
      console.error("[Accept Audit] Error creating audit owner:", ownerError)
      return NextResponse.json({ error: "Failed to create audit owner record" }, { status: 500 })
    }

    // Update audit request status in Supabase
    const { error: updateError } = await supabase
      .from('audit_requests')
      .update({
        status: 'In Progress',
        start_date: startDate,
        estimated_completion_date: estimatedCompletionDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', auditRequestId)

    if (updateError) {
      console.error("[Accept Audit] Error updating audit request:", updateError)
      return NextResponse.json({ error: "Failed to update audit request status" }, { status: 500 })
    }

    console.log("[Accept Audit] Successfully accepted audit:", auditRequestId)

    return NextResponse.json({
      success: true,
      message: "Audit accepted successfully. You can now start working on the audit.",
      auditOwner,
            auditRequest: {
              id: auditRequestId,
              status: 'In Progress',
              startDate,
              estimatedCompletionDate
            }
    })
  } catch (error: any) {
    console.error("[Accept Audit] Error accepting audit:", error)
    return NextResponse.json({ error: error.message || "Failed to accept audit" }, { status: 500 })
  }
}
