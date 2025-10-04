// ThirdWeb IPFS storage service for ProofChain
// Replaces Pinata with ThirdWeb's built-in IPFS functionality

import { ThirdwebStorage } from "@thirdweb-dev/storage"

const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""

export interface IPFSUploadResult {
  ipfsHash: string
  gatewayUrl: string
  timestamp: string
}

export interface FindingData {
  title: string
  description: string
  severity: string
  contractFile: string
  lineNumber?: number
  codeSnippet?: string
  recommendation?: string
  references?: string[]
  timestamp: string
}

export interface EvidenceData {
  auditRequestId: string
  findings: FindingData[]
  vulnerabilities: any[]
  testResults?: any
  toolOutputs?: any
  auditorNotes?: string
  timestamp: string
}

// Initialize ThirdWeb Storage
function getStorage() {
  return new ThirdwebStorage({
    clientId: THIRDWEB_CLIENT_ID,
  })
}

// Upload JSON data to IPFS via ThirdWeb
export async function uploadJSONToIPFS(data: any, name: string): Promise<IPFSUploadResult> {
  try {
    console.log("[v0] Uploading to ThirdWeb IPFS:", name)

    if (!THIRDWEB_CLIENT_ID) {
      throw new Error("ThirdWeb client ID is not configured")
    }

    const storage = getStorage()
    const uri = await storage.upload(data)
    const ipfsHash = uri.replace("ipfs://", "")
    const gatewayUrl = storage.resolveScheme(uri)

    console.log("[v0] ThirdWeb IPFS upload successful:", ipfsHash)

    return {
      ipfsHash,
      gatewayUrl,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Error uploading to ThirdWeb IPFS:", error)
    throw error
  }
}

// Upload file to IPFS via ThirdWeb
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    console.log("[v0] Uploading file to ThirdWeb IPFS:", file.name)

    const storage = getStorage()
    const uri = await storage.upload(file)
    const ipfsHash = uri.replace("ipfs://", "")
    const gatewayUrl = storage.resolveScheme(uri)

    console.log("[v0] ThirdWeb IPFS file upload successful:", ipfsHash)

    return {
      ipfsHash,
      gatewayUrl,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Error uploading file to ThirdWeb IPFS:", error)
    throw error
  }
}

// Retrieve data from IPFS
export async function getFromIPFS(ipfsHash: string): Promise<any> {
  try {
    const storage = getStorage()
    const uri = ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`
    const data = await storage.downloadJSON(uri)
    return data
  } catch (error) {
    console.error("[v0] Error fetching from IPFS:", error)
    throw error
  }
}

// Upload finding to IPFS
export async function uploadFinding(finding: FindingData): Promise<IPFSUploadResult> {
  const name = `finding-${finding.contractFile}-${Date.now()}`
  return uploadJSONToIPFS(finding, name)
}

// Upload audit evidence to IPFS
export async function uploadAuditEvidence(evidence: EvidenceData): Promise<IPFSUploadResult> {
  const name = `audit-evidence-${evidence.auditRequestId}-${Date.now()}`
  return uploadJSONToIPFS(evidence, name)
}

// Generate IPFS gateway URL
export function getIPFSGatewayUrl(ipfsHash: string): string {
  const storage = getStorage()
  const uri = ipfsHash.startsWith("ipfs://") ? ipfsHash : `ipfs://${ipfsHash}`
  return storage.resolveScheme(uri)
}

// Verify IPFS hash format
export function isValidIPFSHash(hash: string): boolean {
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || /^b[A-Za-z2-7]{58}$/.test(hash)
}

// Upload generic data to IPFS
export async function uploadToIPFS(data: any, name?: string): Promise<string> {
  const fileName = name || `proofchain-data-${Date.now()}`
  const result = await uploadJSONToIPFS(data, fileName)
  return result.ipfsHash
}

// Upload multiple files to IPFS
export async function uploadMultipleFiles(files: File[]): Promise<IPFSUploadResult[]> {
  const results: IPFSUploadResult[] = []

  for (const file of files) {
    const result = await uploadFileToIPFS(file)
    results.push(result)
  }

  return results
}
