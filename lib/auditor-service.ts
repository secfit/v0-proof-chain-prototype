import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AuditRequest {
  id: string
  contractHash: string
  status: string
  auditPackage: string
  proposedPrice: number
  negotiatedPrice?: number
  deadline: string
  complexity: string
  contractType: string
  linesOfCode: number
  specializations: string[]
  sanitized: boolean
  obfuscated: boolean
  auditorCount: number
  aiNegotiation: boolean
  projectName: string
  projectDescription?: string
  githubUrl?: string
  repositoryHash?: string
  developerWallet: string
  createdAt: string
  updatedAt: string
  requestNftId?: string
  contractAddress?: string
  ipfsHash?: string
  progress?: number
  startDate?: string
  completedDate?: string
  findings?: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export interface AuditorProfile {
  walletAddress: string
  totalAudits: number
  completedAudits: number
  inProgressAudits: number
  totalEarnings: number
  averageRating: number
  reputationScore: number
  completionRate: number
  topSpecializations: string[]
  stakedTokens: number
  joinDate: string
  lastActivity: string
  recentActivity: any[]
  averageCompletionTime: number
  qualityScore: number
  isVerified: boolean
  verificationLevel: string
}

export interface AuditFilters {
  status?: string
  complexity?: string
  specialization?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  auditorWallet?: string
}

export class AuditorService {
  /**
   * Fetch audit requests with optional filters
   */
  static async getAuditRequests(filters: AuditFilters = {}): Promise<{
    success: boolean
    data?: AuditRequest[]
    error?: string
  }> {
    try {
      const params = new URLSearchParams()
      
      if (filters.status && filters.status !== 'All') {
        params.append('status', filters.status)
      }
      if (filters.complexity && filters.complexity !== 'All') {
        params.append('complexity', filters.complexity)
      }
      if (filters.specialization && filters.specialization !== 'All') {
        params.append('specialization', filters.specialization)
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString())
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString())
      }
      if (filters.limit) {
        params.append('limit', filters.limit.toString())
      }
      if (filters.auditorWallet) {
        params.append('auditorWallet', filters.auditorWallet)
      }

      const url = `/api/audits?${params.toString()}`
      console.log('[AuditorService] Fetching from URL:', url)
      
      const response = await fetch(url)
      const result = await response.json()

      console.log('[AuditorService] Response status:', response.status)
      console.log('[AuditorService] Response data:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch audit requests')
      }

      return {
        success: true,
        data: result.data.audits
      }
    } catch (error: any) {
      console.error('[AuditorService] Error fetching audit requests:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Fetch auditor profile by wallet address
   */
  static async getAuditorProfile(walletAddress: string): Promise<{
    success: boolean
    data?: AuditorProfile
    error?: string
  }> {
    try {
      const response = await fetch(`/api/auditor-profile?wallet=${walletAddress}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch auditor profile')
      }

      return {
        success: true,
        data: result.data
      }
    } catch (error: any) {
      console.error('[AuditorService] Error fetching auditor profile:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Accept an audit request
   */
  static async acceptAuditRequest(
    auditRequestId: string,
    auditorWallet: string,
    auditorName: string,
    acceptedPrice: number,
    estimatedCompletionDays: number
  ): Promise<{
    success: boolean
    data?: any
    error?: string
  }> {
    try {
      const response = await fetch('/api/accept-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auditRequestId,
          auditorWallet,
          auditorName,
          acceptedPrice,
          estimatedCompletionDays
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to accept audit request')
      }

      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      console.error('[AuditorService] Error accepting audit request:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get audit statistics
   */
  static calculateAuditStats(audits: AuditRequest[]): {
    total: number
    available: number
    inProgress: number
    completed: number
    averageEarnings: number
  } {
    const total = audits.length
    const available = audits.filter(a => a.status === 'available').length
    const inProgress = audits.filter(a => a.status === 'in-progress').length
    const completed = audits.filter(a => a.status === 'completed').length
    
    const totalEarnings = audits
      .filter(a => a.status === 'completed')
      .reduce((sum, audit) => sum + (audit.negotiatedPrice || audit.proposedPrice), 0)
    
    const averageEarnings = completed > 0 ? totalEarnings / completed : 0

    return {
      total,
      available,
      inProgress,
      completed,
      averageEarnings: Math.round(averageEarnings)
    }
  }

  /**
   * Filter audits based on search criteria
   */
  static filterAudits(
    audits: AuditRequest[],
    searchQuery: string,
    statusFilter: string,
    complexityFilter: string,
    specializationFilter: string
  ): AuditRequest[] {
    return audits.filter(audit => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        audit.contractType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.contractHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.specializations.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        )

      // Status filter
      const matchesStatus = statusFilter === 'All' || audit.status === statusFilter

      // Complexity filter
      const matchesComplexity = complexityFilter === 'All' || audit.complexity === complexityFilter

      // Specialization filter
      const matchesSpecialization = specializationFilter === 'All' || 
        audit.specializations.includes(specializationFilter)

      return matchesSearch && matchesStatus && matchesComplexity && matchesSpecialization
    })
  }

  /**
   * Get available specializations from audits
   */
  static getAvailableSpecializations(audits: AuditRequest[]): string[] {
    const allSpecializations = audits.flatMap(audit => audit.specializations)
    const uniqueSpecializations = [...new Set(allSpecializations)]
    return uniqueSpecializations.sort()
  }

  /**
   * Get complexity levels from audits
   */
  static getAvailableComplexities(audits: AuditRequest[]): string[] {
    const complexities = audits.map(audit => audit.complexity)
    const uniqueComplexities = [...new Set(complexities)]
    return uniqueComplexities.sort()
  }
}
