import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch findings for a specific audit
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const auditRequestId = searchParams.get('auditRequestId')
    const auditorWallet = searchParams.get('auditorWallet')

    if (!auditRequestId) {
      return NextResponse.json({ 
        success: false, 
        error: "auditRequestId is required" 
      }, { status: 400 })
    }

    console.log("[Audit Findings API] Fetching findings for audit:", auditRequestId)

    let query = supabase
      .from('audit_findings')
      .select('*')
      .eq('audit_request_id', auditRequestId)
      .order('created_at', { ascending: false })

    // If auditorWallet is provided, filter by auditor
    if (auditorWallet) {
      query = query.eq('auditor_wallet', auditorWallet)
    }

    const { data: findings, error } = await query

    if (error) {
      console.error("[Audit Findings API] Supabase error:", error)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch findings" 
      }, { status: 500 })
    }

    console.log(`[Audit Findings API] Successfully fetched ${findings?.length || 0} findings`)

    return NextResponse.json({
      success: true,
      data: findings || []
    })

  } catch (error: any) {
    console.error("[Audit Findings API] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}

// POST - Create a new finding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      auditRequestId,
      auditorWallet,
      auditorName,
      title,
      description,
      severity,
      finding_category,
      fileName,
      lineNumber,
      functionName,
      vulnerabilityType,
      impact,
      recommendation,
      proofOfConcept,
      evidenceFiles,
      codeSnippets,
      tags,
      priority,
      estimatedEffort,
      external_references = []
    } = body

    console.log("[Audit Findings API] Creating new finding:", {
      auditRequestId,
      auditorWallet,
      title,
      severity,
      finding_category
    })

    // Validate required fields
    if (!auditRequestId || !auditorWallet || !title || !description || !severity || !finding_category) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: auditRequestId, auditorWallet, title, description, severity, finding_category" 
      }, { status: 400 })
    }

    // Validate severity
    if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid severity. Must be one of: low, medium, high, critical" 
      }, { status: 400 })
    }

    // Create the finding record
    const { data: finding, error } = await supabase
      .from('audit_findings')
      .insert([{
        audit_request_id: auditRequestId,
        auditor_wallet: auditorWallet,
        auditor_name: auditorName,
        title,
        description,
        severity,
        finding_category: finding_category,
        file_name: fileName,
        line_number: lineNumber ? parseInt(lineNumber) : null,
        function_name: functionName,
        vulnerability_type: vulnerabilityType,
        impact,
        recommendation,
        proof_of_concept: proofOfConcept,
        evidence_files: evidenceFiles || [],
        code_snippets: codeSnippets || [],
        tags: tags || [],
        finding_priority: priority || 1,
        estimated_effort: estimatedEffort,
        external_references: external_references || [],
        finding_status: 'open',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error("[Audit Findings API] Supabase error:", error)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to create finding" 
      }, { status: 500 })
    }

    console.log("[Audit Findings API] Successfully created finding:", finding.id)

    return NextResponse.json({
      success: true,
      data: finding,
      message: "Finding created successfully"
    })

  } catch (error: any) {
    console.error("[Audit Findings API] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}

// PUT - Update an existing finding
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { findingId, ...updateData } = body

    if (!findingId) {
      return NextResponse.json({ 
        success: false, 
        error: "findingId is required" 
      }, { status: 400 })
    }

    console.log("[Audit Findings API] Updating finding:", findingId)

    // Add updated_at timestamp
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    }

    const { data: finding, error } = await supabase
      .from('audit_findings')
      .update(dataToUpdate)
      .eq('id', findingId)
      .select()
      .single()

    if (error) {
      console.error("[Audit Findings API] Supabase error:", error)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to update finding" 
      }, { status: 500 })
    }

    console.log("[Audit Findings API] Successfully updated finding:", findingId)

    return NextResponse.json({
      success: true,
      data: finding,
      message: "Finding updated successfully"
    })

  } catch (error: any) {
    console.error("[Audit Findings API] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}

// DELETE - Delete a finding
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const findingId = searchParams.get('findingId')

    if (!findingId) {
      return NextResponse.json({ 
        success: false, 
        error: "findingId is required" 
      }, { status: 400 })
    }

    console.log("[Audit Findings API] Deleting finding:", findingId)

    const { error } = await supabase
      .from('audit_findings')
      .delete()
      .eq('id', findingId)

    if (error) {
      console.error("[Audit Findings API] Supabase error:", error)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to delete finding" 
      }, { status: 500 })
    }

    console.log("[Audit Findings API] Successfully deleted finding:", findingId)

    return NextResponse.json({
      success: true,
      message: "Finding deleted successfully"
    })

  } catch (error: any) {
    console.error("[Audit Findings API] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}
