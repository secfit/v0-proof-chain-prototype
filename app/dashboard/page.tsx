"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Eye,
  Plus,
  Shield,
  FileText,
  Loader2,
  Hexagon,
} from "lucide-react"
import Link from "next/link"
import { VerifyProofButton } from "@/components/verify-proof-button"

interface ProjectData {
  id: string
  name: string
  description: string
  commitmentHash: string
  status: string
  auditPackage: string
  auditor: string
  auditorWallet?: string
  progress: number
  findings: {
    critical: number
    high: number
    medium: number
    low: number
  } | null
  createdAt: string
  verifiedAt: string | null
  requestNftId?: string
  ownerNftId?: string
  resultNftId?: string
  ipfsEvidenceHash?: string
  reportFileUrl?: string
  githubUrl: string
  proposedPrice: number
  acceptedPrice?: number
  tags: string[]
}

interface DashboardStats {
  totalProjects: number
  completedAudits: number
  inProgressAudits: number
  pendingAudits: number
  totalSpent: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success/20 text-success border-success/30"
    case "in-progress":
      return "bg-warning/20 text-warning border-warning/30"
    case "available":
      return "bg-muted/20 text-muted-foreground border-muted/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "in-progress":
      return <Clock className="w-4 h-4" />
    case "available":
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedAudits: 0,
    inProgressAudits: 0,
    pendingAudits: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock wallet address - in production, this would come from wallet connection
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/dashboard?wallet=${walletAddress}`)

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()
      setProjects(data.projects)
      setStats(data.stats)
      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchDashboardData}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Developer Dashboard</h1>
            <p className="text-muted-foreground">Manage your smart contract audits and track verification progress</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <VerifyProofButton variant="outline" />
            <Button asChild>
              <Link href="/upload">
                <Plus className="w-4 h-4 mr-2" />
                New Audit
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">Across all statuses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAudits}</div>
              <p className="text-xs text-muted-foreground">100% verified on-chain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressAudits}</div>
              <p className="text-xs text-muted-foreground">Active audits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent}</div>
              <p className="text-xs text-muted-foreground">On audit services</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="reports">Audit Reports</TabsTrigger>
            <TabsTrigger value="badges">Verification Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Track the status of your smart contract audits from Airtable</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Start by uploading your first smart contract for audit</p>
                    <Button asChild>
                      <Link href="/upload">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Contract
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                            </Badge>
                            <Badge variant="outline">{project.auditPackage}</Badge>
                            {project.requestNftId && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                <Hexagon className="w-3 h-3 mr-1" />
                                NFT #{project.requestNftId}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span>Hash: {project.commitmentHash}</span>
                            <span>Auditor: {project.auditor}</span>
                            <span>Created: {project.createdAt}</span>
                            {project.acceptedPrice && <span>Price: ${project.acceptedPrice}</span>}
                          </div>
                          {project.status !== "available" && (
                            <div className="flex items-center space-x-2">
                              <Progress value={project.progress} className="flex-1 max-w-xs" />
                              <span className="text-sm text-muted-foreground">{project.progress}%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.status === "completed" && (
                            <>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/verification?hash=${project.ipfsEvidenceHash}`}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Report
                                </Link>
                              </Button>
                              <VerifyProofButton
                                hash={project.ipfsEvidenceHash}
                                variant="outline"
                                size="sm"
                                showIcon={false}
                              />
                            </>
                          )}
                          {project.status === "in-progress" && (
                            <Button variant="outline" size="sm">
                              <Clock className="w-4 h-4 mr-1" />
                              Track Progress
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Reports</CardTitle>
                <CardDescription>Download and review your completed audit reports from IPFS</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter((p) => p.status === "completed").length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed audits yet</h3>
                    <p className="text-muted-foreground">Reports will appear here once audits are completed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects
                      .filter((p) => p.status === "completed")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <span>Verified: {project.verifiedAt}</span>
                              <span>Auditor: {project.auditor}</span>
                              {project.ipfsEvidenceHash && (
                                <span className="font-mono text-xs">
                                  IPFS: {project.ipfsEvidenceHash.substring(0, 12)}...
                                </span>
                              )}
                            </div>
                            {project.findings && (
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="destructive" className="text-xs">
                                  {project.findings.critical} Critical
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-500">
                                  {project.findings.high} High
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-500">
                                  {project.findings.medium} Medium
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {project.findings.low} Low
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {project.reportFileUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.reportFileUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4 mr-1" />
                                  PDF
                                </a>
                              </Button>
                            )}
                            {project.ipfsEvidenceHash && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={`https://ipfs.io/ipfs/${project.ipfsEvidenceHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  IPFS
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Badges</CardTitle>
                <CardDescription>View and verify your on-chain audit badges (NFTs)</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter((p) => p.status === "completed").length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No verification badges yet</h3>
                    <p className="text-muted-foreground">Badges will appear here once audits are completed</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects
                      .filter((p) => p.status === "completed")
                      .map((project) => (
                        <Card key={project.id} className="bg-card/50">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-success/20 text-success border-success/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                              <Badge variant="outline">{project.auditPackage}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <h3 className="font-semibold mb-2">{project.name}</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div>Hash: {project.commitmentHash}</div>
                              <div>Auditor: {project.auditor}</div>
                              <div>Verified: {project.verifiedAt}</div>
                              {project.resultNftId && (
                                <div className="flex items-center gap-1">
                                  <Hexagon className="w-3 h-3" />
                                  Result NFT #{project.resultNftId}
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                              <Link href={`/blockchain?nft=${project.resultNftId}`}>
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View on ApeChain
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
