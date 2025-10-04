"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  ExternalLink,
  Shield,
  FileText,
  Users,
  DollarSign,
  Timer,
  Bot,
  Loader2,
} from "lucide-react"

const mockAudits = [
  {
    id: "1",
    contractHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    status: "available",
    auditPackage: "Deep",
    proposedPrice: 110,
    negotiatedPrice: null,
    deadline: "7 days",
    complexity: "High",
    contractType: "DeFi Protocol",
    linesOfCode: 2500,
    specializations: ["DeFi", "Flash Loans", "Governance"],
    sanitized: true,
    obfuscated: false,
    auditorCount: 1,
    aiNegotiation: false,
  },
  {
    id: "2",
    contractHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    status: "in-progress",
    auditPackage: "Standard",
    proposedPrice: 75,
    negotiatedPrice: 85,
    deadline: "3 days remaining",
    complexity: "Medium",
    contractType: "NFT Marketplace",
    linesOfCode: 1200,
    specializations: ["NFT", "Marketplace", "Royalties"],
    sanitized: true,
    obfuscated: true,
    auditorCount: 2,
    aiNegotiation: true,
    progress: 65,
    startDate: "2024-01-18",
  },
  {
    id: "3",
    contractHash: "0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
    status: "pending-acceptance",
    auditPackage: "Quick",
    proposedPrice: 50,
    negotiatedPrice: 60,
    deadline: "2 days",
    complexity: "Low",
    contractType: "Token Contract",
    linesOfCode: 400,
    specializations: ["Token", "ERC20"],
    sanitized: true,
    obfuscated: false,
    auditorCount: 1,
    aiNegotiation: true,
  },
  {
    id: "4",
    contractHash: "0xm3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    status: "completed",
    auditPackage: "Standard",
    proposedPrice: 75,
    negotiatedPrice: 90,
    deadline: "Completed",
    complexity: "Medium",
    contractType: "Governance Contract",
    linesOfCode: 800,
    specializations: ["Governance", "Voting"],
    sanitized: true,
    obfuscated: false,
    auditorCount: 1,
    aiNegotiation: true,
    progress: 100,
    completedDate: "2024-01-15",
    findings: { critical: 0, high: 1, medium: 2, low: 3 },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-success/20 text-success border-success/30"
    case "pending-acceptance":
      return "bg-warning/20 text-warning border-warning/30"
    case "in-progress":
      return "bg-primary/20 text-primary border-primary/30"
    case "completed":
      return "bg-muted/20 text-muted-foreground border-muted/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "available":
      return <AlertTriangle className="w-4 h-4" />
    case "pending-acceptance":
      return <Clock className="w-4 h-4" />
    case "in-progress":
      return <Clock className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case "Critical":
      return "bg-destructive/20 text-destructive border-destructive/30"
    case "High":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "Medium":
      return "bg-warning/20 text-warning border-warning/30"
    case "Low":
      return "bg-success/20 text-success border-success/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

export default function AuditsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [complexityFilter, setComplexityFilter] = useState("All")

  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const [selectedAudit, setSelectedAudit] = useState<any>(null)
  const [auditorName, setAuditorName] = useState("")
  const [auditorWallet, setAuditorWallet] = useState("")
  const [estimatedDays, setEstimatedDays] = useState("")
  const [isAccepting, setIsAccepting] = useState(false)
  const [nftConfirmation, setNftConfirmation] = useState<any>(null)

  const statusOptions = ["All", "available", "pending-acceptance", "in-progress", "completed"]
  const complexityOptions = ["All", "Critical", "High", "Medium", "Low"]

  const filteredAudits = mockAudits.filter((audit) => {
    const matchesSearch =
      audit.contractType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.contractHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.specializations.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "All" || audit.status === statusFilter
    const matchesComplexity = complexityFilter === "All" || audit.complexity === complexityFilter

    return matchesSearch && matchesStatus && matchesComplexity
  })

  const totalAudits = mockAudits.length
  const availableAudits = mockAudits.filter((a) => a.status === "available").length
  const inProgressAudits = mockAudits.filter((a) => a.status === "in-progress").length
  const completedAudits = mockAudits.filter((a) => a.status === "completed").length

  const handleAcceptAudit = (audit: any) => {
    setSelectedAudit(audit)
    setIsAcceptDialogOpen(true)
    setNftConfirmation(null)
  }

  const handleSubmitAccept = async () => {
    if (!auditorName || !auditorWallet || !estimatedDays) {
      alert("Please fill in all fields")
      return
    }

    setIsAccepting(true)

    try {
      const response = await fetch("/api/accept-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditRequestId: selectedAudit.id,
          auditorWallet,
          auditorName,
          acceptedPrice: selectedAudit.negotiatedPrice || selectedAudit.proposedPrice,
          estimatedCompletionDays: Number.parseInt(estimatedDays),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept audit")
      }

      console.log("[v0] Audit accepted successfully:", data)
      setNftConfirmation(data.nft)

      // Redirect to auditor job page after a delay
      setTimeout(() => {
        window.location.href = `/auditor/job/${selectedAudit.id}`
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Error accepting audit:", error)
      alert(error.message || "Failed to accept audit")
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Audit Contracts</h1>
          <p className="text-muted-foreground">
            Anonymized smart contracts ready for security auditing with ZKP verification
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <AlertTriangle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableAudits}</div>
              <p className="text-xs text-muted-foreground">Ready for assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressAudits}</div>
              <p className="text-xs text-muted-foreground">Currently auditing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAudits}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$78</div>
              <p className="text-xs text-muted-foreground">Per audit completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by contract type, hash, or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "All"
                        ? "All Status"
                        : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                  value={complexityFilter}
                  onChange={(e) => setComplexityFilter(e.target.value)}
                >
                  {complexityOptions.map((complexity) => (
                    <option key={complexity} value={complexity}>
                      {complexity === "All" ? "All Complexity" : complexity}
                    </option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-4">
          {filteredAudits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{audit.contractType}</h3>
                      <Badge className={getStatusColor(audit.status)}>
                        {getStatusIcon(audit.status)}
                        <span className="ml-1 capitalize">{audit.status.replace("-", " ")}</span>
                      </Badge>
                      <Badge variant="outline">{audit.auditPackage}</Badge>
                      <Badge className={getComplexityColor(audit.complexity)}>{audit.complexity}</Badge>
                      {audit.aiNegotiation && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Negotiated
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        <span>Hash: {audit.contractHash.slice(0, 10)}...</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>Lines: {audit.linesOfCode.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Auditors: {audit.auditorCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Timer className="w-4 h-4 mr-1" />
                        <span>Deadline: {audit.deadline}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {audit.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {audit.sanitized && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                          Sanitized
                        </Badge>
                      )}
                      {audit.obfuscated && (
                        <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                          Obfuscated
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Proposed: </span>
                        <span className="font-medium">${audit.proposedPrice}</span>
                        {audit.negotiatedPrice && (
                          <>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span className="font-medium text-success">${audit.negotiatedPrice}</span>
                          </>
                        )}
                      </div>
                      {audit.startDate && <span className="text-muted-foreground">Started: {audit.startDate}</span>}
                      {audit.completedDate && (
                        <span className="text-muted-foreground">Completed: {audit.completedDate}</span>
                      )}
                    </div>

                    {audit.status === "in-progress" && audit.progress && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Progress value={audit.progress} className="flex-1 max-w-xs" />
                        <span className="text-sm text-muted-foreground">{audit.progress}%</span>
                      </div>
                    )}

                    {audit.findings && (
                      <div className="flex items-center space-x-3 mt-3">
                        <span className="text-sm text-muted-foreground">Findings:</span>
                        {audit.findings.critical > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {audit.findings.critical} Critical
                          </Badge>
                        )}
                        {audit.findings.high > 0 && (
                          <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-500">
                            {audit.findings.high} High
                          </Badge>
                        )}
                        {audit.findings.medium > 0 && (
                          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-500">
                            {audit.findings.medium} Medium
                          </Badge>
                        )}
                        {audit.findings.low > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {audit.findings.low} Low
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 lg:items-end">
                    <div className="flex space-x-2">
                      {audit.status === "available" && (
                        <Button size="sm" onClick={() => handleAcceptAudit(audit)}>
                          Accept ${audit.proposedPrice}
                        </Button>
                      )}
                      {audit.status === "pending-acceptance" && (
                        <Button size="sm" onClick={() => handleAcceptAudit(audit)}>
                          Accept ${audit.negotiatedPrice}
                        </Button>
                      )}
                      {audit.status === "in-progress" && (
                        <Button asChild>
                          <a href={`/auditor/job/${audit.id}`}>Continue Audit</a>
                        </Button>
                      )}
                      {audit.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Verify ZKP
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAudits.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Accept Audit & Mint Ownership NFT</DialogTitle>
            <DialogDescription>
              Provide your details to accept this audit. An Audit Owner NFT will be minted on ApeChain.
            </DialogDescription>
          </DialogHeader>

          {!nftConfirmation ? (
            <div className="space-y-4">
              {selectedAudit && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Audit Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Contract:</span> {selectedAudit.contractType}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Complexity:</span> {selectedAudit.complexity}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span> $
                      {selectedAudit.negotiatedPrice || selectedAudit.proposedPrice}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lines of Code:</span>{" "}
                      {selectedAudit.linesOfCode.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="auditorName">Your Name</Label>
                <Input
                  id="auditorName"
                  placeholder="e.g., John Doe"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auditorWallet">Your Wallet Address</Label>
                <Input
                  id="auditorWallet"
                  placeholder="0x..."
                  value={auditorWallet}
                  onChange={(e) => setAuditorWallet(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This wallet will receive the Audit Owner NFT and payments
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Estimated Completion (days)</Label>
                <Input
                  id="estimatedDays"
                  type="number"
                  min="1"
                  placeholder="e.g., 7"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Audit Owner NFT
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Upon acceptance, you'll receive an ERC-721 Audit Owner NFT containing:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Reference to Audit Request NFT #{selectedAudit?.id}</li>
                  <li>• Your auditor details and wallet address</li>
                  <li>• Accepted price and timeline</li>
                  <li>• Start date and estimated completion</li>
                  <li>• Immutable ownership proof on ApeChain</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)} disabled={isAccepting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAccept} disabled={isAccepting}>
                  {isAccepting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    "Accept & Mint NFT"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-success font-semibold mb-3">
                  <CheckCircle className="w-5 h-5" />
                  Audit Owner NFT Minted Successfully!
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Token ID:</span>{" "}
                    <span className="font-mono font-semibold">#{nftConfirmation.tokenId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transaction:</span>{" "}
                    <a
                      href={nftConfirmation.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View on Explorer
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-success" />
                  Your Audit Owner NFT has been linked to Audit Request NFT #{selectedAudit?.id}. Redirecting to audit
                  workspace...
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
