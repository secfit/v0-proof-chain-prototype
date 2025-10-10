// Supabase Service for ProofChain Audit System
// Much simpler than Airtable!

import { createClient } from '@supabase/supabase-js'

// Types for our database
interface AuditRequest {
  id?: string
  project_name: string
  project_description: string
  github_url: string
  repository_hash: string
  complexity: string
  estimated_duration: number
  proposed_price: number
  auditor_count: number
  developer_wallet: string
  status: string
  tags: string[]
  created_at?: string
  updated_at?: string
}

interface SmartContract {
  id?: string
  audit_request_id: string
  contract_address: string
  contract_type: string
  contract_name: string
  contract_symbol: string
  total_supply?: number
  decimals?: number
  deployment_hash: string
  explorer_url: string
  created_at?: string
}

interface NFT {
  id?: string
  audit_request_id: string
  contract_id: string
  token_id: string
  token_name: string
  token_description: string
  metadata_uri: string
  owner_wallet: string
  mint_transaction_hash: string
  explorer_url: string
  created_at?: string
}

interface IPFSData {
  id?: string
  audit_request_id: string
  nft_id?: string
  ipfs_hash: string
  ipfs_uri: string
  content_type: string
  file_size?: number
  related_contract?: string
  related_token?: string
  created_at?: string
}

interface Developer {
  id?: string
  wallet_address: string
  total_projects: number
  total_spent: number
  reputation_score: number
  first_project_date: string
  last_activity: string
  status: string
  created_at?: string
  updated_at?: string
}

class SupabaseAuditService {
  private supabase: any

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[Supabase] URL or Anon Key not configured')
      return
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  // Create audit request
  async createAuditRequest(data: Omit<AuditRequest, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    console.log('[Supabase] Creating audit request:', data.project_name)
    
    const { data: result, error } = await this.supabase
      .from('audit_requests')
      .insert([data])
      .select('id')
      .single()

    if (error) {
      console.error('[Supabase] Error creating audit request:', error)
      throw new Error(`Failed to create audit request: ${error.message}`)
    }

    console.log('[Supabase] Audit request created with ID:', result.id)
    return result.id
  }

  // Create smart contract
  async createSmartContract(data: Omit<SmartContract, 'id' | 'created_at'>): Promise<string> {
    console.log('[Supabase] Creating smart contract:', data.contract_name)
    
    const { data: result, error } = await this.supabase
      .from('smart_contracts')
      .insert([data])
      .select('id')
      .single()

    if (error) {
      console.error('[Supabase] Error creating smart contract:', error)
      throw new Error(`Failed to create smart contract: ${error.message}`)
    }

    console.log('[Supabase] Smart contract created with ID:', result.id)
    return result.id
  }

  // Create NFT
  async createNFT(data: Omit<NFT, 'id' | 'created_at'>): Promise<string> {
    console.log('[Supabase] Creating NFT:', data.token_name)
    
    const { data: result, error } = await this.supabase
      .from('nfts')
      .insert([data])
      .select('id')
      .single()

    if (error) {
      console.error('[Supabase] Error creating NFT:', error)
      throw new Error(`Failed to create NFT: ${error.message}`)
    }

    console.log('[Supabase] NFT created with ID:', result.id)
    return result.id
  }

  // Create IPFS data
  async createIPFSData(data: Omit<IPFSData, 'id' | 'created_at'>): Promise<string> {
    console.log('[Supabase] Creating IPFS data:', data.ipfs_hash)
    
    const { data: result, error } = await this.supabase
      .from('ipfs_data')
      .insert([data])
      .select('id')
      .single()

    if (error) {
      console.error('[Supabase] Error creating IPFS data:', error)
      throw new Error(`Failed to create IPFS data: ${error.message}`)
    }

    console.log('[Supabase] IPFS data created with ID:', result.id)
    return result.id
  }

  // Create or update developer
  async createOrUpdateDeveloper(data: Omit<Developer, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    console.log('[Supabase] Creating/updating developer:', data.wallet_address)
    
    // First, try to find existing developer
    const { data: existingDeveloper } = await this.supabase
      .from('developers')
      .select('id')
      .eq('wallet_address', data.wallet_address)
      .single()

    if (existingDeveloper) {
      // Update existing developer
      const { data: result, error } = await this.supabase
        .from('developers')
        .update({
          total_projects: data.total_projects,
          total_spent: data.total_spent,
          reputation_score: data.reputation_score,
          last_activity: data.last_activity,
          status: data.status
        })
        .eq('id', existingDeveloper.id)
        .select('id')
        .single()

      if (error) {
        console.error('[Supabase] Error updating developer:', error)
        throw new Error(`Failed to update developer: ${error.message}`)
      }

      console.log('[Supabase] Developer updated:', result.id)
      return result.id
    } else {
      // Create new developer
      const { data: result, error } = await this.supabase
        .from('developers')
        .insert([data])
        .select('id')
        .single()

      if (error) {
        console.error('[Supabase] Error creating developer:', error)
        throw new Error(`Failed to create developer: ${error.message}`)
      }

      console.log('[Supabase] Developer created with ID:', result.id)
      return result.id
    }
  }

  // Get audit requests by developer
  async getAuditRequestsByDeveloper(walletAddress: string): Promise<AuditRequest[]> {
    console.log('[Supabase] Fetching audit requests for developer:', walletAddress)
    
    const { data, error } = await this.supabase
      .from('audit_requests')
      .select('*')
      .eq('developer_wallet', walletAddress)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Supabase] Error fetching audit requests:', error)
      return []
    }

    console.log('[Supabase] Found', data.length, 'audit requests')
    return data
  }

  // Get audit request with all related data
  async getAuditRequestWithDetails(auditRequestId: string): Promise<any> {
    console.log('[Supabase] Fetching audit request details:', auditRequestId)
    
    // Get audit request
    const { data: auditRequest, error: auditError } = await this.supabase
      .from('audit_requests')
      .select('*')
      .eq('id', auditRequestId)
      .single()

    if (auditError) {
      console.error('[Supabase] Error fetching audit request:', auditError)
      throw new Error(`Failed to fetch audit request: ${auditError.message}`)
    }

    // Get related smart contracts
    const { data: contracts, error: contractsError } = await this.supabase
      .from('smart_contracts')
      .select('*')
      .eq('audit_request_id', auditRequestId)

    if (contractsError) {
      console.error('[Supabase] Error fetching contracts:', contractsError)
    }

    // Get related NFTs
    const { data: nfts, error: nftsError } = await this.supabase
      .from('nfts')
      .select('*')
      .eq('audit_request_id', auditRequestId)

    if (nftsError) {
      console.error('[Supabase] Error fetching NFTs:', nftsError)
    }

    // Get related IPFS data
    const { data: ipfsData, error: ipfsError } = await this.supabase
      .from('ipfs_data')
      .select('*')
      .eq('audit_request_id', auditRequestId)

    if (ipfsError) {
      console.error('[Supabase] Error fetching IPFS data:', ipfsError)
    }

    return {
      auditRequest,
      contracts: contracts || [],
      nfts: nfts || [],
      ipfsData: ipfsData || []
    }
  }

  // Get dashboard statistics
  async getDashboardStats(walletAddress: string): Promise<any> {
    console.log('[Supabase] Fetching dashboard stats for:', walletAddress)
    
    const { data: auditRequests, error } = await this.supabase
      .from('audit_requests')
      .select('status, proposed_price')
      .eq('developer_wallet', walletAddress)

    if (error) {
      console.error('[Supabase] Error fetching dashboard stats:', error)
      return {
        totalProjects: 0,
        completedAudits: 0,
        inProgressAudits: 0,
        pendingAudits: 0,
        totalSpent: 0
      }
    }

    const stats = {
      totalProjects: auditRequests.length,
      completedAudits: auditRequests.filter((req: any) => req.status === 'Completed').length,
      inProgressAudits: auditRequests.filter((req: any) => req.status === 'In Progress').length,
      pendingAudits: auditRequests.filter((req: any) => req.status === 'Available').length,
      totalSpent: auditRequests.reduce((sum: number, req: any) => sum + (req.proposed_price || 0), 0)
    }

    console.log('[Supabase] Dashboard stats:', stats)
    return stats
  }

  // Get developer profile
  async getDeveloperProfile(walletAddress: string): Promise<Developer | null> {
    console.log('[Supabase] Fetching developer profile for:', walletAddress)
    
    const { data, error } = await this.supabase
      .from('developers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error) {
      console.error('[Supabase] Error fetching developer profile:', error)
      return null
    }

    console.log('[Supabase] Developer profile found:', data)
    return data
  }

  // Get all contracts related to a wallet (through audit requests)
  async getAllContractsByWallet(walletAddress: string): Promise<SmartContract[]> {
    console.log('[Supabase] Fetching all contracts for wallet:', walletAddress)
    
    const { data, error } = await this.supabase
      .from('smart_contracts')
      .select(`
        *,
        audit_requests!inner(developer_wallet)
      `)
      .eq('audit_requests.developer_wallet', walletAddress)

    if (error) {
      console.error('[Supabase] Error fetching contracts:', error)
      return []
    }

    console.log('[Supabase] Found', data.length, 'contracts')
    return data
  }

  // Get all NFTs related to a wallet (through audit requests)
  async getAllNFTsByWallet(walletAddress: string): Promise<NFT[]> {
    console.log('[Supabase] Fetching all NFTs for wallet:', walletAddress)
    
    const { data, error } = await this.supabase
      .from('nfts')
      .select(`
        *,
        audit_requests!inner(developer_wallet)
      `)
      .eq('audit_requests.developer_wallet', walletAddress)

    if (error) {
      console.error('[Supabase] Error fetching NFTs:', error)
      return []
    }

    console.log('[Supabase] Found', data.length, 'NFTs')
    return data
  }

  // Get all IPFS data related to a wallet (through audit requests)
  async getAllIPFSDataByWallet(walletAddress: string): Promise<IPFSData[]> {
    console.log('[Supabase] Fetching all IPFS data for wallet:', walletAddress)
    
    const { data, error } = await this.supabase
      .from('ipfs_data')
      .select(`
        *,
        audit_requests!inner(developer_wallet)
      `)
      .eq('audit_requests.developer_wallet', walletAddress)

    if (error) {
      console.error('[Supabase] Error fetching IPFS data:', error)
      return []
    }

    console.log('[Supabase] Found', data.length, 'IPFS records')
    return data
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('audit_requests')
        .select('count')
        .limit(1)

      if (error) {
        console.error('[Supabase] Connection test failed:', error)
        return false
      }

      console.log('[Supabase] Connection test successful')
      return true
    } catch (error) {
      console.error('[Supabase] Connection test error:', error)
      return false
    }
  }
}

// Export singleton instance
export const supabaseAuditService = new SupabaseAuditService()

// Export types
export type {
  AuditRequest,
  SmartContract,
  NFT,
  IPFSData,
  Developer
}
