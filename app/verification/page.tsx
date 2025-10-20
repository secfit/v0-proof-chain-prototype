"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CheckCircle,
  ExternalLink,
  Copy,
  Shield,
  FileText,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Zap,
  Loader2,
  Check,
  X,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

// Mock verification data
const mockVerifications = [
  {
    id: "1",
    projectName: "DeFi Protocol V2",
    commitmentHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    proofHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    auditor: "SecureAudit Labs",
    auditorId: "0x789abc...",
    verificationStatus: "verified",
    blockNumber: 18234567,
    timestamp: "2024-01-20T14:30:00Z",
    auditPackage: "Deep",
    findings: { critical: 0, high: 1, medium: 3, low: 5 },
    zkpCircuits: ["no_reentrancy", "access_control", "integer_overflow"],
    gasUsed: 245678,
    transactionHash: "0xdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef12",
  },
  {
    id: "2",
    projectName: "NFT Marketplace",
    commitmentHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    proofHash: "0x9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l",
    auditor: "BlockSec Auditors",
    auditorId: "0x456def...",
    verificationStatus: "pending",
    blockNumber: null,
    timestamp: null,
    auditPackage: "Standard",
    findings: null,
    zkpCircuits: ["no_reentrancy", "access_control"],
    gasUsed: null,
    transactionHash: null,
  },
]

const zkpCircuitDetails = {
  no_reentrancy: {
    name: "No Reentrancy",
    description: "Verifies that the contract is protected against reentrancy attacks",
    complexity: "Medium",
    proofSize: "1.2 KB",
  },
  access_control: {
    name: "Access Control",
    description: "Validates proper implementation of access control mechanisms",
    complexity: "Low",
    proofSize: "0.8 KB",
  },
  integer_overflow: {
    name: "Integer Overflow Protection",
    description: "Ensures protection against integer overflow and underflow vulnerabilities",
    complexity: "High",
    proofSize: "2.1 KB",
  },
}

interface VerificationData {
  auditRequest: {
    id: string
    projectName: string
    developerWallet: string
    deadline: string
    status: string
    createdAt: string
  }
  smartContracts: Array<{
    id: string
    contract_address: string
    contract_type: string
    contract_name: string
    contract_symbol: string
    total_supply: number
    decimals: number
    deployment_hash: string
    explorer_url: string
  }>
  auditor: {
    name: string
    wallet: string
    acceptedAt: string
  }
  auditResult: {
    id: string
    findingsCount: number
    vulnerabilitiesCount: number
    severityBreakdown: any
    completionDate: string
    status: string
    evidenceFileHashes: string
  }
  nft: {
    id: string
    address: string
    transactionHash: string
    explorerUrl: string
    metadataUri: string
    ipfsHash: string | null
    ipfsUrl: string | null
  }
  findings: any[]
  ipfsData: any
  ipfsError: string | null
  verification: {
    verified: boolean
    verifiedAt: string
    blockchainVerified: boolean
    ipfsVerified: boolean
    ipfsError: string | null
  }
}

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("search")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = searchParams.get("hash")
    if (hash) {
      setSearchQuery(hash)
      setActiveTab("search")
      // Auto-select first matching verification
      const match = mockVerifications.find(
        (v) =>
          v.commitmentHash.toLowerCase().includes(hash.toLowerCase()) ||
          v.proofHash.toLowerCase().includes(hash.toLowerCase()),
      )
      if (match) {
        setSelectedVerification(match.id)
      }
    }
  }, [searchParams])

  const filteredVerifications = mockVerifications.filter(
    (v) =>
      v.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.commitmentHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.auditor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItems(prev => new Set(prev).add(itemId))
    setTimeout(() => {
      setCopiedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 2000)
  }

  const verifyAudit = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter an audit request ID")
      return
    }

    setIsVerifying(true)
    try {
      console.log('[Verification] Verifying audit request ID:', searchQuery)
      
      const response = await fetch('/api/verify-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditRequestId: searchQuery.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify audit')
      }

      console.log('[Verification] Verification successful:', data.data)
      setVerificationData(data.data)
      // Don't open dialog, results will be shown inline
    } catch (error: any) {
      console.error('[Verification] Error:', error)
      alert("Verification failed: " + error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyProof = () => {
    setActiveTab("search")
    // Scroll to the search input
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="commitment hash"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-success/20 text-success border-success/30"
      case "pending":
        return "bg-warning/20 text-warning border-warning/30"
      case "failed":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "failed":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Audit Certificate Verification</h1>
          <p className="text-muted-foreground mb-6">
            Verify audit certificates by entering an audit request ID. Get comprehensive audit results, blockchain proof, and IPFS data.
          </p>
          <Button size="lg" onClick={handleVerifyProof} className="bg-primary hover:bg-primary/90">
            <Shield className="w-5 h-5 mr-2" />
            Verify Certificate
          </Button>
        </div>

        {/* Stats Cards */}
        {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <p className="text-xs text-muted-foreground">Proof verification rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Gas Cost</CardTitle>
              <Zap className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234K</div>
              <p className="text-xs text-muted-foreground">Gas units per proof</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Circuits</CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">ZKP circuit types</p>
            </CardContent>
          </Card>
        </div>*/}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="search">Search & Verify</TabsTrigger>
            {/*<TabsTrigger value="recent">Recent Verifications</TabsTrigger>
            <TabsTrigger value="circuits">ZKP Circuits</TabsTrigger>
            <TabsTrigger value="explorer">Blockchain Explorer</TabsTrigger>*/}
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verify Audit Certificate</CardTitle>
                <CardDescription>
                  Enter an audit request ID to verify the audit certificate and retrieve comprehensive audit results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter audit request ID to verify..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && verifyAudit()}
                      />
                    </div>
                    <Button 
                      onClick={verifyAudit}
                      disabled={isVerifying || !searchQuery.trim()}
                    >
                      {isVerifying ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                      <Search className="w-4 h-4 mr-2" />
                      )}
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>

                  {searchQuery && !isVerifying && !verificationData && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Verify" to check the audit certificate</p>
                    </div>
                  )}

                  {/* Verification Results */}
                  {verificationData && (
                    <div className="space-y-6 mt-6">
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Verification Results
                        </h3>
                        
                        {/* Verification Status */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              Verification Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2">
                                {verificationData.verification.blockchainVerified ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm">Blockchain Verified</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {verificationData.verification.ipfsVerified ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm">IPFS Verified</span>
                                {verificationData.verification.ipfsError && (
                                  <span className="text-xs text-red-500 ml-2">
                                    ({verificationData.verification.ipfsError})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">Database Verified</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Project Information */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Project Name</Label>
                                <p className="text-sm font-semibold">{verificationData.auditRequest.projectName}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Audit Request ID</Label>
                                <p className="text-sm font-mono">#{verificationData.auditRequest.id}</p>
                              </div>
                              {verificationData.smartContracts && verificationData.smartContracts.length > 0 && (
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">Smart Contracts</Label>
                                  <div className="space-y-2 mt-2">
                                    {verificationData.smartContracts.map((contract, index) => (
                                      <div key={contract.id} className="border border-border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <div>
                                            <p className="text-sm font-semibold">{contract.contract_name || `Contract ${index + 1}`}</p>
                                            <p className="text-xs text-muted-foreground">{contract.contract_type}</p>
                                          </div>
                                          <Badge variant="outline">{contract.contract_symbol || 'N/A'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-mono flex-1 truncate">{contract.contract_address}</p>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(contract.contract_address, `contract-${index}`)}
                                            className="h-8 w-8 p-0"
                                          >
                                            {copiedItems.has(`contract-${index}`) ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="h-8 w-8 p-0"
                                          >
                                            <a 
                                              href={`https://curtis.explorer.caldera.xyz/address/${contract.contract_address}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </a>
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium">Developer Wallet</Label>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-mono flex-1 truncate">{verificationData.auditRequest.developerWallet}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(verificationData.auditRequest.developerWallet, 'developer-wallet')}
                                    className="h-8 w-8 p-0"
                                  >
                                    {copiedItems.has('developer-wallet') ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Auditor Information */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Auditor Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Auditor Name</Label>
                                <p className="text-sm font-semibold">{verificationData.auditor.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Auditor Wallet</Label>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-mono flex-1 truncate">{verificationData.auditor.wallet}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(verificationData.auditor.wallet, 'auditor-wallet')}
                                    className="h-8 w-8 p-0"
                                  >
                                    {copiedItems.has('auditor-wallet') ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Accepted At</Label>
                                <p className="text-sm">{new Date(verificationData.auditor.acceptedAt).toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Completed At</Label>
                                <p className="text-sm">{new Date(verificationData.auditResult.completionDate).toLocaleString()}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Audit Results */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Audit Results</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Total Findings</Label>
                                <p className="text-2xl font-bold">{verificationData.auditResult.findingsCount}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Vulnerabilities</Label>
                                <p className="text-2xl font-bold text-red-500">{verificationData.auditResult.vulnerabilitiesCount}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {verificationData.auditResult.status}
                            </Badge>
                          </div>
                            </div>

                            {verificationData.auditResult.severityBreakdown && (
                              <div>
                                <Label className="text-sm font-medium">Severity Breakdown</Label>
                                <div className="flex items-center gap-4 mt-2">
                                  {verificationData.auditResult.severityBreakdown.critical > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {verificationData.auditResult.severityBreakdown.critical} Critical
                                    </Badge>
                                  )}
                                  {verificationData.auditResult.severityBreakdown.high > 0 && (
                                    <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-500">
                                      {verificationData.auditResult.severityBreakdown.high} High
                                    </Badge>
                                  )}
                                  {verificationData.auditResult.severityBreakdown.medium > 0 && (
                                    <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-500">
                                      {verificationData.auditResult.severityBreakdown.medium} Medium
                                    </Badge>
                                  )}
                                  {verificationData.auditResult.severityBreakdown.low > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {verificationData.auditResult.severityBreakdown.low} Low
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* NFT Information */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Audit Result NFT</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Token ID</Label>
                                <p className="text-sm font-mono">#{verificationData.nft.id}</p>
                              </div>
                              {verificationData.nft.address && (
                                <div>
                                  <Label className="text-sm font-medium">Contract Address</Label>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono flex-1 truncate">{verificationData.nft.address}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(verificationData.nft.address, 'nft-contract')}
                                      className="h-8 w-8 p-0"
                                    >
                                      {copiedItems.has('nft-contract') ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                      className="h-8 w-8 p-0"
                                    >
                                      <a 
                                        href={`https://curtis.explorer.caldera.xyz/address/${verificationData.nft.address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              )}
                              {verificationData.nft.transactionHash && (
                                <div>
                                  <Label className="text-sm font-medium">Transaction Hash</Label>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono flex-1 truncate">{verificationData.nft.transactionHash}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(verificationData.nft.transactionHash, 'nft-tx')}
                                      className="h-8 w-8 p-0"
                                    >
                                      {copiedItems.has('nft-tx') ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                      className="h-8 w-8 p-0"
                                    >
                                      <a 
                                        href={`https://curtis.explorer.caldera.xyz/tx/${verificationData.nft.transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* IPFS Data */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>IPFS Audit Data</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">IPFS Hash</Label>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-mono flex-1 truncate">{verificationData.nft.ipfsHash || verificationData.nft.metadataUri}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(verificationData.nft.ipfsHash || verificationData.nft.metadataUri, 'ipfs-hash')}
                                    className="h-8 w-8 p-0"
                                  >
                                    {copiedItems.has('ipfs-hash') ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-8 w-8 p-0"
                                  >
                                    <a 
                                      href={verificationData.nft.ipfsUrl || verificationData.nft.ipfsHash || verificationData.nft.metadataUri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                              
                              {verificationData.ipfsData ? (
                                <div>
                                  <Label className="text-sm font-medium">IPFS Content Preview</Label>
                                  <div className="bg-muted/50 p-4 rounded-lg max-h-40 overflow-y-auto">
                                    <pre className="text-xs whitespace-pre-wrap">
                                      {JSON.stringify(verificationData.ipfsData, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <Label className="text-sm font-medium">IPFS Status</Label>
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <X className="w-4 h-4 text-red-500" />
                                      <span className="text-sm font-medium text-red-700">IPFS Data Not Available</span>
                                    </div>
                                    <p className="text-sm text-red-600">
                                      {verificationData.ipfsError || 'Unable to fetch IPFS data'}
                                    </p>
                                    <p className="text-xs text-red-500 mt-2">
                                      You can still access the IPFS data directly using the link above.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Findings */}
                        {verificationData.findings && verificationData.findings.length > 0 && (
                          <Card className="mb-6">
                            <CardHeader>
                              <CardTitle>Audit Findings</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {verificationData.findings.map((finding, index) => (
                                  <div key={index} className="border border-border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold">{finding.title}</h4>
                                      <Badge 
                                        variant={finding.finding_severity === 'critical' ? 'destructive' : 
                                               finding.finding_severity === 'high' ? 'secondary' : 'outline'}
                                        className={finding.finding_severity === 'high' ? 'bg-orange-500/20 text-orange-500' : 
                                                  finding.finding_severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                                      >
                                        {finding.finding_severity}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                                    {finding.recommendation && (
                                      <div>
                                        <Label className="text-xs font-medium">Recommendation:</Label>
                                        <p className="text-xs text-muted-foreground">{finding.recommendation}</p>
                                      </div>
                                    )}
                        </div>
                      ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedVerification && (
              <Card>
                <CardHeader>
                  <CardTitle>Verification Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const verification = mockVerifications.find((v) => v.id === selectedVerification)
                    if (!verification) return null

                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Project Name</Label>
                              <div className="font-semibold">{verification.projectName}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Commitment Hash</Label>
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {verification.commitmentHash}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(verification.commitmentHash, 'commitment-hash')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Proof Hash</Label>
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-muted px-2 py-1 rounded">{verification.proofHash}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(verification.proofHash, 'proof-hash')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Auditor</Label>
                              <div>{verification.auditor}</div>
                              <div className="text-xs text-muted-foreground font-mono">{verification.auditorId}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                              <div>
                                <Badge className={getStatusColor(verification.verificationStatus)}>
                                  {getStatusIcon(verification.verificationStatus)}
                                  <span className="ml-1 capitalize">{verification.verificationStatus}</span>
                                </Badge>
                              </div>
                            </div>
                            {verification.verificationStatus === "verified" && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Block Number</Label>
                                <div className="flex items-center space-x-2">
                                  <span>{verification.blockNumber?.toLocaleString()}</span>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {verification.verificationStatus === "verified" && verification.findings && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Audit Findings</Label>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="destructive" className="text-xs">
                                {verification.findings.critical} Critical
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-500">
                                {verification.findings.high} High
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-500">
                                {verification.findings.medium} Medium
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {verification.findings.low} Low
                              </Badge>
                            </div>
                          </div>
                        )}

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">ZKP Circuits Used</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {verification.zkpCircuits.map((circuit) => (
                              <Badge key={circuit} variant="outline" className="bg-primary/10">
                                {zkpCircuitDetails[circuit as keyof typeof zkpCircuitDetails]?.name || circuit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {verification.verificationStatus === "verified" && (
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View on ApeChain
                            </Button>
                            <Button variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download Proof
                            </Button>
                            <Button variant="outline">
                              <FileText className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Verifications</CardTitle>
                <CardDescription>Latest audit proofs verified on ApeChain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{verification.projectName}</h4>
                          <Badge className={getStatusColor(verification.verificationStatus)}>
                            {getStatusIcon(verification.verificationStatus)}
                            <span className="ml-1 capitalize">{verification.verificationStatus}</span>
                          </Badge>
                          <Badge variant="outline">{verification.auditPackage}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Auditor: {verification.auditor}</span>
                          {verification.timestamp && (
                            <span>Verified: {new Date(verification.timestamp).toLocaleDateString()}</span>
                          )}
                          {verification.blockNumber && <span>Block: {verification.blockNumber.toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedVerification(verification.id)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {verification.verificationStatus === "verified" && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            ApeChain
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="circuits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ZKP Circuit Library</CardTitle>
                <CardDescription>Available zero-knowledge proof circuits for audit verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(zkpCircuitDetails).map(([key, circuit]) => (
                    <Card key={key} className="bg-card/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{circuit.name}</CardTitle>
                          <Badge variant="outline">{circuit.complexity}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{circuit.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Proof Size: {circuit.proofSize}</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explorer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ApeChain Explorer</CardTitle>
                <CardDescription>Explore verified audit proofs on the blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Latest Block</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">18,234,567</div>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Total Proofs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Network Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-success/20 text-success border-success/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Healthy
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">99.9% uptime</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Recent Transactions</h3>
                    {mockVerifications
                      .filter((v) => v.verificationStatus === "verified")
                      .map((verification) => (
                        <div
                          key={verification.id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-success" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{verification.projectName}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {verification.transactionHash?.slice(0, 20)}...
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">Block {verification.blockNumber?.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {verification.gasUsed?.toLocaleString()} gas
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}
