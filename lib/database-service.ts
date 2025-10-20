// JSON-based database service for ProofChain
// Replaces Airtable with a simple in-memory + localStorage solution

export interface AuditRequest {
  id?: string
  projectName: string
  projectDescription: string
  githubUrl: string
  repoHash: string
  complexity: string
  estimatedDuration: number
  proposedPrice: number
  auditorCount: number
  developerWallet: string
  developerId?: string
  status: "Available" | "In Progress" | "Completed" | "Cancelled"
  requestNftId?: string
  requestNftAddress?: string
  tags: string[]
  createdAt: string
  updatedAt?: string
  ipfsCodeHash?: string
}

export interface AuditOwner {
  id?: string
  auditRequestId: string
  auditorWallet: string
  auditorName: string
  acceptedPrice: number
  startDate: string
  estimatedCompletionDate: string
  ownerNftId?: string
  ownerNftAddress?: string
  status: "Accepted" | "In Progress" | "Completed"
  createdAt: string
}

export interface AuditResult {
  id?: string
  auditRequestId: string
  auditOwnerId: string
  ipfsHash?: string
  evidenceFileHashes?: string
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
  resultNftAddress?: string
  status?: string
  createdAt: string
  reportFileUrl?: string
}

export interface Finding {
  id?: string
  auditRequestId: string
  title: string
  description: string
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational"
  contractFile: string
  lineNumber?: number
  ipfsHash: string
  createdAt: string
}

export interface Developer {
  id?: string
  name: string
  walletAddress: string
  githubRepoLink?: string
  email?: string
  totalAuditsRequested: number
  totalSpent: number
  createdAt: string
}

export interface Auditor {
  id?: string
  name: string
  walletAddress: string
  expertise: string[]
  rating: number
  totalAuditsCompleted: number
  totalEarned: number
  createdAt: string
}

export interface Transaction {
  id?: string
  txId: string
  requestId: string
  developerId: string
  auditorId?: string
  amount: number
  tokenType: "FT" | "NFT"
  txHash: string
  status: "Pending" | "Completed" | "Failed"
  createdAt: string
}

// In-memory storage (will be replaced with actual persistence in production)
const storage = {
  auditRequests: [] as AuditRequest[],
  auditOwners: [] as AuditOwner[],
  auditResults: [] as AuditResult[],
  findings: [] as Finding[],
  developers: [] as Developer[],
  auditors: [] as Auditor[],
  transactions: [] as Transaction[],
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Audit Requests
export async function createAuditRequest(data: Omit<AuditRequest, "id">): Promise<AuditRequest> {
  const record: AuditRequest = {
    ...data,
    id: generateId(),
  }
  storage.auditRequests.push(record)
  console.log("[v0] Created audit request:", record.id)
  return record
}

export async function getAuditRequest(id: string): Promise<AuditRequest | null> {
  return storage.auditRequests.find((r) => r.id === id) || null
}

export async function updateAuditRequest(id: string, data: Partial<AuditRequest>): Promise<AuditRequest> {
  const index = storage.auditRequests.findIndex((r) => r.id === id)
  if (index === -1) throw new Error("Audit request not found")

  storage.auditRequests[index] = {
    ...storage.auditRequests[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  console.log("[v0] Updated audit request:", id)
  return storage.auditRequests[index]
}

export async function listAuditRequests(filter?: string): Promise<AuditRequest[]> {
  console.log("[v0] Listing audit requests, filter:", filter)

  if (!filter) {
    return storage.auditRequests
  }

  // Simple filter parsing for wallet address
  const walletMatch = filter.match(/\{developerWallet\}\s*=\s*'([^']+)'/)
  if (walletMatch) {
    const wallet = walletMatch[1]
    return storage.auditRequests.filter((r) => r.developerWallet === wallet)
  }

  const statusMatch = filter.match(/\{status\}\s*=\s*'([^']+)'/)
  if (statusMatch) {
    const status = statusMatch[1]
    return storage.auditRequests.filter((r) => r.status === status)
  }

  return storage.auditRequests
}

// Audit Owners
export async function createAuditOwner(data: Omit<AuditOwner, "id">): Promise<AuditOwner> {
  const record: AuditOwner = {
    ...data,
    id: generateId(),
  }
  storage.auditOwners.push(record)
  console.log("[v0] Created audit owner:", record.id)
  return record
}

export async function getAuditOwner(id: string): Promise<AuditOwner | null> {
  return storage.auditOwners.find((r) => r.id === id) || null
}

export async function updateAuditOwner(id: string, data: Partial<AuditOwner>): Promise<AuditOwner> {
  const index = storage.auditOwners.findIndex((r) => r.id === id)
  if (index === -1) throw new Error("Audit owner not found")

  storage.auditOwners[index] = {
    ...storage.auditOwners[index],
    ...data,
  }
  return storage.auditOwners[index]
}

// Audit Results
export async function createAuditResult(data: Omit<AuditResult, "id">): Promise<AuditResult> {
  const record: AuditResult = {
    ...data,
    id: generateId(),
  }
  storage.auditResults.push(record)
  console.log("[v0] Created audit result:", record.id)
  return record
}

export async function getAuditResult(auditRequestId: string): Promise<AuditResult | null> {
  return storage.auditResults.find((r) => r.auditRequestId === auditRequestId) || null
}

// Findings
export async function createFinding(data: Omit<Finding, "id">): Promise<Finding> {
  const record: Finding = {
    ...data,
    id: generateId(),
  }
  storage.findings.push(record)
  return record
}

export async function listFindings(auditRequestId: string): Promise<Finding[]> {
  return storage.findings.filter((f) => f.auditRequestId === auditRequestId)
}

// Developers
export async function createDeveloper(data: Omit<Developer, "id">): Promise<Developer> {
  const record: Developer = {
    ...data,
    id: generateId(),
  }
  storage.developers.push(record)
  return record
}

export async function getDeveloper(walletAddress: string): Promise<Developer | null> {
  return storage.developers.find((d) => d.walletAddress === walletAddress) || null
}

// Auditors
export async function createAuditor(data: Omit<Auditor, "id">): Promise<Auditor> {
  const record: Auditor = {
    ...data,
    id: generateId(),
  }
  storage.auditors.push(record)
  return record
}

export async function getAuditor(walletAddress: string): Promise<Auditor | null> {
  return storage.auditors.find((a) => a.walletAddress === walletAddress) || null
}

export async function listAuditors(): Promise<Auditor[]> {
  return storage.auditors
}

// Transactions
export async function createTransaction(data: Omit<Transaction, "id">): Promise<Transaction> {
  const record: Transaction = {
    ...data,
    id: generateId(),
  }
  storage.transactions.push(record)
  return record
}

export async function listTransactions(filter?: string): Promise<Transaction[]> {
  if (!filter) {
    return storage.transactions
  }

  const requestMatch = filter.match(/\{requestId\}\s*=\s*'([^']+)'/)
  if (requestMatch) {
    const requestId = requestMatch[1]
    return storage.transactions.filter((t) => t.requestId === requestId)
  }

  return storage.transactions
}

// Generate project tags
export function generateProjectTags(repoAnalysis: any, aiEstimation: any): string[] {
  const tags: string[] = []

  if (aiEstimation?.complexity) {
    tags.push(`complexity-${aiEstimation.complexity.toLowerCase()}`)
  }

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

  if (aiEstimation?.riskFactors && aiEstimation.riskFactors.length > 0) {
    tags.push("high-risk")
  }

  if (aiEstimation?.durationDays) {
    if (aiEstimation.durationDays > 14) {
      tags.push("long-term")
    } else if (aiEstimation.durationDays > 7) {
      tags.push("medium-term")
    } else {
      tags.push("short-term")
    }
  }

  return tags
}

// Get all data (for admin panel)
export async function getAllData() {
  return {
    auditRequests: storage.auditRequests,
    auditOwners: storage.auditOwners,
    auditResults: storage.auditResults,
    findings: storage.findings,
    developers: storage.developers,
    auditors: storage.auditors,
    transactions: storage.transactions,
  }
}
