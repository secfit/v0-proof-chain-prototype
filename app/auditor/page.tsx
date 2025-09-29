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
  Download,
  Eye,
  Star,
  TrendingUp,
  Shield,
  FileText,
  Users,
  Award,
} from "lucide-react"
import Link from "next/link"

// Mock data for auditor dashboard
const mockJobs = [
  {
    id: "1",
    projectName: "DeFi Protocol V2",
    commitmentHash: "0x1a2b3c4d...",
    status: "assigned",
    auditPackage: "Deep",
    deadline: "2024-02-01",
    ndaStatus: "signed",
    priority: "high",
    estimatedHours: 40,
    completedHours: 0,
  },
  {
    id: "2",
    projectName: "NFT Marketplace",
    commitmentHash: "0x5e6f7g8h...",
    status: "in-progress",
    auditPackage: "Standard",
    deadline: "2024-01-28",
    ndaStatus: "signed",
    priority: "medium",
    estimatedHours: 20,
    completedHours: 13,
  },
  {
    id: "3",
    projectName: "Governance Token",
    commitmentHash: "0x9i0j1k2l...",
    status: "submitted",
    auditPackage: "Quick",
    deadline: "2024-01-25",
    ndaStatus: "signed",
    priority: "low",
    estimatedHours: 8,
    completedHours: 8,
  },
]

const auditorStats = {
  totalAudits: 47,
  completedThisMonth: 8,
  averageRating: 4.9,
  reputationScore: 892,
  stakedTokens: 5000,
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-success/20 text-success border-success/30"
    case "in-progress":
      return "bg-warning/20 text-warning border-warning/30"
    case "assigned":
      return "bg-primary/20 text-primary border-primary/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/20 text-destructive border-destructive/30"
    case "medium":
      return "bg-warning/20 text-warning border-warning/30"
    case "low":
      return "bg-muted/20 text-muted-foreground border-muted/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

export default function AuditorDashboard() {
  const activeJobs = mockJobs.filter((job) => job.status !== "submitted").length
  const completedJobs = mockJobs.filter((job) => job.status === "submitted").length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Auditor Workspace</h1>
            <p className="text-muted-foreground">Manage your audit assignments and track your reputation</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Badge className="bg-success/20 text-success border-success/30">
              <Star className="w-3 h-3 mr-1" />
              Verified Auditor
            </Badge>
            <Badge variant="outline">Reputation: {auditorStats.reputationScore}</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditorStats.completedThisMonth}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditorStats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reputation</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditorStats.reputationScore}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staked</CardTitle>
              <Shield className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditorStats.stakedTokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">PROOF tokens</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="tools">Audit Tools</TabsTrigger>
            <TabsTrigger value="evidence">Evidence & Logs</TabsTrigger>
            <TabsTrigger value="profile">Profile & Reputation</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Audit Jobs</CardTitle>
                <CardDescription>Manage your current and upcoming audit assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{job.projectName}</h3>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status === "assigned" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {job.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                            {job.status === "submitted" && <CheckCircle className="w-3 h-3 mr-1" />}
                            <span className="capitalize">{job.status.replace("-", " ")}</span>
                          </Badge>
                          <Badge className={getPriorityColor(job.priority)}>{job.priority} priority</Badge>
                          <Badge variant="outline">{job.auditPackage}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span>Hash: {job.commitmentHash}</span>
                          <span>Deadline: {job.deadline}</span>
                          <span>NDA: {job.ndaStatus}</span>
                        </div>
                        {job.status === "in-progress" && (
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={(job.completedHours / job.estimatedHours) * 100}
                              className="flex-1 max-w-xs"
                            />
                            <span className="text-sm text-muted-foreground">
                              {job.completedHours}/{job.estimatedHours}h
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {job.status === "assigned" && (
                          <Button asChild>
                            <Link href={`/auditor/job/${job.id}`}>Start Audit</Link>
                          </Button>
                        )}
                        {job.status === "in-progress" && (
                          <Button asChild>
                            <Link href={`/auditor/job/${job.id}`}>Continue</Link>
                          </Button>
                        )}
                        {job.status === "submitted" && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Static Analysis
                  </CardTitle>
                  <CardDescription>Automated security pattern detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slither</span>
                      <Badge variant="outline">v0.9.6</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mythril</span>
                      <Badge variant="outline">v0.23.15</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Semgrep</span>
                      <Badge variant="outline">v1.45.0</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Launch Tools
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Dynamic Analysis
                  </CardTitle>
                  <CardDescription>Runtime behavior analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manticore</span>
                      <Badge variant="outline">v0.3.7</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Echidna</span>
                      <Badge variant="outline">v2.2.1</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Foundry</span>
                      <Badge variant="outline">v0.2.0</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Launch Tools
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Manual Review
                  </CardTitle>
                  <CardDescription>Code review and documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">VS Code</span>
                      <Badge variant="outline">Web IDE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Solidity</span>
                      <Badge variant="outline">v0.8.21</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hardhat</span>
                      <Badge variant="outline">v2.17.2</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Open IDE
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Evidence & Logs</CardTitle>
                <CardDescription>Manage your audit evidence and generate ZKP witness files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-card/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Evidence Collection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Static Analysis Reports</span>
                            <Badge variant="outline">3 files</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Manual Review Notes</span>
                            <Badge variant="outline">12 entries</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Test Results</span>
                            <Badge variant="outline">5 suites</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Download className="w-4 h-4 mr-1" />
                            Export Evidence
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">ZKP Witness Generation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Witness Files</span>
                            <Badge className="bg-success/20 text-success border-success/30">Ready</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Circuit Inputs</span>
                            <Badge className="bg-success/20 text-success border-success/30">Valid</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Proof Status</span>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                          <Button size="sm" className="w-full">
                            Generate Proof
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-muted/20">
                    <CardHeader>
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Slither analysis completed</span>
                          <span className="text-muted-foreground">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Manual review: Access control patterns</span>
                          <span className="text-muted-foreground">4 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Test suite execution completed</span>
                          <span className="text-muted-foreground">6 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Evidence package uploaded</span>
                          <span className="text-muted-foreground">1 day ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auditor Profile</CardTitle>
                  <CardDescription>Your reputation and verification status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Audits Completed</span>
                      <Badge variant="outline">{auditorStats.totalAudits}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning mr-1" />
                        <span>{auditorStats.averageRating}/5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reputation Score</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {auditorStats.reputationScore}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verification Status</span>
                      <Badge className="bg-success/20 text-success border-success/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staking & Governance</CardTitle>
                  <CardDescription>Manage your stake and participate in governance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Staked PROOF Tokens</span>
                      <Badge variant="outline">{auditorStats.stakedTokens.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voting Power</span>
                      <Badge variant="outline">2.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Proposals</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Manage Stake
                      </Button>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Governance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
