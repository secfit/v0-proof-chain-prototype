export interface ContractMetadata {
  name: string
  description: string
  image: string
  external_url: string
  audit_request?: {
    project_name: string
    project_description: string
    github_url: string
    complexity: string
    estimated_duration: string
    proposed_price: string
    auditor_count: string
    developer_wallet: string
    tags: string[]
    repository_hash: string
  }
  audit_specifications?: {
    scope: string[]
    deliverables: string[]
    methodology: string[]
    timeline: string
    reporting_format: string
  }
  repository_info?: {
    name: string
    description: string
    language: string
    stars: number
    forks: number
    last_commit: string
    contributors: number
    license: string
    size: string
  }
  contract_info?: {
    contract_type: string
    contract_name: string
    contract_symbol?: string
    total_supply?: string
    decimals?: number
    deployment_hash: string
    explorer_url: string
    functions: string[]
    events: string[]
    modifiers: string[]
  }
  platform_info?: {
    platform_name: string
    platform_version: string
    blockchain_network: string
    created_at: string
    updated_at: string
  }
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export class IPFSMetadataService {
  /**
   * Fetch metadata from IPFS URI
   */
  static async fetchMetadata(ipfsUri: string): Promise<ContractMetadata | null> {
    try {
      console.log("[IPFSMetadataService] Fetching metadata from:", ipfsUri)
      
      // Convert IPFS URI to HTTP URL
      const httpUrl = ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
      
      const response = await fetch(httpUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`)
      }
      
      const metadata = await response.json()
      console.log("[IPFSMetadataService] Metadata fetched successfully:", metadata)
      
      return metadata as ContractMetadata
    } catch (error: any) {
      console.error("[IPFSMetadataService] Error fetching metadata:", error)
      return null
    }
  }

  /**
   * Extract contract details from metadata
   */
  static extractContractDetails(metadata: ContractMetadata) {
    return {
      // Basic info
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      externalUrl: metadata.external_url,
      
      // Audit request details
      projectName: metadata.audit_request?.project_name || 'Unknown',
      projectDescription: metadata.audit_request?.project_description || 'No description available',
      githubUrl: metadata.audit_request?.github_url || '',
      complexity: metadata.audit_request?.complexity || 'Medium',
      estimatedDuration: metadata.audit_request?.estimated_duration || '7 days',
      proposedPrice: metadata.audit_request?.proposed_price || '0',
      auditorCount: metadata.audit_request?.auditor_count || '1',
      developerWallet: metadata.audit_request?.developer_wallet || '',
      tags: metadata.audit_request?.tags || [],
      repositoryHash: metadata.audit_request?.repository_hash || '',
      
      // Audit specifications
      scope: metadata.audit_specifications?.scope || [],
      deliverables: metadata.audit_specifications?.deliverables || [],
      methodology: metadata.audit_specifications?.methodology || [],
      timeline: metadata.audit_specifications?.timeline || '',
      reportingFormat: metadata.audit_specifications?.reporting_format || '',
      
      // Repository info
      repositoryName: metadata.repository_info?.name || '',
      repositoryDescription: metadata.repository_info?.description || '',
      language: metadata.repository_info?.language || '',
      stars: metadata.repository_info?.stars || 0,
      forks: metadata.repository_info?.forks || 0,
      lastCommit: metadata.repository_info?.last_commit || '',
      contributors: metadata.repository_info?.contributors || 0,
      license: metadata.repository_info?.license || '',
      size: metadata.repository_info?.size || '',
      
      // Contract info
      contractType: metadata.contract_info?.contract_type || '',
      contractName: metadata.contract_info?.contract_name || '',
      contractSymbol: metadata.contract_info?.contract_symbol || '',
      totalSupply: metadata.contract_info?.total_supply || '',
      decimals: metadata.contract_info?.decimals || 0,
      deploymentHash: metadata.contract_info?.deployment_hash || '',
      explorerUrl: metadata.contract_info?.explorer_url || '',
      functions: metadata.contract_info?.functions || [],
      events: metadata.contract_info?.events || [],
      modifiers: metadata.contract_info?.modifiers || [],
      
      // Platform info
      platformName: metadata.platform_info?.platform_name || 'ProofChain',
      platformVersion: metadata.platform_info?.platform_version || '1.0.0',
      blockchainNetwork: metadata.platform_info?.blockchain_network || 'ApeChain',
      createdAt: metadata.platform_info?.created_at || '',
      updatedAt: metadata.platform_info?.updated_at || '',
      
      // Attributes
      attributes: metadata.attributes || []
    }
  }

  /**
   * Format contract details for display
   */
  static formatContractDetails(details: ReturnType<typeof IPFSMetadataService.extractContractDetails>) {
    return {
      // Basic Information
      basic: {
        name: details.name,
        description: details.description,
        projectName: details.projectName,
        projectDescription: details.projectDescription,
        githubUrl: details.githubUrl,
        complexity: details.complexity,
        estimatedDuration: details.estimatedDuration,
        proposedPrice: details.proposedPrice,
        auditorCount: details.auditorCount,
        developerWallet: details.developerWallet,
        tags: details.tags
      },
      
      // Repository Information
      repository: {
        name: details.repositoryName,
        description: details.repositoryDescription,
        language: details.language,
        stars: details.stars,
        forks: details.forks,
        lastCommit: details.lastCommit,
        contributors: details.contributors,
        license: details.license,
        size: details.size
      },
      
      // Contract Information
      contract: {
        type: details.contractType,
        name: details.contractName,
        symbol: details.contractSymbol,
        totalSupply: details.totalSupply,
        decimals: details.decimals,
        deploymentHash: details.deploymentHash,
        explorerUrl: details.explorerUrl,
        functions: details.functions,
        events: details.events,
        modifiers: details.modifiers
      },
      
      // Audit Specifications
      audit: {
        scope: details.scope,
        deliverables: details.deliverables,
        methodology: details.methodology,
        timeline: details.timeline,
        reportingFormat: details.reportingFormat
      },
      
      // Platform Information
      platform: {
        name: details.platformName,
        version: details.platformVersion,
        blockchainNetwork: details.blockchainNetwork,
        createdAt: details.createdAt,
        updatedAt: details.updatedAt
      }
    }
  }
}
