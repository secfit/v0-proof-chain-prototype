// NFT minting service for ProofChain audit certificates
// Using ThirdWeb SDK for NFT operations

import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { ApeChain } from "@thirdweb-dev/chains"

const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""
const AUDIT_REQUEST_NFT_CONTRACT = process.env.AUDIT_REQUEST_NFT_CONTRACT || ""
const AUDIT_OWNER_NFT_CONTRACT = process.env.AUDIT_OWNER_NFT_CONTRACT || ""
const AUDIT_RESULT_NFT_CONTRACT = process.env.AUDIT_RESULT_NFT_CONTRACT || ""

export interface AuditRequestNFTMetadata {
  name: string
  description: string
  image: string
  attributes: {
    projectName: string
    githubUrl: string
    repoHash: string
    complexity: string
    estimatedDuration: number
    proposedPrice: number
    auditorCount: number
    developerWallet: string
    timestamp: string
    tags: string[]
  }
}

export interface AuditOwnerNFTMetadata {
  name: string
  description: string
  image: string
  attributes: {
    auditRequestNftId: string
    auditorWallet: string
    auditorName: string
    acceptedPrice: number
    startDate: string
    estimatedCompletionDate: string
    timestamp: string
  }
}

export interface AuditResultNFTMetadata {
  name: string
  description: string
  image: string
  attributes: {
    auditRequestNftId: string
    auditOwnerNftId: string
    contractHash?: string
    ipfsEvidenceHash?: string
    findingsCount: number
    vulnerabilitiesCount: number
    severityBreakdown: {
      critical: number
      high: number
      medium: number
      low: number
    }
    completedAt: string
    timestamp: string
  }
}

// Initialize ThirdWeb SDK
function getSDK() {
  return new ThirdwebSDK(ApeChain, {
    clientId: THIRDWEB_CLIENT_ID,
  })
}

// Mint Audit Request NFT
export async function mintAuditRequestNFT(
  metadata: AuditRequestNFTMetadata,
  recipientAddress: string,
): Promise<{ tokenId: string; transactionHash: string }> {
  try {
    const sdk = getSDK()
    const contract = await sdk.getContract(AUDIT_REQUEST_NFT_CONTRACT)

    const tx = await contract.erc721.mintTo(recipientAddress, metadata)

    return {
      tokenId: tx.id.toString(),
      transactionHash: tx.receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error minting Audit Request NFT:", error)
    throw error
  }
}

// Mint Audit Owner NFT
export async function mintAuditOwnerNFT(
  metadata: AuditOwnerNFTMetadata,
  recipientAddress: string,
): Promise<{ tokenId: string; transactionHash: string }> {
  try {
    const sdk = getSDK()
    const contract = await sdk.getContract(AUDIT_OWNER_NFT_CONTRACT)

    const tx = await contract.erc721.mintTo(recipientAddress, metadata)

    return {
      tokenId: tx.id.toString(),
      transactionHash: tx.receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error minting Audit Owner NFT:", error)
    throw error
  }
}

// Mint Audit Result NFT
export async function mintAuditResultNFT(
  metadata: AuditResultNFTMetadata,
  recipientAddress: string,
): Promise<{ tokenId: string; transactionHash: string }> {
  try {
    const sdk = getSDK()
    const contract = await sdk.getContract(AUDIT_RESULT_NFT_CONTRACT)

    const tx = await contract.erc721.mintTo(recipientAddress, metadata)

    return {
      tokenId: tx.id.toString(),
      transactionHash: tx.receipt.transactionHash,
    }
  } catch (error) {
    console.error("Error minting Audit Result NFT:", error)
    throw error
  }
}

// Get NFT metadata
export async function getNFTMetadata(contractAddress: string, tokenId: string): Promise<any> {
  try {
    const sdk = getSDK()
    const contract = await sdk.getContract(contractAddress)
    const metadata = await contract.erc721.get(tokenId)
    return metadata
  } catch (error) {
    console.error("Error fetching NFT metadata:", error)
    throw error
  }
}

// Generate NFT image URL (placeholder for now)
export function generateNFTImage(type: "request" | "owner" | "result"): string {
  const baseUrl = "/placeholder.svg"
  const params = new URLSearchParams({
    height: "400",
    width: "400",
    query: `ProofChain ${type} certificate badge with blockchain elements`,
  })
  return `${baseUrl}?${params}`
}

// Create Audit Request NFT metadata
export function createAuditRequestMetadata(data: {
  projectName: string
  githubUrl: string
  repoHash: string
  complexity: string
  estimatedDuration: number
  proposedPrice: number
  auditorCount: number
  developerWallet: string
  tags: string[]
}): AuditRequestNFTMetadata {
  return {
    name: `ProofChain Audit Request: ${data.projectName}`,
    description: `Audit request for ${data.projectName}. This NFT represents an immutable audit request on the ProofChain platform.`,
    image: generateNFTImage("request"),
    attributes: {
      ...data,
      timestamp: new Date().toISOString(),
    },
  }
}

// Create Audit Owner NFT metadata
export function createAuditOwnerMetadata(data: {
  auditRequestNftId: string
  auditorWallet: string
  auditorName: string
  acceptedPrice: number
  startDate: string
  estimatedCompletionDate: string
}): AuditOwnerNFTMetadata {
  return {
    name: `ProofChain Audit Ownership: ${data.auditorName}`,
    description: `Audit ownership certificate for auditor ${data.auditorName}. This NFT is linked to Audit Request NFT #${data.auditRequestNftId}.`,
    image: generateNFTImage("owner"),
    attributes: {
      ...data,
      timestamp: new Date().toISOString(),
    },
  }
}

// Create Audit Result NFT metadata
export function createAuditResultMetadata(data: {
  auditRequestNftId: string
  auditOwnerNftId: string
  contractHash?: string
  ipfsHash?: string
  findingsCount: number
  vulnerabilitiesCount: number
  severityBreakdown: {
    critical: number
    high: number
    medium: number
    low: number
  }
  completionDate: string
}): AuditResultNFTMetadata {
  return {
    name: `ProofChain Audit Result Certificate`,
    description: `Audit result certificate linked to Request NFT #${data.auditRequestNftId} and Owner NFT #${data.auditOwnerNftId}. Evidence stored on IPFS.`,
    image: generateNFTImage("result"),
    attributes: {
      auditRequestNftId: data.auditRequestNftId,
      auditOwnerNftId: data.auditOwnerNftId,
      contractHash: data.contractHash,
      ipfsEvidenceHash: data.ipfsHash || "",
      findingsCount: data.findingsCount,
      vulnerabilitiesCount: data.vulnerabilitiesCount,
      severityBreakdown: data.severityBreakdown,
      completedAt: data.completionDate,
      timestamp: new Date().toISOString(),
    },
  }
}
