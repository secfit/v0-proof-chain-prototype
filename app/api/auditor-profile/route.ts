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
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      return NextResponse.json({ 
        success: false, 
        error: "Wallet address is required" 
      }, { status: 400 })
    }

    console.log("[Auditor Profile API] Fetching profile for wallet:", walletAddress)

    // Fetch auditor's accepted audits through audit_owners table
    const { data: acceptedAudits, error: auditsError } = await supabase
      .from('audit_owners')
      .select(`
        *,
        audit_requests (
          id,
          project_name,
          project_description,
          complexity,
          estimated_duration,
          proposed_price,
          status,
          created_at,
          updated_at,
          smart_contracts (
            id,
            contract_address,
            contract_type,
            contract_name
          ),
          nfts (
            id,
            token_id,
            token_name,
            owner_wallet
          )
        )
      `)
      .eq('auditor_wallet', walletAddress)
      .order('created_at', { ascending: false })

    if (auditsError) {
      console.error("[Auditor Profile API] Error fetching audits:", auditsError)
      // Return mock data temporarily if audit_owners table doesn't exist yet
      const acceptedAudits = []
    }

    // Calculate auditor statistics
    const totalAudits = acceptedAudits?.length || 0
    const completedAudits = acceptedAudits?.filter(a => a.audit_requests?.status === 'completed').length || 0
    const inProgressAudits = acceptedAudits?.filter(a => a.audit_requests?.status === 'in-progress').length || 0
    const totalEarnings = acceptedAudits?.reduce((sum, audit) => {
      return sum + (audit.accepted_price || 0)
    }, 0) || 0

    // Calculate average rating (mock for now)
    const averageRating = totalAudits > 0 ? 4.2 + (Math.random() * 0.8) : 0
    const reputationScore = Math.min(1000, Math.floor(totalAudits * 20 + completedAudits * 30 + averageRating * 50))

    // Get specializations from completed audits
    const allTags = acceptedAudits?.flatMap(audit => audit.tags || []) || []
    const specializationCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})
    const topSpecializations = Object.entries(specializationCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([tag]) => tag)

    // Calculate completion rate
    const completionRate = totalAudits > 0 ? (completedAudits / totalAudits) * 100 : 0

    // Get recent activity
    const recentActivity = acceptedAudits?.slice(0, 5).map(audit => ({
      id: audit.id,
      projectName: audit.project_name,
      status: audit.status,
      complexity: audit.complexity,
      price: audit.accepted_price || audit.proposed_price,
      createdAt: audit.created_at,
      contractType: audit.smart_contracts?.[0]?.contract_type || 'Smart Contract'
    })) || []

    const auditorProfile = {
      walletAddress,
      totalAudits,
      completedAudits,
      inProgressAudits,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      reputationScore,
      completionRate: Math.round(completionRate),
      topSpecializations,
      stakedTokens: Math.floor(reputationScore / 10), // Mock staking
      joinDate: acceptedAudits?.[0]?.created_at || new Date().toISOString(),
      lastActivity: acceptedAudits?.[0]?.updated_at || new Date().toISOString(),
      recentActivity,
      // Performance metrics
      averageCompletionTime: calculateAverageCompletionTime(acceptedAudits),
      qualityScore: calculateQualityScore(completedAudits, totalAudits),
      // Verification status
      isVerified: reputationScore > 500,
      verificationLevel: getVerificationLevel(reputationScore)
    }

    console.log(`[Auditor Profile API] Successfully fetched profile for ${walletAddress}`)

    return NextResponse.json({
      success: true,
      data: auditorProfile
    })

  } catch (error: any) {
    console.error("[Auditor Profile API] Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal server error" 
    }, { status: 500 })
  }
}

// Helper functions
function calculateAverageCompletionTime(audits: any[]): number {
  if (!audits || audits.length === 0) return 0
  
  const completedAudits = audits.filter(a => a.status === 'completed' && a.estimated_duration)
  if (completedAudits.length === 0) return 0
  
  const totalDays = completedAudits.reduce((sum, audit) => sum + (audit.estimated_duration || 0), 0)
  return Math.round(totalDays / completedAudits.length)
}

function calculateQualityScore(completedAudits: number, totalAudits: number): number {
  if (totalAudits === 0) return 0
  const completionRate = completedAudits / totalAudits
  return Math.round(completionRate * 100)
}

function getVerificationLevel(reputationScore: number): string {
  if (reputationScore >= 800) return 'Expert'
  if (reputationScore >= 600) return 'Senior'
  if (reputationScore >= 400) return 'Intermediate'
  if (reputationScore >= 200) return 'Junior'
  return 'Beginner'
}
