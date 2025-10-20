// Airtable integration for ProofChain database
// Documentation: https://airtable.com/developers/web/api/introduction

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || ""
const AIRTABLE_BASE_ID = process.env.air_table || ""
const AIRTABLE_API_URL = "https://api.airtable.com/v0"

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

const TABLES = {
  DEVELOPERS: "Developers",
  AUDITORS: "Auditors",
  AUDIT_REQUESTS: "AuditRequests",
  AUDIT_OWNERS: "Audit Owners",
  AUDIT_RESULTS: "AuditResults",
  FINDINGS: "Findings",
  TRANSACTIONS: "Transactions",
}

async function airtableRequest(table: string, method = "GET", body?: any, recordId?: string): Promise<any> {
  console.log("[v0] Airtable request:", { table, method, hasBody: !!body, recordId })
  console.log("[v0] Airtable Base ID:", AIRTABLE_BASE_ID ? "Set" : "Missing")
  console.log("[v0] Airtable API Key:", AIRTABLE_API_KEY ? "Set" : "Missing")

  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    throw new Error("Airtable credentials are not configured. Please set the air_table environment variable.")
  }

  const url = recordId
    ? `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}/${recordId}`
    : `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`

  console.log("[v0] Airtable URL:", url)

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    const error = await response.json()
    console.error("[v0] Airtable API error:", error)
    throw new Error(`Airtable API error: ${error.error?.message || response.statusText}`)
  }

  return response.json()
}

export async function createAuditRequest(data: Omit<AuditRequest, "id">): Promise<AuditRequest> {
  const response = await airtableRequest(TABLES.AUDIT_REQUESTS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function getAuditRequest(id: string): Promise<AuditRequest | null> {
  try {
    const response = await airtableRequest(TABLES.AUDIT_REQUESTS, "GET", undefined, id)
    return {
      id: response.id,
      ...response.fields,
    }
  } catch (error) {
    console.error("Error fetching audit request:", error)
    return null
  }
}

export async function updateAuditRequest(id: string, data: Partial<AuditRequest>): Promise<AuditRequest> {
  const response = await airtableRequest(
    TABLES.AUDIT_REQUESTS,
    "PATCH",
    {
      fields: data,
    },
    id,
  )

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function listAuditRequests(filter?: string): Promise<AuditRequest[]> {
  const params = new URLSearchParams()
  if (filter) {
    params.append("filterByFormula", filter)
  }

  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.AUDIT_REQUESTS)}?${params}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch audit requests")
  }

  const data = await response.json()
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }))
}

export async function createAuditOwner(data: Omit<AuditOwner, "id">): Promise<AuditOwner> {
  const response = await airtableRequest(TABLES.AUDIT_OWNERS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function getAuditOwner(id: string): Promise<AuditOwner | null> {
  try {
    const response = await airtableRequest(TABLES.AUDIT_OWNERS, "GET", undefined, id)
    return {
      id: response.id,
      ...response.fields,
    }
  } catch (error) {
    console.error("Error fetching audit owner:", error)
    return null
  }
}

export async function updateAuditOwner(id: string, data: Partial<AuditOwner>): Promise<AuditOwner> {
  const response = await airtableRequest(
    TABLES.AUDIT_OWNERS,
    "PATCH",
    {
      fields: data,
    },
    id,
  )

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function createAuditResult(data: Omit<AuditResult, "id">): Promise<AuditResult> {
  const response = await airtableRequest(TABLES.AUDIT_RESULTS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function getAuditResult(auditRequestId: string): Promise<AuditResult | null> {
  try {
    const filter = `{auditRequestId} = '${auditRequestId}'`
    const params = new URLSearchParams({ filterByFormula: filter })

    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.AUDIT_RESULTS)}?${params}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch audit result")
    }

    const data = await response.json()
    if (data.records.length === 0) return null

    return {
      id: data.records[0].id,
      ...data.records[0].fields,
    }
  } catch (error) {
    console.error("Error fetching audit result:", error)
    return null
  }
}

export async function createFinding(data: Omit<Finding, "id">): Promise<Finding> {
  const response = await airtableRequest(TABLES.FINDINGS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function listFindings(auditRequestId: string): Promise<Finding[]> {
  const filter = `{auditRequestId} = '${auditRequestId}'`
  const params = new URLSearchParams({ filterByFormula: filter })

  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.FINDINGS)}?${params}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch findings")
  }

  const data = await response.json()
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }))
}

export async function createDeveloper(data: Omit<Developer, "id">): Promise<Developer> {
  const response = await airtableRequest(TABLES.DEVELOPERS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function getDeveloper(walletAddress: string): Promise<Developer | null> {
  try {
    const filter = `{walletAddress} = '${walletAddress}'`
    const params = new URLSearchParams({ filterByFormula: filter })

    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.DEVELOPERS)}?${params}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch developer")
    }

    const data = await response.json()
    if (data.records.length === 0) return null

    return {
      id: data.records[0].id,
      ...data.records[0].fields,
    }
  } catch (error) {
    console.error("Error fetching developer:", error)
    return null
  }
}

export async function createAuditor(data: Omit<Auditor, "id">): Promise<Auditor> {
  const response = await airtableRequest(TABLES.AUDITORS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function getAuditor(walletAddress: string): Promise<Auditor | null> {
  try {
    const filter = `{walletAddress} = '${walletAddress}'`
    const params = new URLSearchParams({ filterByFormula: filter })

    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.AUDITORS)}?${params}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch auditor")
    }

    const data = await response.json()
    if (data.records.length === 0) return null

    return {
      id: data.records[0].id,
      ...data.records[0].fields,
    }
  } catch (error) {
    console.error("Error fetching auditor:", error)
    return null
  }
}

export async function listAuditors(): Promise<Auditor[]> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.AUDITORS)}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch auditors")
  }

  const data = await response.json()
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }))
}

export async function createTransaction(data: Omit<Transaction, "id">): Promise<Transaction> {
  const response = await airtableRequest(TABLES.TRANSACTIONS, "POST", {
    fields: data,
  })

  return {
    id: response.id,
    ...response.fields,
  }
}

export async function listTransactions(filter?: string): Promise<Transaction[]> {
  const params = new URLSearchParams()
  if (filter) {
    params.append("filterByFormula", filter)
  }

  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.TRANSACTIONS)}?${params}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch transactions")
  }

  const data = await response.json()
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }))
}

export function generateProjectTags(repoAnalysis: any, aiEstimation: any): string[] {
  const tags: string[] = []

  // Add complexity tag
  if (aiEstimation?.complexity) {
    tags.push(`complexity-${aiEstimation.complexity.toLowerCase()}`)
  }

  // Add file count tags
  if (repoAnalysis.solidityFiles > 10) {
    tags.push("large-codebase")
  } else if (repoAnalysis.solidityFiles > 5) {
    tags.push("medium-codebase")
  } else {
    tags.push("small-codebase")
  }

  // Add LOC tags
  if (repoAnalysis.totalLines > 5000) {
    tags.push("extensive-code")
  } else if (repoAnalysis.totalLines > 1000) {
    tags.push("moderate-code")
  }

  // Add risk-based tags
  if (aiEstimation?.riskFactors && aiEstimation.riskFactors.length > 0) {
    tags.push("high-risk")
  }

  // Add duration tags
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
