"use client"

import { useState, useEffect, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { useActiveAccount, ConnectButton } from "thirdweb/react"
import { client } from "@/lib/thirdweb-config"
import { AuditorService, type AuditRequest, type AuditorProfile } from "@/lib/auditor-service"
import { IPFSMetadataService } from "@/lib/ipfs-metadata-service"
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
  RefreshCw,
  Database,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  Info,
  Plus,
  User,
  Wallet,
  Hash,
  Download,
  Copy,
  Check,
} from "lucide-react"

// Helper function to normalize status values
const normalizeStatus = (status: string) => {
  const normalized = status?.toLowerCase().replace(/\s+/g, '-')
  return normalized
}

const getStatusColor = (status: string) => {
  const normalized = normalizeStatus(status)
  switch (normalized) {
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
  const normalized = normalizeStatus(status)
  switch (normalized) {
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
  // Authentication and wallet integration
  const { user, isAuthenticated } = useAuth()
  const account = useActiveAccount()

  // State management
  const [auditsData, setAuditsData] = useState<AuditRequest[]>([])
  const [auditorProfile, setAuditorProfile] = useState<AuditorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  
  // Audit Report Dialog State
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedAuditReport, setSelectedAuditReport] = useState<any>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  // Filtering and search state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [complexityFilter, setComplexityFilter] = useState("All")
  const [specializationFilter, setSpecializationFilter] = useState("All")
  const [activeTab, setActiveTab] = useState("available")

  // Dialog state
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const [selectedAudit, setSelectedAudit] = useState<AuditRequest | null>(null)
  const [auditorName, setAuditorName] = useState("")
  const [auditorWallet, setAuditorWallet] = useState("")
  const [estimatedDays, setEstimatedDays] = useState("")
  const [isAccepting, setIsAccepting] = useState(false)
  const [nftConfirmation, setNftConfirmation] = useState<any>(null)
  
  // Metadata state
  const [contractMetadata, setContractMetadata] = useState<any>(null)
  const [loadingMetadata, setLoadingMetadata] = useState(false)
  const [metadataError, setMetadataError] = useState<string | null>(null)

  // Filter options
  const statusOptions = ["All", "available", "pending-acceptance", "in-progress", "completed"]
  const complexityOptions = ["All", "Critical", "High", "Medium", "Low"]
  const specializationOptions = ["All", ...AuditorService.getAvailableSpecializations(auditsData)]

  // Debug wallet connection
  console.log("Audits Page - Account:", account)
  console.log("Audits Page - Account Address:", account?.address)

  // Set auditor wallet from connected account
  useEffect(() => {
    if (account?.address) {
      setAuditorWallet(account.address)
    }
  }, [account])

  // Fetch audits data on component mount and when account changes
  useEffect(() => {
    fetchAuditsData()
  }, [account?.address])

  // Fetch auditor profile if wallet is connected
  useEffect(() => {
    if (account?.address) {
      fetchAuditorProfile(account.address)
    }
  }, [account])

  const fetchAuditsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("[Audits] Fetching audit requests from Supabase...")
      
      const result = await AuditorService.getAuditRequests({
        limit: 100,
        auditorWallet: account?.address // Pass auditor wallet if connected
      })

      console.log("[Audits] API Result:", result)

      if (result.success && result.data) {
        setAuditsData(result.data)
        console.log(`[Audits] Successfully fetched ${result.data.length} audit requests from Supabase`)
        console.log("[Audits] First audit:", result.data[0])
      } else {
        console.error("[Audits] API Error:", result.error)
        throw new Error(result.error || "Failed to fetch audit requests")
      }
    } catch (err: any) {
      console.error("[Audits] Error fetching data:", err)
      setError(err.message || "Failed to load audit requests")
    } finally {
      setLoading(false)
    }
  }

  // Copy to clipboard function
  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  // Component for displaying addresses with copy and link functionality
  const AddressDisplay = ({ 
    label, 
    address, 
    type = "contract", 
    itemId 
  }: { 
    label: string
    address: string
    type?: "contract" | "ipfs" | "transaction"
    itemId: string
  }) => {
    const isCopied = copiedItems.has(itemId)
    
    // Handle undefined/null addresses
    if (!address || address === "undefined" || address === "null") {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-sm text-muted-foreground italic">Not available</p>
        </div>
      )
    }
    
    // Clean IPFS address - remove ipfs:// prefix if present
    const cleanAddress = type === "ipfs" && address.startsWith("ipfs://") 
      ? address.replace("ipfs://", "") 
      : address
    
    const explorerUrl = type === "contract" 
      ? `https://curtis.explorer.caldera.xyz/address/${cleanAddress}`
      : type === "transaction"
      ? `https://curtis.explorer.caldera.xyz/tx/${cleanAddress}`
      : `https://ipfs.io/ipfs/${cleanAddress}`
    
    return (
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-mono flex-1 truncate">{cleanAddress}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(cleanAddress, itemId)}
            className="h-8 w-8 p-0"
          >
            {isCopied ? (
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
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              title={`View on ${type === "ipfs" ? "IPFS" : "Explorer"}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    )
  }

  // Fetch audit report data
  const fetchAuditReport = async (auditId: string) => {
    try {
      setIsLoadingReport(true)
      console.log("[Audit Report] Fetching report for audit ID:", auditId)
      
      // Fetch audit results from the database
      const response = await fetch(`/api/audit-results/${auditId}`)
      const data = await response.json()
      
      console.log("[Audit Report] API Response:", { response: response.ok, data })
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch audit results")
      }
      
      console.log("[Audit Report] Setting audit report data:", data.data)
      console.log("[Audit Report] NFT Token ID (audit_request_id) from API:", data.data?.resultNft?.id, "Type:", typeof data.data?.resultNft?.id)
      if (data.data) {
        setSelectedAuditReport(data.data)
        setIsReportDialogOpen(true)
      } else {
        throw new Error("No audit data received from server")
      }
    } catch (error: any) {
      console.error("[Audit Report] Error fetching audit report:", error)
      alert("Failed to load audit report: " + error.message)
    } finally {
      setIsLoadingReport(false)
    }
  }

  const fetchAuditorProfile = async (walletAddress: string) => {
    try {
      console.log("[Audits] Fetching auditor profile for:", walletAddress)
      
      const result = await AuditorService.getAuditorProfile(walletAddress)
      
      if (result.success && result.data) {
        setAuditorProfile(result.data)
        console.log("[Audits] Auditor profile loaded:", result.data)
      } else {
        console.warn("[Audits] No auditor profile found for:", walletAddress)
      }
    } catch (err: any) {
      console.error("[Audits] Error fetching auditor profile:", err)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAuditsData()
    if (account?.address) {
      await fetchAuditorProfile(account.address)
    }
    setRefreshing(false)
    setLastUpdated(new Date())
  }

  // Filter audits based on current filters and tab
  const filteredAudits = AuditorService.filterAudits(
    auditsData,
    searchQuery,
    statusFilter,
    complexityFilter,
    specializationFilter
  ).filter(audit => {
    // Filter by active tab (API already handles auditor-specific filtering)
    if (activeTab === "available") return normalizeStatus(audit.status) === "available"
    if (activeTab === "my-audits") return normalizeStatus(audit.status) !== "available" // Show non-available audits for connected auditor
    if (activeTab === "completed") return normalizeStatus(audit.status) === "completed"
    return true
  })

  // Debug logging
  console.log("[Audits] Total audits data:", auditsData.length)
  console.log("[Audits] Filtered audits:", filteredAudits.length)
  console.log("[Audits] Active tab:", activeTab)
  console.log("[Audits] Search query:", searchQuery)
  console.log("[Audits] Status filter:", statusFilter)

  // Calculate statistics
  const stats = AuditorService.calculateAuditStats(auditsData)

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

  const fetchContractMetadata = async (audit: AuditRequest) => {
    if (!audit.ipfsHash) {
      console.warn("[Audits] No IPFS hash available for audit:", audit.id)
      return null
    }

    try {
      setLoadingMetadata(true)
      setMetadataError(null)
      
      const ipfsUri = `ipfs://${audit.ipfsHash}`
      console.log("[Audits] Fetching metadata from IPFS:", ipfsUri)
      
      const metadata = await IPFSMetadataService.fetchMetadata(ipfsUri)
      
      if (metadata) {
        const contractDetails = IPFSMetadataService.extractContractDetails(metadata)
        const formattedDetails = IPFSMetadataService.formatContractDetails(contractDetails)
        setContractMetadata(formattedDetails)
        console.log("[Audits] Metadata loaded successfully:", formattedDetails)
      } else {
        setMetadataError("Failed to load contract metadata")
      }
    } catch (error: any) {
      console.error("[Audits] Error fetching metadata:", error)
      setMetadataError(error.message || "Failed to load metadata")
    } finally {
      setLoadingMetadata(false)
    }
  }

  const handleAcceptAudit = async (audit: AuditRequest) => {
    if (!account?.address) {
      alert("Please connect your wallet first. Click the 'Connect Wallet' button in the navigation.")
      return
    }

    setSelectedAudit(audit)
    setIsAcceptDialogOpen(true)
    setNftConfirmation(null)
    setContractMetadata(null)
    setMetadataError(null)
    
    // Fetch contract metadata
    await fetchContractMetadata(audit)
  }

  const handleSubmitAccept = async () => {
    if (!account?.address) {
      alert("Please connect your wallet first.")
      return
    }

    if (!auditorName || !auditorWallet || !estimatedDays) {
      alert("Please fill in all fields")
      return
    }

    if (!selectedAudit) {
      alert("No audit selected")
      return
    }

    setIsAccepting(true)

    try {
      console.log("[Audits] Accepting audit request:", selectedAudit.id)
      
      const result = await AuditorService.acceptAuditRequest(
        selectedAudit.id,
        auditorWallet,
        auditorName,
        selectedAudit.negotiatedPrice || selectedAudit.proposedPrice,
        parseInt(estimatedDays)
      )

      if (result.success && result.data) {
        console.log("[Audits] Audit accepted successfully:", result.data)
        setNftConfirmation({
          type: "acceptance",
          message: result.data.message,
          auditOwner: result.data.auditOwner
        })

        // Update the local audit data to reflect the new status
        setAuditsData(prevAudits => 
          prevAudits.map(audit => 
            audit.id === selectedAudit.id 
              ? { 
                  ...audit, 
                  status: "In Progress",
                  startDate: result.data.auditRequest.startDate,
                  estimatedCompletionDate: result.data.auditRequest.estimatedCompletionDate
                }
              : audit
          )
        )

        // Refresh data to get latest from backend
        await handleRefresh()

        // Redirect to auditor job page after a delay
        setTimeout(() => {
          window.location.href = `/auditor/job/${selectedAudit.id}`
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to accept audit")
      }
    } catch (error: any) {
      console.error("[Audits] Error accepting audit:", error)
      alert(error.message || "Failed to accept audit")
    } finally {
      setIsAccepting(false)
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
              <p className="text-muted-foreground">Loading audit requests from Supabase...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Audits</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Audit Marketplace</h1>
              <p className="text-muted-foreground">
                Discover and accept smart contract audit requests with ZKP verification
              </p>
              
              {/* Data Source Indicator */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Live Supabase data</span>
                <Badge variant="secondary" className="text-xs">
                  Updated {lastUpdated.toLocaleTimeString()}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                {refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              
              {!account?.address ? (
                <ConnectButton client={client} />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/20 rounded-lg">
                  <Wallet className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auditor Profile Section */}
        {auditorProfile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Auditor Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{auditorProfile.totalAudits}</div>
                  <p className="text-sm text-muted-foreground">Total Audits</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{auditorProfile.completedAudits}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{auditorProfile.reputationScore}</div>
                  <p className="text-sm text-muted-foreground">Reputation Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${auditorProfile.totalEarnings}</div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={auditorProfile.isVerified ? "default" : "secondary"}>
                    {auditorProfile.verificationLevel} Auditor
                  </Badge>
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    {auditorProfile.averageRating}/5.0
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {auditorProfile.completionRate}% completion rate
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <AlertTriangle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.available}</div>
              <p className="text-xs text-muted-foreground">Ready for assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Currently auditing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageEarnings}</div>
              <p className="text-xs text-muted-foreground">Per audit completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Audits</TabsTrigger>
            <TabsTrigger value="my-audits">My Audits</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            {/* Search and Filters */}
            <Card className="mb-6">
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
                      value={complexityFilter}
                      onChange={(e) => setComplexityFilter(e.target.value)}
                    >
                      {complexityOptions.map((complexity) => (
                        <option key={complexity} value={complexity}>
                          {complexity === "All" ? "All Complexity" : complexity}
                        </option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                      value={specializationFilter}
                      onChange={(e) => setSpecializationFilter(e.target.value)}
                    >
                      {specializationOptions.map((specialization) => (
                        <option key={specialization} value={specialization}>
                          {specialization === "All" ? "All Specializations" : specialization}
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
          </TabsContent>

          <TabsContent value="my-audits" className="mt-6">
            {!account?.address ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your wallet to view your accepted audit requests
                  </p>
                  <ConnectButton client={client} />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAudits.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No accepted audits found</h3>
                      <p className="text-muted-foreground">
                        You haven't accepted any audit requests yet. Go to the "Available Audits" tab to find audits to accept.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAudits.map((audit) => (
                    <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-foreground">{audit.projectName || audit.contractType}</h3>
                              <Badge className={getStatusColor(audit.status)}>
                                {getStatusIcon(audit.status)}
                                <span className="ml-1">{audit.status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center space-x-2 text-sm">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-semibold">${audit.negotiatedPrice || audit.proposedPrice}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Complexity:</span>
                                <Badge variant="outline" className={getComplexityColor(audit.complexity)}>
                                  {audit.complexity}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Hash className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Contract:</span>
                                <span className="font-mono text-xs">{audit.contractHash.slice(0, 8)}...</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <span>Created: {new Date(audit.createdAt).toLocaleDateString()}</span>
                              {audit.startDate && (
                                <span>Started: {new Date(audit.startDate).toLocaleDateString()}</span>
                              )}
                              {audit.completedDate && (
                                <span>Completed: {audit.completedDate}</span>
                              )}
                            </div>

                            {normalizeStatus(audit.status) === "in-progress" && audit.progress && (
                              <div className="flex items-center space-x-2 mt-3">
                                <Progress value={audit.progress} className="flex-1 max-w-xs" />
                                <span className="text-sm text-muted-foreground">{audit.progress}%</span>
                              </div>
                            )}

                            {normalizeStatus(audit.status) === "in-progress" && audit.deadline && (
                              <div className="mt-3">
                                <CountdownTimer targetDate={audit.deadline} />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2 lg:items-end">
                            <div className="flex space-x-2">
                              {normalizeStatus(audit.status) === "in-progress" && (
                                <Button asChild>
                                  <a href={`/auditor/job/${audit.id}`}>Continue Auditing</a>
                                </Button>
                              )}
                              {normalizeStatus(audit.status) === "completed" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => fetchAuditReport(audit.id)}
                                    disabled={isLoadingReport}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    {isLoadingReport ? "Loading..." : "View Report"}
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {filteredAudits.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed audits found</h3>
                    <p className="text-muted-foreground">
                      You haven't completed any audit requests yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAudits.map((audit) => (
                  <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-foreground">{audit.projectName || audit.contractType}</h3>
                            <Badge className={getStatusColor(audit.status)}>
                              {getStatusIcon(audit.status)}
                              <span className="ml-1">{audit.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Price:</span>
                              <span className="font-semibold">${audit.negotiatedPrice || audit.proposedPrice}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Complexity:</span>
                              <Badge variant="outline" className={getComplexityColor(audit.complexity)}>
                                {audit.complexity}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Hash className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Contract:</span>
                              <span className="font-mono text-xs">{audit.contractHash.slice(0, 8)}...</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span>Created: {new Date(audit.createdAt).toLocaleDateString()}</span>
                            {audit.startDate && (
                              <span>Started: {new Date(audit.startDate).toLocaleDateString()}</span>
                            )}
                            {audit.completedDate && (
                              <span>Completed: {audit.completedDate}</span>
                            )}
                          </div>

                          {audit.findings && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                              <div className="flex items-center space-x-1 text-sm">
                                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                                <span className="text-muted-foreground">Critical:</span>
                                <span className="font-semibold">{audit.findings.critical}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="text-muted-foreground">High:</span>
                                <span className="font-semibold">{audit.findings.high}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-muted-foreground">Medium:</span>
                                <span className="font-semibold">{audit.findings.medium}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-muted-foreground">Low:</span>
                                <span className="font-semibold">{audit.findings.low}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 lg:items-end">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fetchAuditReport(audit.id)}
                              disabled={isLoadingReport}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {isLoadingReport ? "Loading..." : "View Report"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Main Content */}
        {activeTab === "available" && (
          <div className="space-y-4">
            {filteredAudits.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No audit requests found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "All" || complexityFilter !== "All" || specializationFilter !== "All"
                      ? "Try adjusting your search criteria or filters"
                      : "No audit requests are currently available"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAudits.map((audit) => (
                <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{audit.projectName || audit.contractType}</h3>
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

                        {normalizeStatus(audit.status) === "in-progress" && audit.progress && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Progress value={audit.progress} className="flex-1 max-w-xs" />
                            <span className="text-sm text-muted-foreground">{audit.progress}%</span>
                          </div>
                        )}

                        {normalizeStatus(audit.status) === "in-progress" && audit.deadline && (
                          <div className="mt-3">
                            <CountdownTimer targetDate={audit.deadline} />
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
                          {normalizeStatus(audit.status) === "available" && (
                            <>
                              {!account?.address ? (
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground mb-2">Connect wallet to accept</p>
                                  <ConnectButton client={client} />
                                </div>
                              ) : (
                                <Button size="sm" onClick={() => handleAcceptAudit(audit)}>
                                  Accept ${audit.proposedPrice}
                                </Button>
                              )}
                            </>
                          )}
                          {audit.status === "pending-acceptance" && (
                            <>
                              {!account?.address ? (
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground mb-2">Connect wallet to accept</p>
                                  <ConnectButton client={client} />
                                </div>
                              ) : (
                                <Button size="sm" onClick={() => handleAcceptAudit(audit)}>
                                  Accept ${audit.negotiatedPrice}
                                </Button>
                              )}
                            </>
                          )}
                          {normalizeStatus(audit.status) === "in-progress" && (
                            <Button asChild>
                              <a href={`/auditor/job/${audit.id}`}>Continue Auditing</a>
                            </Button>
                          )}
                          {normalizeStatus(audit.status) === "completed" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => fetchAuditReport(audit.id)}
                                disabled={isLoadingReport}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                {isLoadingReport ? "Loading..." : "View Report"}
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
              ))
            )}
          </div>
        )}

      </div>

      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Accept Audit Request</DialogTitle>
            <DialogDescription>
              Provide your details to accept this audit. You will be able to start working on the audit immediately.
            </DialogDescription>
          </DialogHeader>

          {!account?.address ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wallet Connection Required</h3>
              <p className="text-muted-foreground mb-4">
                Please connect your wallet to accept audit requests and mint NFTs
              </p>
              <ConnectButton client={client} />
            </div>
          ) : !nftConfirmation ? (
            <div className="space-y-4">
              {/* Loading Metadata */}
              {loadingMetadata && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Loading contract metadata...</span>
                </div>
              )}

              {/* Metadata Error */}
              {metadataError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Metadata Error</span>
                  </div>
                  <p className="text-sm text-destructive mt-1">{metadataError}</p>
                </div>
              )}

              {/* Basic Audit Details */}
              {selectedAudit && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Audit Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Project:</span> {selectedAudit.projectName || selectedAudit.contractType}
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

              {/* Detailed Contract Information */}
              {contractMetadata && (
                <div className="space-y-4">
                  {/* Repository Information */}
                  {contractMetadata.repository.name && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Repository Information
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span> {contractMetadata.repository.name}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Language:</span> {contractMetadata.repository.language}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stars:</span> {contractMetadata.repository.stars}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Forks:</span> {contractMetadata.repository.forks}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contributors:</span> {contractMetadata.repository.contributors}
                        </div>
                        <div>
                          <span className="text-muted-foreground">License:</span> {contractMetadata.repository.license}
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Description:</span> {contractMetadata.repository.description}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contract Information */}
                  {contractMetadata.contract.type && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Contract Information
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span> {contractMetadata.contract.type}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Name:</span> {contractMetadata.contract.name}
                        </div>
                        {contractMetadata.contract.symbol && (
                          <div>
                            <span className="text-muted-foreground">Symbol:</span> {contractMetadata.contract.symbol}
                          </div>
                        )}
                        {contractMetadata.contract.totalSupply && (
                          <div>
                            <span className="text-muted-foreground">Total Supply:</span> {contractMetadata.contract.totalSupply}
                          </div>
                        )}
                        {contractMetadata.contract.decimals > 0 && (
                          <div>
                            <span className="text-muted-foreground">Decimals:</span> {contractMetadata.contract.decimals}
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Deployment Hash:</span> 
                          <span className="font-mono ml-1">{contractMetadata.contract.deploymentHash}</span>
                        </div>
                        {contractMetadata.contract.functions.length > 0 && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Functions:</span> {contractMetadata.contract.functions.length}
                          </div>
                        )}
                        {contractMetadata.contract.events.length > 0 && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Events:</span> {contractMetadata.contract.events.length}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Audit Specifications */}
                  {contractMetadata.audit.scope.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Audit Specifications
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground font-medium">Scope:</span>
                          <ul className="mt-1 ml-4 list-disc">
                            {contractMetadata.audit.scope.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        {contractMetadata.audit.deliverables.length > 0 && (
                          <div>
                            <span className="text-muted-foreground font-medium">Deliverables:</span>
                            <ul className="mt-1 ml-4 list-disc">
                              {contractMetadata.audit.deliverables.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {contractMetadata.audit.methodology.length > 0 && (
                          <div>
                            <span className="text-muted-foreground font-medium">Methodology:</span>
                            <ul className="mt-1 ml-4 list-disc">
                              {contractMetadata.audit.methodology.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {contractMetadata.audit.timeline && (
                          <div>
                            <span className="text-muted-foreground">Timeline:</span> {contractMetadata.audit.timeline}
                          </div>
                        )}
                        {contractMetadata.audit.reportingFormat && (
                          <div>
                            <span className="text-muted-foreground">Reporting Format:</span> {contractMetadata.audit.reportingFormat}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* GitHub Link */}
                  {contractMetadata.basic.githubUrl && (
                    <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Repository Access
                      </h4>
                      <a 
                        href={contractMetadata.basic.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View on GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
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
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Connected wallet: {account.address}
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
                  Audit Acceptance
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Upon acceptance, you will:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Be assigned as the auditor for this audit request</li>
                  <li>• Get access to the audit workspace with contract details</li>
                  <li>• Have your acceptance recorded with timeline and price</li>
                  <li>• Be able to start working on the audit immediately</li>
                  <li>• Receive an NFT upon completion with full audit results</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)} disabled={isAccepting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAccept} disabled={isAccepting || !auditorName || !estimatedDays}>
                  {isAccepting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Accepting Audit...
                    </>
                  ) : (
                    "Accept Audit"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-success font-semibold mb-3">
                  <CheckCircle className="w-5 h-5" />
                  Audit Accepted Successfully!
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Audit ID:</span>{" "}
                    <span className="font-mono font-semibold">#{selectedAudit?.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auditor:</span>{" "}
                    <span className="font-semibold">{nftConfirmation.auditOwner?.auditor_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accepted Price:</span>{" "}
                    <span className="font-semibold">${nftConfirmation.auditOwner?.accepted_price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-success" />
                  {nftConfirmation.message} Redirecting to audit workspace...
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Audit Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Audit Report
            </DialogTitle>
          <DialogDescription>
            Comprehensive audit results and findings for {selectedAuditReport?.auditRequest?.projectName || "Selected Audit"}
          </DialogDescription>
          </DialogHeader>

          {isLoadingReport ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading audit report...</p>
              </div>
            </div>
          ) : selectedAuditReport ? (
            <div className="space-y-6">
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Project Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedAuditReport.auditRequest?.projectName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Complexity</Label>
                      <Badge variant="outline">{selectedAuditReport.auditRequest?.complexity}</Badge>
                    </div>
                    {selectedAuditReport.auditRequest?.developerWallet && (
                      <AddressDisplay
                        label="Developer Wallet"
                        address={selectedAuditReport.auditRequest.developerWallet}
                        type="contract"
                        itemId={`developer-wallet-${selectedAuditReport.auditRequest.developerWallet}`}
                      />
                    )}
                    <div>
                      <Label className="text-sm font-medium">GitHub Repository</Label>
                      <a 
                        href={selectedAuditReport.auditRequest?.githubUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                    >
                        View Repository
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{selectedAuditReport.auditRequest?.projectDescription}</p>
              </div>
                  {selectedAuditReport.auditRequest?.repositoryHash && (
                    <AddressDisplay
                      label="Repository Hash"
                      address={selectedAuditReport.auditRequest.repositoryHash}
                      type="ipfs"
                      itemId={`repository-hash-${selectedAuditReport.auditRequest.repositoryHash}`}
                    />
                  )}
                  {selectedAuditReport.auditRequest?.requestNft && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Request NFT</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedAuditReport.auditRequest.requestNft.contract_address && (
                          <AddressDisplay
                            label="NFT Contract"
                            address={selectedAuditReport.auditRequest.requestNft.contract_address}
                            type="contract"
                            itemId={`request-nft-contract-${selectedAuditReport.auditRequest.requestNft.contract_address}`}
                          />
                        )}
                        {selectedAuditReport.auditRequest.requestNft.mint_transaction_hash && (
                          <AddressDisplay
                            label="Transaction Hash"
                            address={selectedAuditReport.auditRequest.requestNft.mint_transaction_hash}
                            type="transaction"
                            itemId={`request-nft-tx-${selectedAuditReport.auditRequest.requestNft.mint_transaction_hash}`}
                          />
                        )}
                        {selectedAuditReport.auditRequest.requestNft.metadata_uri && (
                          <AddressDisplay
                            label="Metadata URI"
                            address={selectedAuditReport.auditRequest.requestNft.metadata_uri}
                            type="ipfs"
                            itemId={`request-nft-metadata-${selectedAuditReport.auditRequest.requestNft.metadata_uri}`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Auditor Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Auditor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Auditor Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedAuditReport.auditor?.name}</p>
                    </div>
                    {selectedAuditReport.auditor?.wallet && (
                      <AddressDisplay
                        label="Auditor Wallet"
                        address={selectedAuditReport.auditor.wallet}
                        type="contract"
                        itemId={`auditor-wallet-${selectedAuditReport.auditor.wallet}`}
                      />
                    )}
                    <div>
                      <Label className="text-sm font-medium">Accepted Price</Label>
                      <p className="text-sm font-semibold">${selectedAuditReport.auditor?.acceptedPrice}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Completion Date</Label>
                <p className="text-sm text-muted-foreground">
                        {new Date(selectedAuditReport.completionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Audit Results Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedAuditReport.findingsCount}</div>
                      <div className="text-sm text-muted-foreground">Total Findings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">{selectedAuditReport.vulnerabilitiesCount}</div>
                      <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">
                        {selectedAuditReport.severityBreakdown?.critical || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {selectedAuditReport.severityBreakdown?.high || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">High</div>
                    </div>
                  </div>
                  
                  {selectedAuditReport.severityBreakdown && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Severity Breakdown</Label>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-destructive rounded-full"></div>
                          <span className="text-sm">Critical: {selectedAuditReport.severityBreakdown.critical || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">High: {selectedAuditReport.severityBreakdown.high || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Medium: {selectedAuditReport.severityBreakdown.medium || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Low: {selectedAuditReport.severityBreakdown.low || 0}</span>
                        </div>
              </div>
            </div>
          )}
                </CardContent>
              </Card>

              {/* NFT Information */}
              {selectedAuditReport.resultNft && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Audit Result NFT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Token ID</Label>
                        <p className="text-sm font-mono">
                          {selectedAuditReport.resultNft.id 
                            ? `#${selectedAuditReport.resultNft.id}` 
                            : "Not available"
                          }
                        </p>
                      </div>
                      {selectedAuditReport.resultNft.address && (
                        <AddressDisplay
                          label="Contract Address"
                          address={selectedAuditReport.resultNft.address}
                          type="contract"
                          itemId={`result-contract-${selectedAuditReport.resultNft.address}`}
                        />
                      )}
                      {selectedAuditReport.resultNft.transactionHash && (
                        <AddressDisplay
                          label="Transaction Hash"
                          address={selectedAuditReport.resultNft.transactionHash}
                          type="transaction"
                          itemId={`result-tx-${selectedAuditReport.resultNft.transactionHash}`}
                        />
                      )}
                      {selectedAuditReport.resultNft.metadataUri && (
                        <AddressDisplay
                          label="IPFS Metadata"
                          address={selectedAuditReport.resultNft.metadataUri}
                          type="ipfs"
                          itemId={`result-metadata-${selectedAuditReport.resultNft.metadataUri}`}
                        />
                      )}
                    </div>
                    {selectedAuditReport.resultNft.explorerUrl && (
                      <div>
                        <Button asChild variant="outline" size="sm">
                          <a 
                            href={selectedAuditReport.resultNft.explorerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Explorer
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Findings */}
              {selectedAuditReport.findings && selectedAuditReport.findings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Detailed Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedAuditReport.findings.map((finding: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{finding.title}</h4>
                            <Badge 
                              variant={
                                finding.severity === 'critical' ? 'destructive' :
                                finding.severity === 'high' ? 'destructive' :
                                finding.severity === 'medium' ? 'default' : 'secondary'
                              }
                            >
                              {finding.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Category: {finding.finding_category}</span>
                            <span>Status: {finding.finding_status}</span>
                            {finding.file_name && <span>File: {finding.file_name}</span>}
                            {finding.line_number && <span>Line: {finding.line_number}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* IPFS Evidence */}
              {selectedAuditReport.ipfsHash && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      IPFS Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedAuditReport.ipfsHash && (
                      <AddressDisplay
                        label="Comprehensive Evidence Package"
                        address={selectedAuditReport.ipfsHash}
                        type="ipfs"
                        itemId={`evidence-package-${selectedAuditReport.ipfsHash}`}
                      />
                    )}
                    {selectedAuditReport.evidenceFileHashes && (
                      <div>
                        <Label className="text-sm font-medium">Individual Evidence Files</Label>
                        <div className="space-y-2 mt-2">
                          {selectedAuditReport.evidenceFileHashes.split(',').map((hash: string, index: number) => {
                            const trimmedHash = hash.trim()
                            return trimmedHash ? (
                              <AddressDisplay
                                key={index}
                                label={`Evidence File ${index + 1}`}
                                address={trimmedHash}
                                type="ipfs"
                                itemId={`evidence-file-${index}-${trimmedHash}`}
                              />
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No audit report data available</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setIsReportDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}