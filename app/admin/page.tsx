"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Loader2,
  Hexagon,
  Database,
  Activity,
  BarChart3,
  AlertCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AdminStats {
  totalAudits: number
  availableAudits: number
  inProgressAudits: number
  completedAudits: number
  cancelledAudits: number
  totalRevenue: number
  averagePrice: number
  complexityBreakdown: {
    Quick: number
    Standard: number
    Deep: number
  }
}

interface RecentActivity {
  id: string
  projectName: string
  status: string
  complexity: string
  proposedPrice: number
  createdAt: string
  developerWallet: string
}

interface AuditData {
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
  status: string
  requestNftId?: string
  requestNftAddress?: string
  tags: string[]
  createdAt: string
  updatedAt?: string
  auditResult?: any
  findingsCount: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-success/20 text-success border-success/30"
    case "In Progress":
      return "bg-warning/20 text-warning border-warning/30"
    case "Available":
      return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    case "Cancelled":
      return "bg-destructive/20 text-destructive border-destructive/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-4 h-4" />
    case "In Progress":
      return <Clock className="w-4 h-4" />
    case "Available":
      return <AlertCircle className="w-4 h-4" />
    case "Cancelled":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [allAudits, setAllAudits] = useState<AuditData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch stats and recent activity
      const statsResponse = await fetch("/api/admin/stats")
      if (!statsResponse.ok) throw new Error("Failed to fetch stats")
      const statsData = await statsResponse.json()

      // Fetch all audits
      const auditsResponse = await fetch("/api/admin/audits")
      if (!auditsResponse.ok) throw new Error("Failed to fetch audits")
      const auditsData = await auditsResponse.json()

      setStats(statsData.stats)
      setRecentActivity(statsData.recentActivity)
      setAllAudits(auditsData.audits)
      setError(null)
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setError("Failed to load admin data. Please try again.")
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
            <p className="text-muted-foreground">Loading admin panel...</p>
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
              <Button onClick={fetchAdminData}>Try Again</Button>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Platform overview and audit management</p>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            <Shield className="w-4 h-4 mr-1" />
            Administrator
          </Badge>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAudits}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedAudits}</div>
                <Progress
                  value={stats.totalAudits > 0 ? (stats.completedAudits / stats.totalAudits) * 100 : 0}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgressAudits}</div>
                <p className="text-xs text-muted-foreground">{stats.availableAudits} available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Avg: ${stats.averagePrice.toFixed(0)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="audits">
              <FileText className="w-4 h-4 mr-2" />
              All Audits
            </TabsTrigger>
            <TabsTrigger value="nfts">
              <Hexagon className="w-4 h-4 mr-2" />
              NFT Registry
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest audit submissions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{activity.projectName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(activity.status)} variant="outline">
                              {getStatusIcon(activity.status)}
                              <span className="ml-1 text-xs">{activity.status}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {activity.complexity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">${activity.proposedPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Complexity Breakdown */}
              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle>Complexity Distribution</CardTitle>
                    <CardDescription>Audit packages breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Quick Audits</span>
                        <span className="text-sm text-muted-foreground">{stats.complexityBreakdown.Quick}</span>
                      </div>
                      <Progress
                        value={stats.totalAudits > 0 ? (stats.complexityBreakdown.Quick / stats.totalAudits) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Standard Audits</span>
                        <span className="text-sm text-muted-foreground">{stats.complexityBreakdown.Standard}</span>
                      </div>
                      <Progress
                        value={
                          stats.totalAudits > 0 ? (stats.complexityBreakdown.Standard / stats.totalAudits) * 100 : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Deep Audits</span>
                        <span className="text-sm text-muted-foreground">{stats.complexityBreakdown.Deep}</span>
                      </div>
                      <Progress
                        value={stats.totalAudits > 0 ? (stats.complexityBreakdown.Deep / stats.totalAudits) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Platform status and integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <Database className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-sm">Airtable</p>
                      <p className="text-xs text-success">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <Database className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-sm">IPFS</p>
                      <p className="text-xs text-success">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <Hexagon className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-sm">ApeChain</p>
                      <p className="text-xs text-success">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Audits Tab */}
          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Audits</CardTitle>
                <CardDescription>Complete audit registry from Airtable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allAudits.map((audit) => (
                    <div key={audit.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{audit.projectName}</h3>
                            <Badge className={getStatusColor(audit.status)}>
                              {getStatusIcon(audit.status)}
                              <span className="ml-1">{audit.status}</span>
                            </Badge>
                            <Badge variant="outline">{audit.complexity}</Badge>
                            {audit.requestNftId && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                <Hexagon className="w-3 h-3 mr-1" />
                                NFT #{audit.requestNftId}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{audit.projectDescription}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Developer: {audit.developerWallet.substring(0, 10)}...</span>
                            <span>Hash: {audit.repoHash.substring(0, 12)}...</span>
                            <span>Price: ${audit.proposedPrice}</span>
                            <span>Duration: {audit.estimatedDuration}d</span>
                            <span>Created: {new Date(audit.createdAt).toLocaleDateString()}</span>
                          </div>
                          {audit.tags && audit.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {audit.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {audit.auditResult && (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold">Findings: {audit.findingsCount}</p>
                              {audit.auditResult.ipfsEvidenceHash && (
                                <p className="text-xs text-muted-foreground font-mono">
                                  IPFS: {audit.auditResult.ipfsEvidenceHash.substring(0, 8)}...
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Registry Tab */}
          <TabsContent value="nfts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NFT Registry</CardTitle>
                <CardDescription>All minted audit NFTs on ApeChain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {allAudits
                    .filter((audit) => audit.requestNftId)
                    .map((audit) => (
                      <Card key={audit.id} className="bg-card/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <Hexagon className="w-3 h-3 mr-1" />
                              Request NFT
                            </Badge>
                            <Badge className={getStatusColor(audit.status)} variant="outline">
                              {audit.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-semibold mb-2 text-sm">{audit.projectName}</h3>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>NFT ID: #{audit.requestNftId}</div>
                            {audit.requestNftAddress && (
                              <div className="font-mono">Addr: {audit.requestNftAddress.substring(0, 10)}...</div>
                            )}
                            <div>Complexity: {audit.complexity}</div>
                            <div>Price: ${audit.proposedPrice}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {stats && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Overview</CardTitle>
                    <CardDescription>Audit lifecycle distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <span className="font-semibold">{stats.availableAudits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <span className="font-semibold">{stats.inProgressAudits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-semibold">{stats.completedAudits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">Cancelled</span>
                      </div>
                      <span className="font-semibold">{stats.cancelledAudits}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Metrics</CardTitle>
                    <CardDescription>Financial overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Average Audit Price</p>
                      <p className="text-2xl font-bold">${stats.averagePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {stats.totalAudits > 0 ? ((stats.completedAudits / stats.totalAudits) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
