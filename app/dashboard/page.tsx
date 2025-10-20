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
  TrendingUp,
  Shield,
  FileText,
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockProjects = [
  {
    id: "1",
    name: "DeFi Protocol V2",
    commitmentHash: "0x1a2b3c4d...",
    status: "verified",
    auditPackage: "Deep",
    auditor: "SecureAudit Labs",
    progress: 100,
    findings: { critical: 0, high: 1, medium: 3, low: 5 },
    createdAt: "2024-01-15",
    verifiedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "NFT Marketplace",
    commitmentHash: "0x5e6f7g8h...",
    status: "in-progress",
    auditPackage: "Standard",
    auditor: "BlockSec Auditors",
    progress: 65,
    findings: null,
    createdAt: "2024-01-18",
    verifiedAt: null,
  },
  {
    id: "3",
    name: "Governance Token",
    commitmentHash: "0x9i0j1k2l...",
    status: "pending",
    auditPackage: "Quick",
    auditor: "Pending Assignment",
    progress: 10,
    findings: null,
    createdAt: "2024-01-22",
    verifiedAt: null,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-success/20 text-success border-success/30"
    case "in-progress":
      return "bg-warning/20 text-warning border-warning/30"
    case "pending":
      return "bg-muted/20 text-muted-foreground border-muted/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="w-4 h-4" />
    case "in-progress":
      return <Clock className="w-4 h-4" />
    case "pending":
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function DashboardPage() {
  const totalProjects = mockProjects.length
  const completedAudits = mockProjects.filter((p) => p.status === "verified").length
  const inProgressAudits = mockProjects.filter((p) => p.status === "in-progress").length

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
          <Button asChild className="mt-4 sm:mt-0">
            <Link href="/upload">
              <Plus className="w-4 h-4 mr-2" />
              New Audit
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAudits}</div>
              <p className="text-xs text-muted-foreground">100% verified on-chain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressAudits}</div>
              <p className="text-xs text-muted-foreground">Avg. 5 days completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +2.1% from last audit
              </p>
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
                <CardDescription>Track the status of your smart contract audits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{project.name}</h3>
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">{project.status}</span>
                          </Badge>
                          <Badge variant="outline">{project.auditPackage}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span>Hash: {project.commitmentHash}</span>
                          <span>Auditor: {project.auditor}</span>
                          <span>Created: {project.createdAt}</span>
                        </div>
                        {project.status !== "pending" && (
                          <div className="flex items-center space-x-2">
                            <Progress value={project.progress} className="flex-1 max-w-xs" />
                            <span className="text-sm text-muted-foreground">{project.progress}%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {project.status === "verified" && (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Verify Badge
                            </Button>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Reports</CardTitle>
                <CardDescription>Download and review your completed audit reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProjects
                    .filter((p) => p.status === "verified")
                    .map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Verified: {project.verifiedAt}</span>
                            <span>Auditor: {project.auditor}</span>
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
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            JSON
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Badges</CardTitle>
                <CardDescription>View and verify your on-chain audit badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProjects
                    .filter((p) => p.status === "verified")
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
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View on ApeChain
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
