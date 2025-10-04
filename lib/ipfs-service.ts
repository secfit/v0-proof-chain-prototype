// IPFS integration for ProofChain file storage
// Using Pinata as IPFS pinning service

const PINATA_API_KEY = process.env.Pinata_API_Key || ""
const PINATA_SECRET_KEY = process.env.Pinata_API_Key || "" // Using same key for both
const PINATA_API_URL = "https://api.pinata.cloud"
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs"

export interface IPFSUploadResult {
  ipfsHash: string
  pinSize: number
  timestamp: string
  gatewayUrl: string
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

// Upload JSON data to IPFS
export async function uploadJSONToIPFS(data: any, name: string): Promise<IPFSUploadResult> {
  try {
    console.log("[v0] Uploading to IPFS:", name)
    console.log("[v0] Pinata API Key:", PINATA_API_KEY ? "Set" : "Missing")

    if (!PINATA_API_KEY) {
      throw new Error("Pinata API key is not configured. Please set the Pinata_API_Key environment variable.")
    }

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: name,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] IPFS upload error:", errorText)
      throw new Error(`IPFS upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    console.log("[v0] IPFS upload successful:", result.IpfsHash)

    return {
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
      gatewayUrl: `${PINATA_GATEWAY}/${result.IpfsHash}`,
    }
  } catch (error) {
    console.error("[v0] Error uploading to IPFS:", error)
    throw error
  }
}

// Upload file to IPFS
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const metadata = JSON.stringify({
      name: file.name,
    })
    formData.append("pinataMetadata", metadata)

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] IPFS file upload error:", errorText)
      throw new Error(`IPFS file upload failed: ${response.statusText}`)
    }

    const result = await response.json()

    return {
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
      gatewayUrl: `${PINATA_GATEWAY}/${result.IpfsHash}`,
    }
  } catch (error) {
    console.error("[v0] Error uploading file to IPFS:", error)
    throw error
  }
}

// Retrieve data from IPFS
export async function getFromIPFS(ipfsHash: string): Promise<any> {
  try {
    const response = await fetch(`${PINATA_GATEWAY}/${ipfsHash}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to fetch from IPFS:", errorText)
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return await response.json()
    }

    return await response.text()
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
  return `${PINATA_GATEWAY}/${ipfsHash}`
}

// Verify IPFS hash format
export function isValidIPFSHash(hash: string): boolean {
  // IPFS CIDv0 starts with Qm and is 46 characters
  // IPFS CIDv1 starts with b and is longer
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || /^b[A-Za-z2-7]{58}$/.test(hash)
}

export async function uploadToIPFS(data: any, name?: string): Promise<string> {
  const fileName = name || `proofchain-data-${Date.now()}`
  const result = await uploadJSONToIPFS(data, fileName)
  return result.ipfsHash
}
