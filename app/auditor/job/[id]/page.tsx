"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  Upload,
  FileCode,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Terminal,
  Eye,
  Save,
  Send,
  Timer,
  Bot,
} from "lucide-react"

// Mock job data - completely anonymized
const jobData = {
  id: "2",
  contractHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
  status: "in-progress",
  auditPackage: "Standard",
  deadline: "2024-01-28",
  timeRemaining: "3 days, 14 hours",
  negotiatedPrice: 85,
  originalPrice: 75,
  estimatedHours: 20,
  completedHours: 13,
  contractType: "NFT Marketplace",
  linesOfCode: 1200,
  complexity: "Medium",
  specializations: ["NFT", "Marketplace", "Royalties"],
  sanitized: true,
  obfuscated: true,
  files: ["Contract_A.sol", "Contract_B.sol", "Contract_C.sol", "Contract_D.sol"],
}

const vulnerabilityCategories = [
  { id: "reentrancy", name: "Reentrancy", checked: false },
  { id: "integer_overflow", name: "Integer Overflows/Underflows", checked: false },
  { id: "access_control", name: "Access Control Issues", checked: false },
  { id: "frontrunning", name: "Front-running / MEV", checked: false },
  { id: "unchecked_calls", name: "Unchecked External Calls", checked: false },
  { id: "insecure_randomness", name: "Insecure Randomness", checked: false },
  { id: "timestamp_dependence", name: "Timestamp Dependence", checked: false },
  { id: "unprotected_selfdestruct", name: "Unprotected Selfdestruct / Delegatecall", checked: false },
  { id: "gas_limit", name: "Gas Limit / Block Stuffing", checked: false },
  { id: "oracle_manipulation", name: "Oracle Manipulation", checked: false },
  { id: "other", name: "Other", checked: false },
]

const auditChecks = [
  { id: "access_control", name: "Access Control Analysis", status: "completed", severity: "high" },
  { id: "reentrancy", name: "Reentrancy Protection", status: "completed", severity: "critical" },
  { id: "integer_overflow", name: "Integer Overflow/Underflow", status: "completed", severity: "high" },
  { id: "gas_optimization", name: "Gas Optimization", status: "in-progress", severity: "medium" },
  { id: "business_logic", name: "Business Logic Review", status: "pending", severity: "high" },
  { id: "documentation", name: "Code Quality Assessment", status: "pending", severity: "low" },
]

const findings = [
  {
    id: 1,
    severity: "medium",
    title: "Inefficient gas usage in batch operations",
    description: "The batch function could be optimized to reduce gas costs.",
    status: "open",
    line: 145,
    file: "Contract_A.sol",
    category: "gas_limit",
  },
  {
    id: 2,
    severity: "low",
    title: "Missing event emission",
    description: "Consider emitting an event when rates are updated.",
    status: "open",
    line: 89,
    file: "Contract_C.sol",
    category: "other",
  },
]

export default function AuditorJobPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [auditNotes, setAuditNotes] = useState("")
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState(vulnerabilityCategories)
  const [otherVulnerability, setOtherVulnerability] = useState("")
  const [newFinding, setNewFinding] = useState({
    severity: "medium",
    title: "",
    description: "",
    file: "",
    line: "",
    category: "other",
  })

  const completedChecks = auditChecks.filter((check) => check.status === "completed").length
  const totalChecks = auditChecks.length
  const progressPercentage = (completedChecks / totalChecks) * 100

  const handleVulnerabilityChange = (id: string, checked: boolean) => {
    setSelectedVulnerabilities((prev) => prev.map((vuln) => (vuln.id === id ? { ...vuln, checked } : vuln)))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Anonymous Contract Audit</h1>
            <p className="text-muted-foreground">
              {jobData.contractType} • Hash: {jobData.contractHash.slice(0, 16)}...
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Badge className="bg-warning/20 text-warning border-warning/30">
              <Clock className="w-3 h-3 mr-1" />
              In Progress
            </Badge>
            <Badge variant="outline">{jobData.auditPackage}</Badge>
            <Badge className="bg-success/20 text-success border-success/30">
              <Bot className="w-3 h-3 mr-1" />
              AI Negotiated: ${jobData.negotiatedPrice}
            </Badge>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Audit Progress</CardTitle>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  {jobData.completedHours}/{jobData.estimatedHours}h
                </Badge>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                  <Timer className="w-3 h-3 mr-1" />
                  {jobData.timeRemaining}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Deadline: {jobData.deadline}</span>
                <span>
                  {completedChecks}/{totalChecks} checks completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="code">Code Review</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="tools">Analysis Tools</TabsTrigger>
            <TabsTrigger value="evidence">Evidence & ZKP</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                  <CardDescription>Anonymized contract information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Hash:</span>
                      <span className="font-mono text-xs">{jobData.contractHash.slice(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{jobData.contractType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines of Code:</span>
                      <span>{jobData.linesOfCode.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Complexity:</span>
                      <Badge variant="outline">{jobData.complexity}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Privacy:</span>
                      <div className="flex space-x-1">
                        {jobData.sanitized && (
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                            Sanitized
                          </Badge>
                        )}
                        {jobData.obfuscated && (
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                            Obfuscated
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Negotiated Price:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground line-through text-xs">${jobData.originalPrice}</span>
                        <span className="font-medium text-success">${jobData.negotiatedPrice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditChecks.map((check) => (
                      <div key={check.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {check.status === "completed" && <CheckCircle className="w-4 h-4 text-success" />}
                          {check.status === "in-progress" && <Clock className="w-4 h-4 text-warning" />}
                          {check.status === "pending" && <AlertTriangle className="w-4 h-4 text-muted-foreground" />}
                          <span className="text-sm">{check.name}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            check.severity === "critical"
                              ? "border-destructive text-destructive"
                              : check.severity === "high"
                                ? "border-orange-500 text-orange-500"
                                : check.severity === "medium"
                                  ? "border-warning text-warning"
                                  : "border-muted-foreground text-muted-foreground"
                          }
                        >
                          {check.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Anonymized Contract Files</CardTitle>
                <CardDescription>Sanitized and obfuscated smart contract files for review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileCode className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{file}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 500 + 100)} lines
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Review Workspace</CardTitle>
                <CardDescription>Review the sanitized smart contract code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                    <div className="text-muted-foreground mb-2">// Contract_A.sol (sanitized)</div>
                    <div className="space-y-1">
                      <div>
                        <span className="text-blue-400">pragma</span> <span className="text-green-400">solidity</span>{" "}
                        ^0.8.0;
                      </div>
                      <div>
                        <span className="text-blue-400">import</span>{" "}
                        <span className="text-green-400">"@openzeppelin/contracts/token/ERC721/ERC721.sol"</span>;
                      </div>
                      <div>
                        <span className="text-blue-400">contract</span>{" "}
                        <span className="text-yellow-400">Contract_A</span> <span className="text-blue-400">is</span>{" "}
                        <span className="text-yellow-400">ERC721</span> {"{"}
                      </div>
                      <div className="ml-4">
                        <span className="text-blue-400">mapping</span>(<span className="text-blue-400">uint256</span>{" "}
                        <span className="text-blue-400">to</span> <span className="text-blue-400">uint256</span>){" "}
                        <span className="text-blue-400">public</span> prices;
                      </div>
                      <div className="ml-4 text-muted-foreground">// ... rest of contract</div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Terminal className="w-4 h-4 mr-1" />
                      Open in IDE
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download Full Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add your review notes here..."
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <Button>
                    <Save className="w-4 h-4 mr-1" />
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="findings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Findings</CardTitle>
                <CardDescription>Document security issues and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.map((finding) => (
                    <div key={finding.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              finding.severity === "critical"
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : finding.severity === "high"
                                  ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                                  : finding.severity === "medium"
                                    ? "bg-warning/20 text-warning border-warning/30"
                                    : "bg-muted/20 text-muted-foreground border-muted/30"
                            }
                          >
                            {finding.severity}
                          </Badge>
                          <h3 className="font-semibold">{finding.title}</h3>
                        </div>
                        <Badge variant="outline">{finding.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {finding.file}:{finding.line}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Finding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <select
                        id="severity"
                        className="w-full p-2 border border-border rounded-md bg-background"
                        value={newFinding.severity}
                        onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        placeholder="e.g., Contract_A.sol"
                        value={newFinding.file}
                        onChange={(e) => setNewFinding({ ...newFinding, file: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={newFinding.title}
                      onChange={(e) => setNewFinding({ ...newFinding, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description and recommendations"
                      value={newFinding.description}
                      onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={newFinding.category}
                      onChange={(e) => setNewFinding({ ...newFinding, category: e.target.value })}
                    >
                      {vulnerabilityCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button>Add Finding</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Assessment</CardTitle>
                <CardDescription>
                  Select the vulnerability categories found during your audit. This will be used for ZKP generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedVulnerabilities.map((vulnerability) => (
                      <div key={vulnerability.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={vulnerability.id}
                          checked={vulnerability.checked}
                          onCheckedChange={(checked) => handleVulnerabilityChange(vulnerability.id, checked as boolean)}
                        />
                        <Label htmlFor={vulnerability.id} className="text-sm">
                          {vulnerability.name}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {selectedVulnerabilities.find((v) => v.id === "other")?.checked && (
                    <div className="space-y-2">
                      <Label htmlFor="other-vulnerability">Specify Other Vulnerability</Label>
                      <Input
                        id="other-vulnerability"
                        placeholder="Describe the other vulnerability type..."
                        value={otherVulnerability}
                        onChange={(e) => setOtherVulnerability(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Selected Vulnerabilities Summary</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVulnerabilities
                        .filter((v) => v.checked)
                        .map((vulnerability) => (
                          <Badge
                            key={vulnerability.id}
                            variant="outline"
                            className="bg-destructive/10 text-destructive border-destructive/30"
                          >
                            {vulnerability.name}
                          </Badge>
                        ))}
                      {selectedVulnerabilities.filter((v) => v.checked).length === 0 && (
                        <span className="text-sm text-muted-foreground">No vulnerabilities selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Static Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slither Analysis</span>
                      <Badge className="bg-success/20 text-success border-success/30">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mythril Scan</span>
                      <Badge className="bg-success/20 text-success border-success/30">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Semgrep Rules</span>
                      <Badge className="bg-warning/20 text-warning border-warning/30">Running</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-1" />
                      Download Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fuzzing Tests</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Symbolic Execution</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gas Analysis</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Terminal className="w-4 h-4 mr-1" />
                      Launch Tools
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evidence & ZKP Generation</CardTitle>
                <CardDescription>
                  Prepare evidence for zero-knowledge proof generation and submit audit results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Evidence Collection</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Static analysis reports</span>
                          <Badge className="bg-success/20 text-success border-success/30">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Manual review notes</span>
                          <Badge className="bg-success/20 text-success border-success/30">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Vulnerability assessment</span>
                          <Badge className="bg-warning/20 text-warning border-warning/30">
                            {selectedVulnerabilities.filter((v) => v.checked).length} selected
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Findings documentation</span>
                          <Badge className="bg-success/20 text-success border-success/30">
                            {findings.length} findings
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">ZKP Preparation</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Witness generation</span>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Circuit validation</span>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Proof generation</span>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>On-chain verification</span>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Audit Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contract Hash:</span>
                        <div className="font-mono text-xs">{jobData.contractHash}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vulnerabilities Found:</span>
                        <div>{selectedVulnerabilities.filter((v) => v.checked).length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Findings:</span>
                        <div>{findings.length}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button>
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Evidence
                    </Button>
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-1" />
                      Generate ZK Proof
                    </Button>
                    <Button variant="outline">
                      <Send className="w-4 h-4 mr-1" />
                      Submit Audit Results
                    </Button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Privacy Protection</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Your audit results will be submitted anonymously. The smart contract owner will never know
                          your identity, and you will never know theirs. All evidence is cryptographically verified
                          through zero-knowledge proofs.
                        </p>
                      </div>
                    </div>
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
