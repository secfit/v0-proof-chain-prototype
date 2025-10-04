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

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("search")
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
          <h1 className="text-3xl font-bold text-foreground mb-2">ZKP Verification Portal</h1>
          <p className="text-muted-foreground mb-6">
            Verify audit proofs and explore cryptographic evidence on ApeChain blockchain
          </p>
          <Button size="lg" onClick={handleVerifyProof} className="bg-primary hover:bg-primary/90">
            <Shield className="w-5 h-5 mr-2" />
            Verify Proof
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="search">Search & Verify</TabsTrigger>
            <TabsTrigger value="recent">Recent Verifications</TabsTrigger>
            <TabsTrigger value="circuits">ZKP Circuits</TabsTrigger>
            <TabsTrigger value="explorer">Blockchain Explorer</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verify Audit Proof</CardTitle>
                <CardDescription>
                  Enter a commitment hash, proof hash, or project name to verify audit results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter commitment hash, proof hash, or project name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {searchQuery && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Search Results</h3>
                      {filteredVerifications.map((verification) => (
                        <div
                          key={verification.id}
                          className="border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedVerification(verification.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{verification.projectName}</h4>
                            <Badge className={getStatusColor(verification.verificationStatus)}>
                              {getStatusIcon(verification.verificationStatus)}
                              <span className="ml-1 capitalize">{verification.verificationStatus}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Commitment Hash:</span>
                              <div className="font-mono text-xs break-all">{verification.commitmentHash}</div>
                            </div>
                            <div>
                              <span className="font-medium">Auditor:</span> {verification.auditor}
                            </div>
                          </div>
                        </div>
                      ))}
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
                                  onClick={() => copyToClipboard(verification.commitmentHash)}
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
                                  onClick={() => copyToClipboard(verification.proofHash)}
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
