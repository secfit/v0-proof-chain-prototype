"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useActiveAccount, ConnectButton, useActiveWallet } from "thirdweb/react"
import { client } from "@/lib/thirdweb-config"
import { createAuditResultNFTClient, type AuditResultData } from "@/lib/audit-result-nft-service"
import { WalletDebug } from "@/components/wallet-debug"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Download,
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
  Loader2,
  ExternalLink,
} from "lucide-react"

// Interface for audit data
interface AuditData {
  id: string
  contractHash: string
  status: string
  auditPackage: string
  deadline: string
  timeRemaining?: string
  negotiatedPrice?: number
  originalPrice?: number
  estimatedHours?: number
  completedHours?: number
  contractType: string
  linesOfCode: number
  complexity: string
  specializations: string[]
  sanitized: boolean
  obfuscated: boolean
  files?: string[]
  projectName: string
  projectDescription?: string
  githubUrl?: string
  startDate?: string
  estimatedCompletionDate?: string
  auditorName?: string
  auditorWallet?: string
  progress?: number
  developerWallet?: string
  repositoryHash?: string
  requestNftId?: string
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
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  
  // Debug wallet connection
  console.log("[Auditor Job] Account:", account)
  console.log("[Auditor Job] Account Address:", account?.address)
  console.log("[Auditor Job] Account Type:", typeof account)
  console.log("[Auditor Job] Account Keys:", account ? Object.keys(account) : "No account")
  console.log("[Auditor Job] Wallet:", wallet)
  console.log("[Auditor Job] Wallet Address:", wallet?.getAccount()?.address)
  
  // Create a robust account detection function
  const getConnectedAccount = () => {
    // Try multiple methods to get the connected account
    if (account?.address) {
      return account
    }
    
    if (wallet?.getAccount()?.address) {
      return wallet.getAccount()
    }
    
    return null
  }

  const connectedAccount = getConnectedAccount()
  
  // Monitor account changes
  useEffect(() => {
    console.log("[Auditor Job] Account changed:", {
      account: account,
      address: account?.address,
      wallet: wallet,
      walletAddress: wallet?.getAccount()?.address,
      connectedAccount: connectedAccount,
      isConnected: !!connectedAccount,
      timestamp: new Date().toISOString()
    })
  }, [account, wallet, connectedAccount])
  
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
  const [isAddingFinding, setIsAddingFinding] = useState(false)
  const [findings, setFindings] = useState<any[]>([])

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ipfsHash, setIpfsHash] = useState("")
  const [nftConfirmation, setNftConfirmation] = useState<any>(null)
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])

  // State for audit data
  const [jobData, setJobData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const completedChecks = auditChecks.filter((check) => check.status === "completed").length
  const totalChecks = auditChecks.length
  const progressPercentage = (completedChecks / totalChecks) * 100

  // Function to save finding to database
  const handleAddFinding = async () => {
    if (!jobData || !newFinding.title || !newFinding.description) {
      alert("Please fill in the title and description")
      return
    }

    setIsAddingFinding(true)
    try {
      const requestData = {
        auditRequestId: jobData.id,
        auditorWallet: jobData.auditorWallet,
        auditorName: jobData.auditorName,
        title: newFinding.title,
        description: newFinding.description,
        severity: newFinding.severity,
        finding_category: newFinding.category,
        fileName: newFinding.file,
        lineNumber: newFinding.line ? parseInt(newFinding.line) : null,
      }
      
      console.log("[Frontend] Sending finding data:", requestData)
      
      const response = await fetch('/api/audit-findings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()
      console.log("[Frontend] API Response:", result)

      if (result.success) {
        // Reset form
        setNewFinding({
          severity: "medium",
          title: "",
          description: "",
          file: "",
          line: "",
          category: "other",
        })
        
        // Refresh findings list
        await fetchFindings()
        
        alert("Finding added successfully!")
      } else {
        console.error("Error adding finding:", result.error)
        alert("Failed to add finding: " + result.error)
      }
    } catch (error) {
      console.error("Error adding finding:", error)
      alert("Failed to add finding")
    } finally {
      setIsAddingFinding(false)
    }
  }

  // Function to fetch existing findings
  const fetchFindings = async () => {
    if (!jobData) return

    try {
      const response = await fetch(`/api/audit-findings?auditRequestId=${jobData.id}&auditorWallet=${jobData.auditorWallet}`)
      const result = await response.json()

      if (result.success) {
        setFindings(result.data)
        console.log("Fetched findings:", result.data)
      }
    } catch (error) {
      console.error("Error fetching findings:", error)
    }
  }

  // Countdown timer hook
  const useCountdown = (targetDate: string) => {
    const [timeLeft, setTimeLeft] = useState<{
      days: number
      hours: number
      minutes: number
      seconds: number
      isExpired: boolean
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false })

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date().getTime()
        const target = new Date(targetDate).getTime()
        const difference = target - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        }
      }

      calculateTimeLeft()
      const timer = setInterval(calculateTimeLeft, 1000)

      return () => clearInterval(timer)
    }, [targetDate])

    return timeLeft
  }

  // Countdown Timer Component
  const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const timeLeft = useCountdown(targetDate)

    if (timeLeft.isExpired) {
      return (
        <div className="flex items-center space-x-2 text-destructive">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Deadline Expired</span>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-2 text-warning">
        <Timer className="w-4 h-4" />
        <span className="text-sm font-medium">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours > 0 && `${timeLeft.hours}h `}
          {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
          {timeLeft.seconds}s remaining
        </span>
      </div>
    )
  }

  // Fetch audit data
  useEffect(() => {
    fetchAuditData()
  }, [params.id])

  // Fetch findings when jobData is available
  useEffect(() => {
    if (jobData) {
      fetchFindings()
    }
  }, [jobData])

  const fetchAuditData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("[Auditor Job] Fetching audit data for ID:", params.id)
      
      const response = await fetch(`/api/audits/${params.id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch audit data")
      }

      if (result.success && result.data) {
        setJobData(result.data)
        console.log("[Auditor Job] Audit data loaded:", result.data)
      } else {
        throw new Error(result.error || "Failed to load audit data")
      }
    } catch (err: any) {
      console.error("[Auditor Job] Error fetching audit data:", err)
      setError(err.message || "Failed to load audit data")
    } finally {
      setLoading(false)
    }
  }

  const handleVulnerabilityChange = (id: string, checked: boolean) => {
    setSelectedVulnerabilities((prev) => prev.map((vuln) => (vuln.id === id ? { ...vuln, checked } : vuln)))
  }

  const handleEvidenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidenceFiles(Array.from(e.target.files))
    }
  }

  const handleSubmitResults = async () => {
    console.log("[Auditor Job] Wallet connection check:", {
      account: account,
      address: account?.address,
      wallet: wallet,
      walletAddress: wallet?.getAccount()?.address,
      connectedAccount: connectedAccount,
      isConnected: !!connectedAccount,
      jobDataAuditorWallet: jobData?.auditorWallet,
      accountType: typeof account,
      accountKeys: account ? Object.keys(account) : "No account"
    })
    
    // Enhanced wallet connection check with debugging
    if (!connectedAccount) {
      console.error("[Auditor Job] No connected account found")
      alert("Wallet not connected. Please connect your wallet using the Connect Wallet button.")
      return
    }
    
    if (!connectedAccount.address) {
      console.error("[Auditor Job] Connected account exists but no address:", connectedAccount)
      alert("Wallet connected but no address found. Please try reconnecting your wallet.")
      return
    }
    
    console.log("[Auditor Job] Wallet connection verified:", connectedAccount.address)

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Simulate progress for evidence preparation
      setUploadProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Prepare audit result data for client-side minting (same pattern as upload page)
      const auditResultData: AuditResultData = {
        // Audit Request Information
        auditRequestId: jobData?.id || "",
        projectName: jobData?.projectName || "",
        projectDescription: jobData?.projectDescription || "",
        complexity: jobData?.complexity || "medium",
        estimatedDuration: (jobData?.estimatedHours || 0).toString(),
        proposedPrice: jobData?.negotiatedPrice || 0,
        developerWallet: jobData?.developerWallet || "",
        githubUrl: jobData?.githubUrl || "",
        repositoryHash: jobData?.repositoryHash || "",
        requestNftId: jobData?.requestNftId,
        
        // Auditor Information
        auditorWallet: connectedAccount.address,
        auditorName: jobData?.auditorName || "",
        acceptedPrice: jobData?.negotiatedPrice || 0,
        startDate: jobData?.startDate || new Date().toISOString(),
        estimatedCompletionDate: jobData?.estimatedCompletionDate || new Date().toISOString(),
        
        // Audit Results
        contractHash: jobData?.contractHash || "",
        findings,
        vulnerabilities: selectedVulnerabilities,
        auditNotes,
        staticAnalysisReports: ["slither", "mythril"],
        evidenceFiles: evidenceFiles.map((f) => f.name),
        completionDate: new Date().toISOString(),
        
        // IPFS Data (will be set after upload)
        ipfsHash: "",
        evidenceFileHashes: []
      }

      // Upload comprehensive evidence to IPFS (client-side)
      setUploadProgress(20)
      console.log("[Auditor Job] Starting client-side NFT minting process...")
      
      // Mint comprehensive Audit Result NFT using connected wallet (same pattern as upload page)
      setUploadProgress(30)
      const nftResult = await createAuditResultNFTClient(auditResultData, connectedAccount)

      if (!nftResult.success) {
        throw new Error(nftResult.error || "Failed to mint audit result NFT")
      }

      console.log("[Auditor Job] NFT minted successfully:", nftResult.nftMintResult)

      // Save audit result to database (server-side)
      setUploadProgress(70)
      const response = await fetch("/api/submit-audit-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditOwnerId: params.id,
          findings,
          vulnerabilities: selectedVulnerabilities,
          auditNotes,
          staticAnalysisReports: ["slither", "mythril"],
          evidenceFiles: evidenceFiles.map((f) => f.name),
          contractHash: jobData?.contractHash || "",
          auditorWallet: connectedAccount.address,
          // Include NFT minting results
          nftResult: nftResult,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save audit results to database")
      }

      console.log("[Auditor Job] Audit results saved successfully:", data)

      // Set IPFS hash and NFT confirmation
      setUploadProgress(90)
      setIpfsHash(nftResult.nftMintResult?.metadataUri || "")
      setNftConfirmation({
        tokenId: nftResult.nftMintResult?.tokenId,
        transactionHash: nftResult.nftMintResult?.transactionHash,
        contractAddress: nftResult.nftContract?.address,
        explorerUrl: nftResult.nftMintResult?.explorerUrl,
        message: "Comprehensive Audit Result NFT minted successfully!",
        auditDetails: {
          projectName: jobData?.projectName,
          auditorName: jobData?.auditorName,
          acceptedPrice: jobData?.negotiatedPrice,
          findingsCount: findings.length,
          vulnerabilitiesCount: selectedVulnerabilities.filter((v: any) => v.checked).length,
        }
      })

      // Complete progress
      setUploadProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard after delay
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 3000)
    } catch (error: any) {
      console.error("[Auditor Job] Error submitting audit results:", error)
      alert(error.message || "Failed to submit audit results")
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading audit details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Audit</h3>
              <p className="text-muted-foreground mb-4">{error || "Audit not found"}</p>
              <Button onClick={fetchAuditData} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">{jobData.projectName}</h1>
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
              Accepted: ${jobData.negotiatedPrice || jobData.originalPrice}
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
                  {jobData.progress || 0}% Complete
                </Badge>
                {jobData.estimatedCompletionDate && (
                  <CountdownTimer targetDate={jobData.estimatedCompletionDate} />
                )}
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
            {/*<TabsTrigger value="code">Code Review</TabsTrigger>*/}
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            {/*<TabsTrigger value="tools">Analysis Tools</TabsTrigger>*/}
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
                      <span className="text-muted-foreground">Accepted Price:</span>
                      <div className="flex items-center space-x-2">
                        {jobData.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs">${jobData.originalPrice}</span>
                        )}
                        <span className="font-medium text-success">${jobData.negotiatedPrice || jobData.originalPrice}</span>
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

           {/*} <Card>
              <CardHeader>
                <CardTitle>Anonymized Contract Files</CardTitle>
                <CardDescription>Sanitized and obfuscated smart contract files for review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(jobData.files || ['Contract_A.sol', 'Contract_B.sol', 'Contract_C.sol', 'Contract_D.sol']).map((file, index) => (
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
            </Card>*/}
          </TabsContent>

          {/*<TabsContent value="code" className="space-y-6">
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
          </TabsContent>*/}

          <TabsContent value="findings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Findings</CardTitle>
                <CardDescription>Document security issues and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No findings added yet. Use the form below to add your first finding.</p>
                    </div>
                  ) : (
                    findings.map((finding) => (
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
                          <Badge variant="outline">{finding.finding_status || 'open'}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div>
                            {finding.file_name && (
                              <span>{finding.file_name}</span>
                            )}
                            {finding.line_number && (
                              <span>:{finding.line_number}</span>
                            )}
                          </div>
                          <div>
                            Added: {new Date(finding.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {finding.finding_category && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {finding.finding_category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))
                  )}
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
                  <Button 
                    onClick={handleAddFinding}
                    disabled={isAddingFinding || !newFinding.title || !newFinding.description}
                  >
                    {isAddingFinding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding Finding...
                      </>
                    ) : (
                      "Add Finding"
                    )}
                  </Button>
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
                      <h3 className="font-semibold">Additional Evidence Files</h3>
                      <div className="space-y-2">
                        <Label htmlFor="evidence-files">Upload Evidence Files</Label>
                        <Input
                          id="evidence-files"
                          type="file"
                          multiple
                          onChange={handleEvidenceFileChange}
                          className="cursor-pointer"
                        />
                        {evidenceFiles.length > 0 && (
                          <div className="text-sm text-muted-foreground">{evidenceFiles.length} file(s) selected</div>
                        )}
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

                  {/* Wallet Connection Section */}
                  {!connectedAccount && !jobData?.auditorWallet && (
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-warning font-semibold mb-3">
                        <AlertTriangle className="w-5 h-5" />
                        Wallet Connection Required
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        You need to connect your wallet to submit audit results and mint the comprehensive NFT.
                      </p>
                      <div className="flex gap-2">
                        <ConnectButton client={client} />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            console.log("[Debug] Current account state:", {
                              account: account,
                              address: account?.address,
                              type: typeof account,
                              keys: account ? Object.keys(account) : "No account"
                            })
                            alert(`Debug Info:\nAccount: ${account ? 'Exists' : 'Null'}\nAddress: ${account?.address || 'None'}\nType: ${typeof account}`)
                          }}
                        >
                          Debug Wallet
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Wallet Debug Component */}
                  <WalletDebug />

                  {/* Connected Wallet Info */}
                  {(connectedAccount || jobData?.auditorWallet) && (
                    <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-success font-semibold mb-2">
                        <CheckCircle className="w-5 h-5" />
                        {connectedAccount ? "Wallet Connected" : "Auditor Wallet Available"}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccount ? "Connected: " : "Auditor: "}
                        <span className="font-mono">{connectedAccount?.address || jobData?.auditorWallet}</span>
                      </p>
                      {!connectedAccount && jobData?.auditorWallet && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Using auditor wallet from job data. For best experience, connect your wallet.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setIsSubmitDialogOpen(true)}
                      disabled={!connectedAccount && !jobData?.auditorWallet}
                    >
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
                          through zero-knowledge proofs and stored on IPFS.
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

      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Audit Results & Mint Comprehensive NFT</DialogTitle>
            <DialogDescription>
              Your complete audit evidence will be uploaded to IPFS and a comprehensive Audit Result NFT will be minted on ApeChain with full audit details.
            </DialogDescription>
          </DialogHeader>

          {!nftConfirmation ? (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">Submission Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Contract Hash:</span>
                    <div className="font-mono text-xs">{jobData.contractHash.slice(0, 20)}...</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Findings:</span>
                    <div>{findings.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vulnerabilities:</span>
                    <div>{selectedVulnerabilities.filter((v) => v.checked).length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Evidence Files:</span>
                    <div>{evidenceFiles.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Comprehensive Audit Result NFT
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Upon submission, a comprehensive ERC-721 Audit Result NFT will be minted containing:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Complete audit request details and project information</li>
                  <li>• Full auditor information and acceptance details</li>
                  <li>• Comprehensive audit findings and vulnerability assessments</li>
                  <li>• All evidence files and analysis reports on IPFS</li>
                  <li>• Severity breakdown and completion metrics</li>
                  <li>• Immutable proof of entire audit process on ApeChain</li>
                </ul>
              </div>

              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing submission...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadProgress < 20 && "Preparing comprehensive evidence package..."}
                    {uploadProgress >= 20 && uploadProgress < 40 && "Uploading complete audit data to IPFS..."}
                    {uploadProgress >= 40 && uploadProgress < 60 && "Minting comprehensive Audit Result NFT..."}
                    {uploadProgress >= 60 && uploadProgress < 80 && "Anchoring complete audit proof on ApeChain..."}
                    {uploadProgress >= 80 && "Finalizing comprehensive submission..."}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitResults} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit & Mint Comprehensive NFT
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-success font-semibold mb-3">
                  <CheckCircle className="w-5 h-5" />
                  Comprehensive Audit Result NFT Minted Successfully!
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground">Token ID:</span>{" "}
                      <span className="font-mono font-semibold">#{nftConfirmation.tokenId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contract:</span>{" "}
                      <span className="font-mono text-xs">{nftConfirmation.contractAddress}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">IPFS Hash:</span>{" "}
                    <span className="font-mono text-xs">{ipfsHash}</span>
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
                  {nftConfirmation.auditDetails && (
                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-semibold mb-2">Audit Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Project:</span>{" "}
                          <span className="font-semibold">{nftConfirmation.auditDetails.projectName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Findings:</span>{" "}
                          <span className="font-semibold">{nftConfirmation.auditDetails.findingsCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vulnerabilities:</span>{" "}
                          <span className="font-semibold">{nftConfirmation.auditDetails.vulnerabilitiesCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>{" "}
                          <span className="font-semibold">${nftConfirmation.auditDetails.acceptedPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-success" />
                  Your comprehensive audit results have been uploaded to IPFS and a complete Audit Result NFT has been minted with full audit details. Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
