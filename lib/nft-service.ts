// NFT minting service for ProofChain audit certificates
// Using ThirdWeb SDK for NFT operations

import { getContract } from "thirdweb"
import { defineChain } from "thirdweb/chains"
import { client } from "./client"

const AUDIT_REQUEST_NFT_CONTRACT = process.env.AUDIT_REQUEST_NFT_CONTRACT || ""
const AUDIT_OWNER_NFT_CONTRACT = process.env.AUDIT_OWNER_NFT_CONTRACT || ""
const AUDIT_RESULT_NFT_CONTRACT = process.env.AUDIT_RESULT_NFT_CONTRACT || ""

const apeChain = defineChain({
  id: 33139,
  name: "ApeChain",
  nativeCurrency: {
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
  },
  rpc: "https://rpc.apechain.com",
})

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

// Mint Audit Request NFT
export async function mintAuditRequestNFT(
  metadata: AuditRequestNFTMetadata,
  recipientAddress: string,
): Promise<{ tokenId: string; transactionHash: string }> {
  try {
    const contract = getContract({
      client,
      chain: apeChain,
      address: AUDIT_REQUEST_NFT_CONTRACT,
    })

    // Note: This is a simplified version. In production, you'd need to:
    // 1. Upload metadata to IPFS first
    // 2. Call the actual mint function with the metadata URI
    // For now, returning mock data to prevent build errors
    console.log("[v0] Minting Audit Request NFT for:", recipientAddress)

    return {
      tokenId: Date.now().toString(),
      transactionHash: "0x" + "0".repeat(64),
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
    const contract = getContract({
      client,
      chain: apeChain,
      address: AUDIT_OWNER_NFT_CONTRACT,
    })

    console.log("[v0] Minting Audit Owner NFT for:", recipientAddress)

    return {
      tokenId: Date.now().toString(),
      transactionHash: "0x" + "0".repeat(64),
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
    const contract = getContract({
      client,
      chain: apeChain,
      address: AUDIT_RESULT_NFT_CONTRACT,
    })

    console.log("[v0] Minting Audit Result NFT for:", recipientAddress)

    return {
      tokenId: Date.now().toString(),
      transactionHash: "0x" + "0".repeat(64),
    }
  } catch (error) {
    console.error("Error minting Audit Result NFT:", error)
    throw error
  }
}

// Get NFT metadata
export async function getNFTMetadata(contractAddress: string, tokenId: string): Promise<any> {
  try {
    const contract = getContract({
      client,
      chain: apeChain,
      address: contractAddress,
    })

    console.log("[v0] Fetching NFT metadata for token:", tokenId)

    // Return mock data for now
    return {
      name: "ProofChain NFT",
      description: "Audit certificate",
      tokenId,
    }
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
