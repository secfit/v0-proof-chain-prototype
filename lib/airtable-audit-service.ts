// Comprehensive Airtable Service for ProofChain Audit System
// Handles all audit request data storage and retrieval

interface AirtableRecord {
  id?: string
  fields: Record<string, any>
}

interface AuditRequestData {
  projectName: string
  projectDescription: string
  githubUrl: string
  repoHash: string
  complexity: string
  estimatedDuration: number
  proposedPrice: number
  auditorCount: number
  developerWallet: string
  status: string
  tags: string[]
  createdAt: string
}

interface SmartContractData {
  auditRequestId: string
  contractAddress: string
  contractType: string
  contractName: string
  contractSymbol: string
  totalSupply?: number
  decimals?: number
  deploymentHash: string
  explorerUrl: string
  createdAt: string
}

interface NFTData {
  auditRequestId: string
  contractId: string
  tokenId: string
  tokenName: string
  tokenDescription: string
  metadataUri: string
  ownerWallet: string
  mintTransactionHash: string
  explorerUrl: string
  createdAt: string
}

interface IPFSData {
  auditRequestId: string
  nftId?: string
  ipfsHash: string
  ipfsUri: string
  contentType: string
  fileSize?: number
  relatedContract?: string
  relatedToken?: string
  createdAt: string
}

interface DeveloperData {
  walletAddress: string
  totalProjects: number
  totalSpent: number
  reputationScore: number
  firstProjectDate: string
  lastActivity: string
  status: string
}

class AirtableAuditService {
  private apiKey: string
  private baseId: string
  private baseUrl: string

  // Table names
  private tables = {
    auditRequests: 'Audit Requests',
    smartContracts: 'Smart Contracts',
    nfts: 'NFTs',
    ipfsData: 'IPFS Data',
    developers: 'Developers'
  }

  constructor() {
    this.apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY || ''
    this.baseId = process.env.AIRTABLE_BASE_ID || ''
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`

    if (!this.apiKey || !this.baseId) {
      console.warn('[Airtable] Personal Access Token or Base ID not configured')
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    if (!this.apiKey || !this.baseId) {
      throw new Error('Airtable not configured - missing Personal Access Token or Base ID')
    }

    const url = `${this.baseUrl}/${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }

    const config: RequestInit = {
      method,
      headers
    }

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Airtable API error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[Airtable] Request failed:', error)
      throw error
    }
  }

  // Create audit request record
  async createAuditRequest(data: AuditRequestData): Promise<string> {
    console.log('[Airtable] Creating audit request:', data.projectName)
    
    const record: AirtableRecord = {
      fields: {
        'Project Name': data.projectName,
        'Project Description': data.projectDescription,
        'GitHub URL': data.githubUrl,
        'Repository Hash': data.repoHash,
        'Complexity': data.complexity,
        'Estimated Duration': data.estimatedDuration,
        'Proposed Price': data.proposedPrice,
        'Auditor Count': data.auditorCount,
        'Developer Wallet': data.developerWallet,
        'Status': data.status,
        'Tags': data.tags,
        'Created At': data.createdAt
      }
    }

    const response = await this.makeRequest(
      `${this.tables.auditRequests}`,
      'POST',
      { records: [record] }
    )

    const recordId = response.records[0].id
    console.log('[Airtable] Audit request created with ID:', recordId)
    return recordId
  }

  // Create smart contract record
  async createSmartContract(data: SmartContractData): Promise<string> {
    console.log('[Airtable] Creating smart contract record:', data.contractName)
    
    const record: AirtableRecord = {
      fields: {
        'Audit Request ID': [data.auditRequestId],
        'Contract Address': data.contractAddress,
        'Contract Type': data.contractType,
        'Contract Name': data.contractName,
        'Contract Symbol': data.contractSymbol,
        'Total Supply': data.totalSupply,
        'Decimals': data.decimals,
        'Deployment Hash': data.deploymentHash,
        'Explorer URL': data.explorerUrl,
        'Created At': data.createdAt
      }
    }

    const response = await this.makeRequest(
      `${this.tables.smartContracts}`,
      'POST',
      { records: [record] }
    )

    const recordId = response.records[0].id
    console.log('[Airtable] Smart contract created with ID:', recordId)
    return recordId
  }

  // Create NFT record
  async createNFT(data: NFTData): Promise<string> {
    console.log('[Airtable] Creating NFT record:', data.tokenName)
    
    const record: AirtableRecord = {
      fields: {
        'Audit Request ID': [data.auditRequestId],
        'Contract ID': [data.contractId],
        'Token ID': data.tokenId,
        'Token Name': data.tokenName,
        'Token Description': data.tokenDescription,
        'Metadata URI': data.metadataUri,
        'Owner Wallet': data.ownerWallet,
        'Mint Transaction Hash': data.mintTransactionHash,
        'Explorer URL': data.explorerUrl,
        'Created At': data.createdAt
      }
    }

    const response = await this.makeRequest(
      `${this.tables.nfts}`,
      'POST',
      { records: [record] }
    )

    const recordId = response.records[0].id
    console.log('[Airtable] NFT created with ID:', recordId)
    return recordId
  }

  // Create IPFS data record
  async createIPFSData(data: IPFSData): Promise<string> {
    console.log('[Airtable] Creating IPFS data record:', data.ipfsHash)
    
    const record: AirtableRecord = {
      fields: {
        'Audit Request ID': [data.auditRequestId],
        'NFT ID': data.nftId ? [data.nftId] : undefined,
        'IPFS Hash': data.ipfsHash,
        'IPFS URI': data.ipfsUri,
        'Content Type': data.contentType,
        'File Size': data.fileSize,
        'Related Contract': data.relatedContract,
        'Related Token': data.relatedToken,
        'Created At': data.createdAt
      }
    }

    // Remove undefined fields
    Object.keys(record.fields).forEach(key => {
      if (record.fields[key] === undefined) {
        delete record.fields[key]
      }
    })

    const response = await this.makeRequest(
      `${this.tables.ipfsData}`,
      'POST',
      { records: [record] }
    )

    const recordId = response.records[0].id
    console.log('[Airtable] IPFS data created with ID:', recordId)
    return recordId
  }

  // Create or update developer record
  async createOrUpdateDeveloper(data: DeveloperData): Promise<string> {
    console.log('[Airtable] Creating/updating developer:', data.walletAddress)
    
    // First, try to find existing developer
    const existingDeveloper = await this.findDeveloperByWallet(data.walletAddress)
    
    if (existingDeveloper) {
      // Update existing developer
      const record: AirtableRecord = {
        id: existingDeveloper.id,
        fields: {
          'Total Projects': data.totalProjects,
          'Total Spent': data.totalSpent,
          'Reputation Score': data.reputationScore,
          'Last Activity': data.lastActivity,
          'Status': data.status
        }
      }

      const response = await this.makeRequest(
        `${this.tables.developers}`,
        'PATCH',
        { records: [record] }
      )

      console.log('[Airtable] Developer updated:', existingDeveloper.id)
      return existingDeveloper.id
    } else {
      // Create new developer
      const record: AirtableRecord = {
        fields: {
          'Wallet Address': data.walletAddress,
          'Total Projects': data.totalProjects,
          'Total Spent': data.totalSpent,
          'Reputation Score': data.reputationScore,
          'First Project Date': data.firstProjectDate,
          'Last Activity': data.lastActivity,
          'Status': data.status
        }
      }

      const response = await this.makeRequest(
        `${this.tables.developers}`,
        'POST',
        { records: [record] }
      )

      const recordId = response.records[0].id
      console.log('[Airtable] Developer created with ID:', recordId)
      return recordId
    }
  }

  // Find developer by wallet address
  async findDeveloperByWallet(walletAddress: string): Promise<any> {
    try {
      const response = await this.makeRequest(
        `${this.tables.developers}?filterByFormula={Wallet Address}='${walletAddress}'`
      )

      if (response.records && response.records.length > 0) {
        return {
          id: response.records[0].id,
          ...response.records[0].fields
        }
      }
      return null
    } catch (error) {
      console.error('[Airtable] Error finding developer:', error)
      return null
    }
  }

  // Get all audit requests for a developer
  async getAuditRequestsByDeveloper(walletAddress: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(
        `${this.tables.auditRequests}?filterByFormula={Developer Wallet}='${walletAddress}'&sort[0][field]=Created At&sort[0][direction]=desc`
      )

      return response.records.map((record: any) => ({
        id: record.id,
        ...record.fields
      }))
    } catch (error) {
      console.error('[Airtable] Error fetching audit requests:', error)
      return []
    }
  }

  // Get audit request with all related data
  async getAuditRequestWithDetails(auditRequestId: string): Promise<any> {
    try {
      // Get audit request
      const auditRequest = await this.makeRequest(
        `${this.tables.auditRequests}/${auditRequestId}`
      )

      // Get related smart contracts
      const contracts = await this.makeRequest(
        `${this.tables.smartContracts}?filterByFormula={Audit Request ID}='${auditRequestId}'`
      )

      // Get related NFTs
      const nfts = await this.makeRequest(
        `${this.tables.nfts}?filterByFormula={Audit Request ID}='${auditRequestId}'`
      )

      // Get related IPFS data
      const ipfsData = await this.makeRequest(
        `${this.tables.ipfsData}?filterByFormula={Audit Request ID}='${auditRequestId}'`
      )

      return {
        auditRequest: {
          id: auditRequest.id,
          ...auditRequest.fields
        },
        contracts: contracts.records.map((record: any) => ({
          id: record.id,
          ...record.fields
        })),
        nfts: nfts.records.map((record: any) => ({
          id: record.id,
          ...record.fields
        })),
        ipfsData: ipfsData.records.map((record: any) => ({
          id: record.id,
          ...record.fields
        }))
      }
    } catch (error) {
      console.error('[Airtable] Error fetching audit request details:', error)
      throw error
    }
  }

  // Get dashboard statistics
  async getDashboardStats(walletAddress: string): Promise<any> {
    try {
      const auditRequests = await this.getAuditRequestsByDeveloper(walletAddress)
      
      const stats = {
        totalProjects: auditRequests.length,
        completedAudits: auditRequests.filter((req: any) => req.Status === 'Completed').length,
        inProgressAudits: auditRequests.filter((req: any) => req.Status === 'In Progress').length,
        pendingAudits: auditRequests.filter((req: any) => req.Status === 'Available').length,
        totalSpent: auditRequests.reduce((sum: number, req: any) => sum + (req['Proposed Price'] || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('[Airtable] Error fetching dashboard stats:', error)
      return {
        totalProjects: 0,
        completedAudits: 0,
        inProgressAudits: 0,
        pendingAudits: 0,
        totalSpent: 0
      }
    }
  }
}

// Export singleton instance
export const airtableAuditService = new AirtableAuditService()

// Export types
export type {
  AuditRequestData,
  SmartContractData,
  NFTData,
  IPFSData,
  DeveloperData
}
