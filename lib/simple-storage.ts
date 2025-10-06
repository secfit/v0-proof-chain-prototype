// Simple in-memory storage service for MVP
// Replaces Airtable with localStorage + in-memory storage

export interface AuditRequest {
  id: string
  projectName: string
  projectDescription: string
  githubUrl: string
  repoHash: string
  complexity: string
  estimatedDuration: number
  proposedPrice: number
  auditorCount: number
  developerWallet: string
  status: "Available" | "In Progress" | "Completed" | "Cancelled"
  requestNftId?: string
  requestNftTxHash?: string
  paymentTxHash?: string
  tags: string[]
  createdAt: string
  updatedAt?: string
}

export interface AuditOwner {
  id: string
  auditRequestId: string
  auditorWallet: string
  auditorName: string
  acceptedPrice: number
  startDate: string
  estimatedCompletionDate: string
  ownerNftId?: string
  ownerNftTxHash?: string
  status: "Accepted" | "In Progress" | "Completed"
  createdAt: string
}

export interface AuditResult {
  id: string
  auditRequestId: string
  auditOwnerId: string
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
  resultNftId?: string
  resultNftTxHash?: string
  createdAt: string
}

// In-memory storage
const storage = {
  auditRequests: [] as AuditRequest[],
  auditOwners: [] as AuditOwner[],
  auditResults: [] as AuditResult[],
}

// Initialize from localStorage if available
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("proofchain_data")
  if (stored) {
    try {
      const data = JSON.parse(stored)
      storage.auditRequests = data.auditRequests || []
      storage.auditOwners = data.auditOwners || []
      storage.auditResults = data.auditResults || []
    } catch (e) {
      console.error("Error loading stored data:", e)
    }
  }
}

// Save to localStorage
function saveToStorage() {
  if (typeof window !== "undefined") {
    localStorage.setItem("proofchain_data", JSON.stringify(storage))
  }
}

// Audit Request functions
export async function createAuditRequest(data: Omit<AuditRequest, "id">): Promise<AuditRequest> {
  const auditRequest: AuditRequest = {
    id: Date.now().toString(),
    ...data,
  }
  storage.auditRequests.push(auditRequest)
  saveToStorage()
  return auditRequest
}

export async function getAuditRequest(id: string): Promise<AuditRequest | null> {
  return storage.auditRequests.find((req) => req.id === id) || null
}

export async function listAuditRequests(filter?: string): Promise<AuditRequest[]> {
  return storage.auditRequests
}

export async function updateAuditRequest(id: string, data: Partial<AuditRequest>): Promise<AuditRequest> {
  const index = storage.auditRequests.findIndex((req) => req.id === id)
  if (index === -1) throw new Error("Audit request not found")

  storage.auditRequests[index] = {
    ...storage.auditRequests[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveToStorage()
  return storage.auditRequests[index]
}

// Audit Owner functions
export async function createAuditOwner(data: Omit<AuditOwner, "id">): Promise<AuditOwner> {
  const auditOwner: AuditOwner = {
    id: Date.now().toString(),
    ...data,
  }
  storage.auditOwners.push(auditOwner)
  saveToStorage()
  return auditOwner
}

export async function getAuditOwner(id: string): Promise<AuditOwner | null> {
  return storage.auditOwners.find((owner) => owner.id === id) || null
}

export async function updateAuditOwner(id: string, data: Partial<AuditOwner>): Promise<AuditOwner> {
  const index = storage.auditOwners.findIndex((owner) => owner.id === id)
  if (index === -1) throw new Error("Audit owner not found")

  storage.auditOwners[index] = {
    ...storage.auditOwners[index],
    ...data,
  }
  saveToStorage()
  return storage.auditOwners[index]
}

// Audit Result functions
export async function createAuditResult(data: Omit<AuditResult, "id">): Promise<AuditResult> {
  const auditResult: AuditResult = {
    id: Date.now().toString(),
    ...data,
  }
  storage.auditResults.push(auditResult)
  saveToStorage()
  return auditResult
}

export async function getAuditResult(auditRequestId: string): Promise<AuditResult | null> {
  return storage.auditResults.find((result) => result.auditRequestId === auditRequestId) || null
}

export async function listFindings(auditRequestId: string): Promise<any[]> {
  // Simplified for MVP
  return []
}

// Helper function to generate project tags
export function generateProjectTags(repoAnalysis: any, aiEstimation: any): string[] {
  const tags: string[] = []

  tags.push(`complexity-${aiEstimation.complexity.toLowerCase()}`)

  if (repoAnalysis.solidityFiles > 10) {
    tags.push("large-codebase")
  } else if (repoAnalysis.solidityFiles > 5) {
    tags.push("medium-codebase")
  } else {
    tags.push("small-codebase")
  }

  if (repoAnalysis.totalLines > 5000) {
    tags.push("extensive-code")
  } else if (repoAnalysis.totalLines > 1000) {
    tags.push("moderate-code")
  }

  if (aiEstimation.riskFactors && aiEstimation.riskFactors.length > 0) {
    tags.push("high-risk")
  }

  if (aiEstimation.durationDays > 14) {
    tags.push("long-term")
  } else if (aiEstimation.durationDays > 7) {
    tags.push("medium-term")
  } else {
    tags.push("short-term")
  }

  return tags
}
