"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
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
  Database,
  Link as LinkIcon,
  Copy,
  Wallet,
  Coins,
  Image,
  FileCode,
  Activity,
  TrendingUp,
  Star,
  Calendar,
  User,
  Building,
  Layers,
  Archive,
  Search,
  Filter,
  RefreshCw,
  Info,
  Award,
  Target,
  Zap,
  Globe,
  Lock,
  Unlock,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Check,
  X,
  Hash,
} from "lucide-react"
import Link from "next/link"
import { VerifyProofButton } from "@/components/verify-proof-button"

// Enhanced interfaces for comprehensive data
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
  supabase?: {
    auditRequestId: string
    contracts: any[]
    nfts: any[]
    ipfsData: any[]
  }
}

interface WalletStats {
  totalProjects: number
  completedAudits: number
  inProgressAudits: number
  pendingAudits: number
  totalSpent: number
  totalContracts: number
  totalNFTs: number
  totalIPFSFiles: number
  reputationScore: number
  memberSince: string | null
  lastActivity: string | null
}

interface DeveloperProfile {
  id: string
  wallet_address: string
  total_projects: number
  total_spent: number
  reputation_score: number
  first_project_date: string
  last_activity: string
  status: string
  created_at: string
  updated_at: string
}

interface ContractData {
  id: string
  audit_request_id: string
  contract_address: string
  contract_type: string
  contract_name: string
  contract_symbol: string
  total_supply?: number
  decimals?: number
  deployment_hash: string
  explorer_url: string
  created_at: string
}

interface NFTData {
  id: string
  audit_request_id: string
  contract_id: string
  token_id: string
  token_name: string
  token_description: string
  metadata_uri: string
  owner_wallet: string
  mint_transaction_hash: string
  explorer_url: string
  created_at: string
}

interface IPFSData {
  id: string
  audit_request_id: string
  nft_id?: string
  ipfs_hash: string
  ipfs_uri: string
  content_type: string
  file_size?: number
  related_contract?: string
  related_token?: string
  created_at: string
}

interface DashboardData {
  projects: ProjectData[]
  stats: WalletStats
  walletAddress: string
  developerProfile: DeveloperProfile | null
  contracts: ContractData[]
  nfts: NFTData[]
  ipfsData: IPFSData[]
  totalRecords: number
  lastUpdated: string
  dataSource: string
}

interface VerificationData {
  auditRequest: {
    id: string
    projectName: string
    developerWallet: string
    estimatedCompletionDate: string
    status: string
    createdAt: string
  }
  smartContracts: Array<{
    id: string
    contractAddress: string
    contractType: string
    contractName: string
    contractSymbol: string
    totalSupply?: number
    decimals?: number
    deploymentHash: string
    explorerUrl: string
  }>
  auditor: {
    name: string
    wallet: string
    acceptedAt: string
  }
  auditResult: {
    id: string
    auditRequestId: string
    status: string
    findingsCount: number
    severityBreakdown: any
    completionDate: string
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success/20 text-success border-success/30"
    case "in-progress":
      return "bg-primary/20 text-primary border-primary/30"
    case "available":
      return "bg-warning/20 text-warning border-warning/30"
    case "cancelled":
      return "bg-destructive/20 text-destructive border-destructive/30"
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
    case "cancelled":
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getComplexityColor = (complexity: string) => {
  switch (complexity?.toLowerCase()) {
    case "critical":
      return "bg-destructive/20 text-destructive border-destructive/30"
    case "high":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "medium":
      return "bg-warning/20 text-warning border-warning/30"
    case "low":
      return "bg-success/20 text-success border-success/30"
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30"
  }
}

// AddressDisplay component for copy/link functionality
const AddressDisplay = ({ 
  address, 
  label, 
  itemId, 
  copiedItems, 
  onCopy, 
  explorerUrl 
}: {
  address: string
  label: string
  itemId: string
  copiedItems: Set<string>
  onCopy: (text: string, itemId: string) => void
  explorerUrl?: string
}) => {
  // Validate address
  const isValidAddress = address && address !== 'undefined' && address !== 'null' && address.trim() !== ''
  
  if (!isValidAddress) {
    return (
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground">Not available</p>
      </div>
    )
  }

  // Clean IPFS addresses
  const cleanAddress = address.startsWith('ipfs://') ? address.replace('ipfs://', '') : address

  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <p className="text-sm font-mono flex-1 truncate">{cleanAddress}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopy(cleanAddress, itemId)}
          className="h-8 w-8 p-0"
        >
          {copiedItems.has(itemId) ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
        {explorerUrl && (
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
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  
  // Audit Report Dialog State
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false)
  const [selectedAuditReport, setSelectedAuditReport] = useState<VerificationData | null>(null)
  const [loadingAuditReport, setLoadingAuditReport] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  // Set initial wallet address based on authentication method
  useEffect(() => {
    if (user) {
      if (user.authMethod === "email") {
        // For email authentication, keep wallet address empty
        setWalletAddress("")
      } else if (user.authMethod === "wallet" && user.walletAddress) {
        // For wallet authentication, use the connected wallet address
        setWalletAddress(user.walletAddress)
      } else if (user.authMethod === "both" && user.walletAddress) {
        // For both methods, use the wallet address if available
        setWalletAddress(user.walletAddress)
      }
    }
  }, [user])

  useEffect(() => {
    if (walletAddress) {
      fetchDashboardData()
    }
  }, [walletAddress])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("[Dashboard] Fetching comprehensive data for wallet:", walletAddress)
      
      const response = await fetch(`/api/dashboard-supabase?wallet=${walletAddress}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
        console.log("[Dashboard] Data loaded successfully:", result.data)
      } else {
        throw new Error(result.error || "Failed to load dashboard data")
      }
    } catch (err: any) {
      console.error("[Dashboard] Error fetching data:", err)
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

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

  const fetchAuditReport = async (auditRequestId: string) => {
    setLoadingAuditReport(true)
    try {
      console.log('[Dashboard] Fetching audit report for ID:', auditRequestId)
      
      const response = await fetch('/api/verify-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditRequestId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch audit report')
      }

      console.log('[Dashboard] Audit report fetched successfully:', data.data)
      setSelectedAuditReport(data.data)
      setIsAuditReportOpen(true)
    } catch (error: any) {
      console.error('[Dashboard] Error fetching audit report:', error)
      alert("Failed to load audit report: " + error.message)
    } finally {
      setLoadingAuditReport(false)
    }
  }

  // Show initial state for email users without wallet address
  if (user?.authMethod === "email" && !walletAddress) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Developer Dashboard</h1>
                <p className="text-muted-foreground">Comprehensive overview of your ProofChain activities</p>
              </div>
            </div>
          </div>

          {/* Wallet Address Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Address
              </CardTitle>
              <CardDescription>
                Enter a wallet address to view its comprehensive data and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter wallet address (0x...)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={fetchDashboardData} 
                  disabled={loading || !walletAddress} 
                  className="px-6"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Load Data
                    </>
                  )}
                </Button>
              </div>
              
              {/* Authentication Method Indicator */}
              {user && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Authentication:</span>
                  <Badge variant="secondary">
                    <User className="w-3 h-3 mr-1" />
                    Email
                  </Badge>
                  <span className="text-slate-500 text-xs">
                    (Enter any wallet address to view data)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Enter a Wallet Address</h3>
            <p className="text-slate-500">Please enter a wallet address above to view dashboard data and activities.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Dashboard</h2>
            <p className="text-slate-500">Fetching comprehensive wallet data from Supabase...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">{error}</p>
              <div className="flex gap-2">
                <Button onClick={fetchDashboardData} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => setError(null)} variant="ghost">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-slate-700">No Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">No dashboard data found for this wallet address.</p>
              <Button onClick={fetchDashboardData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { projects, stats, developerProfile, contracts, nfts, ipfsData, walletAddress: currentWallet } = dashboardData

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Developer Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive overview of your ProofChain activities</p>
              
              {/* Data Source Indicator */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Live data</span>
                <Badge variant="secondary" className="text-xs">Updated {new Date(dashboardData.lastUpdated).toLocaleTimeString()}</Badge>
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
              <VerifyProofButton variant="outline" />
              <Button asChild>
                <Link href="/upload">
                  <Plus className="w-4 h-4 mr-2" />
                  New Audit Request
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wallet Address Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Address
            </CardTitle>
            <CardDescription>
              {user?.authMethod === "email" 
                ? "Enter a wallet address to view its comprehensive data and activities"
                : user?.authMethod === "wallet" 
                ? "View data for your connected wallet address"
                : "Enter a wallet address to view its comprehensive data and activities"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/*<div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={user?.authMethod === "email" ? "Enter wallet address (0x...)" : "0x..."}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  disabled={user?.authMethod === "wallet" && !!user?.walletAddress}
                />
              </div>
              <Button 
                onClick={fetchDashboardData} 
                disabled={loading || !walletAddress} 
                className="px-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Load Data
                  </>
                )}
              </Button>
            </div>*/}
            
            {/* Authentication Method Indicator */}
            {user && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-slate-600">Authentication:</span>
                <Badge variant={user.authMethod === "email" ? "secondary" : "default"}>
                  {user.authMethod === "email" ? (
                    <>
                      <User className="w-3 h-3 mr-1" />
                      Email
                    </>
                  ) : user.authMethod === "wallet" ? (
                    <>
                      <Wallet className="w-3 h-3 mr-1" />
                      Wallet
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 mr-1" />
                      Email + Wallet
                    </>
                  )}
                </Badge>
                {user.authMethod === "email" && (
                  <span className="text-slate-500 text-xs">
                    (Enter any wallet address to view data)
                  </span>
                )}
                {user.authMethod === "wallet" && user.walletAddress && (
                  <span className="text-slate-500 text-xs">
                    (Using your connected wallet)
                  </span>
                )}
              </div>
            )}
            
            {/* Current Wallet Display */}
            {currentWallet && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <span>Current wallet:</span>
                <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{currentWallet}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(currentWallet, 'current-wallet')}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedAudits} completed • {stats.inProgressAudits} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all audit requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reputationScore}/100</div>
              <p className="text-xs text-muted-foreground">Based on audit quality</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracts + stats.totalNFTs}</div>
              <p className="text-xs text-muted-foreground">{stats.totalContracts} contracts • {stats.totalNFTs} NFTs</p>
            </CardContent>
          </Card>
        </div>

        {/* Developer Profile Section */}
        {developerProfile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Developer Profile
              </CardTitle>
              <CardDescription>
                Your ProofChain developer profile and activity summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1">
                        {developerProfile.wallet_address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(developerProfile.wallet_address, 'dev-profile-wallet')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge variant={developerProfile.status === 'Active' ? 'default' : 'secondary'}>
                        {developerProfile.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-sm text-foreground mt-1">
                      {new Date(developerProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                    <p className="text-sm text-foreground mt-1">
                      {new Date(developerProfile.last_activity).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Projects</label>
                    <p className="text-2xl font-bold text-foreground">{developerProfile.total_projects}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                    <p className="text-2xl font-bold text-foreground">${developerProfile.total_spent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="ipfs">IPFS Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Projects
                  </CardTitle>
                  <CardDescription>
                    Your latest audit requests and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
                      <p className="text-muted-foreground mb-4">Start by creating your first audit request</p>
                      <Button asChild>
                        <Link href="/upload">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Project
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-foreground">{project.name}</h4>
                              <Badge className={getStatusColor(project.status)}>
                                {getStatusIcon(project.status)}
                                <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                              </Badge>
                              <Badge variant="outline" className={getComplexityColor(project.auditPackage)}>
                                {project.auditPackage}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>${project.proposedPrice.toLocaleString()}</span>
                              <span>{project.createdAt}</span>
                              {project.progress > 0 && (
                                <div className="flex items-center gap-2">
                                  <Progress value={project.progress} className="w-20 h-2" />
                                  <span>{project.progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/auditor/job/${project.id}`}>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                      {projects.length > 5 && (
                        <div className="text-center pt-4">
                          <Button variant="outline" asChild>
                            <Link href="#projects">View All Projects</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Quick Statistics
                  </CardTitle>
                  <CardDescription>
                    Key metrics and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">{stats.completedAudits}</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">{stats.inProgressAudits}</div>
                        <div className="text-sm text-muted-foreground">In Progress</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
                        <span className="text-sm font-semibold text-foreground">
                          {stats.totalProjects > 0 ? Math.round((stats.completedAudits / stats.totalProjects) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={stats.totalProjects > 0 ? (stats.completedAudits / stats.totalProjects) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Average Project Value</span>
                        <span className="text-sm font-semibold text-foreground">
                          ${stats.totalProjects > 0 ? Math.round(stats.totalSpent / stats.totalProjects) : 0}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Assets</span>
                        <span className="font-semibold text-foreground">
                          {stats.totalContracts + stats.totalNFTs + stats.totalIPFSFiles}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  All Projects
                </CardTitle>
                <CardDescription>
                  Complete list of your audit requests and their detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects found</h3>
                    <p className="text-slate-500 mb-6">You haven't created any audit requests yet.</p>
                    <Button asChild>
                      <Link href="/upload">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="leading-none font-semibold flex items-center gap-2">{project.name}</h3>
                                <Badge className={getStatusColor(project.status)}>
                                  {getStatusIcon(project.status)}
                                  <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                                </Badge>
                                <Badge variant="outline" className={getComplexityColor(project.auditPackage)}>
                                  {project.auditPackage}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{project.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-slate-600">GitHub:</span>
                                  <a 
                                    href={project.githubUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-2 text-primary hover:underline flex items-center gap-1"
                                  >
                                    <LinkIcon className="w-3 h-3" />
                                    View Repository
                                  </a>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-600">Price:</span>
                                  <span className="ml-2 font-semibold">${project.proposedPrice.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-600">Created:</span>
                                  <span className="ml-2">{project.createdAt}</span>
                                </div>
                              </div>

                              {project.tags && project.tags.length > 0 && (
                                <div className="mt-3">
                                  <div className="flex flex-wrap gap-1">
                                    {project.tags.map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              {project.status === "completed" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => fetchAuditReport(project.id)}
                                    disabled={loadingAuditReport}
                                  >
                                    {loadingAuditReport ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <Eye className="w-4 h-4 mr-1" />
                                    )}
                                    View Report
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
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/auditor/job/${project.id}`}>
                                    <Clock className="w-4 h-4 mr-1" />
                                    Track Progress
                                  </Link>
                                </Button>
                              )}
                              {project.status?.toLowerCase() === "available" && (
                                <Button variant="outline" size="sm" disabled>
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  Pending Assignment
                                </Button>
                              )}
                            </div>
                          </div>

                          {project.progress > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Progress</span>
                                <span className="text-sm font-semibold text-slate-900">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          )}

                          {project.findings && (
                            <div className="border-t border-slate-200 pt-4">
                              <h4 className="text-sm font-medium text-slate-600 mb-2">Audit Findings</h4>
                              <div className="flex gap-2">
                                {project.findings.critical > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {project.findings.critical} Critical
                                  </Badge>
                                )}
                                {project.findings.high > 0 && (
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                                    {project.findings.high} High
                                  </Badge>
                                )}
                                {project.findings.medium > 0 && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    {project.findings.medium} Medium
                                  </Badge>
                                )}
                                {project.findings.low > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {project.findings.low} Low
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5" />
                  Smart Contracts
                </CardTitle>
                <CardDescription>
                  All smart contracts associated with your audit requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No contracts found</h3>
                    <p className="text-slate-500">No smart contracts have been deployed for your projects yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <Card key={contract.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="leading-none font-semibold flex items-center gap-2">{contract.contract_name}</h3>
                                <Badge variant="outline">{contract.contract_type}</Badge>
                                <Badge variant="secondary">{contract.contract_symbol}</Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-slate-600">Address:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <code className="bg-slate-40 px-2 py-1 rounded text-xs font-mono">
                                      {contract.contract_address}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(contract.contract_address, `contract-${contract.id}`)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {contract.total_supply && (
                                  <div>
                                    <span className="font-medium text-slate-600">Total Supply:</span>
                                    <span className="ml-2 font-mono">{contract.total_supply.toLocaleString()}</span>
                                  </div>
                                )}
                                
                                {contract.decimals && (
                                  <div>
                                    <span className="font-medium text-slate-600">Decimals:</span>
                                    <span className="ml-2">{contract.decimals}</span>
                                  </div>
                                )}
                                
                                <div>
                                  <span className="font-medium text-slate-600">Deployed:</span>
                                  <span className="ml-2">{new Date(contract.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Button variant="outline" size="sm" asChild>
                                <a href={contract.explorer_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Explorer
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  NFTs & Tokens
                </CardTitle>
                <CardDescription>
                  All NFTs and tokens minted for your audit requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nfts.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No NFTs found</h3>
                    <p className="text-slate-500">No NFTs have been minted for your projects yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                      <Card key={nft.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="leading-none font-semibold flex items-center gap-2">{nft.token_name}</h3>
                              <p className="text-sm text-slate-600">{nft.token_description}</p>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-slate-600">Token ID:</span>
                                <span className="ml-2 font-mono">{nft.token_id}</span>
                              </div>
                              <div>
                                <span className="font-medium text-slate-600">Owner:</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="bg-slate-45 px-2 py-1 rounded text-xs font-mono">
                                    {nft.owner_wallet.substring(0, 10)}...
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(nft.owner_wallet, `nft-owner-${nft.id}`)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-slate-600">Minted:</span>
                                <span className="ml-2">{new Date(nft.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={nft.explorer_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Explorer
                                </a>
                              </Button>
                              {nft.metadata_uri && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={nft.metadata_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')} target="_blank" rel="noopener noreferrer">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Metadata
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* IPFS Data Tab */}
          <TabsContent value="ipfs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  IPFS Data
                </CardTitle>
                <CardDescription>
                  All files and metadata stored on IPFS for your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ipfsData.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No IPFS data found</h3>
                    <p className="text-slate-500">No files have been uploaded to IPFS for your projects yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ipfsData.map((ipfs) => (
                      <Card key={ipfs.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-5">{ipfs.content_type}</h3>
                                <Badge variant="outline">{ipfs.content_type}</Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-slate-600">IPFS Hash:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <code className="bg-slate-45 px-2 py-1 rounded text-xs font-mono">
                                      {ipfs.ipfs_hash}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(ipfs.ipfs_hash, `ipfs-hash-${ipfs.id}`)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {ipfs.file_size && (
                                  <div>
                                    <span className="font-medium text-slate-600">File Size:</span>
                                    <span className="ml-2">{(ipfs.file_size / 1024).toFixed(2)} KB</span>
                                  </div>
                                )}
                                
                                <div>
                                  <span className="font-medium text-slate-600">Uploaded:</span>
                                  <span className="ml-2">{new Date(ipfs.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                {ipfs.related_contract && (
                                  <div>
                                    <span className="font-medium text-slate-600">Related Contract:</span>
                                    <span className="ml-2 font-mono text-xs">{ipfs.related_contract}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Button variant="outline" size="sm" asChild>
                                <a href={ipfs.ipfs_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')} target="_blank" rel="noopener noreferrer">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </a>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <a href={ipfs.ipfs_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')} target="_blank" rel="noopener noreferrer" download>
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Project Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of your projects by status and complexity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Completed</span>
                        <span className="text-sm font-semibold text-slate-900">{stats.completedAudits}</span>
                      </div>
                      <Progress value={(stats.completedAudits / stats.totalProjects) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">In Progress</span>
                        <span className="text-sm font-semibold text-slate-900">{stats.inProgressAudits}</span>
                      </div>
                      <Progress value={(stats.inProgressAudits / stats.totalProjects) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Available</span>
                        <span className="text-sm font-semibold text-slate-900">{stats.pendingAudits}</span>
                      </div>
                      <Progress value={(stats.pendingAudits / stats.totalProjects) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Financial Overview
                  </CardTitle>
                  <CardDescription>
                    Your spending patterns and project values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-3xl font-bold text-slate-900">${stats.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Total Spent</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-xl font-bold text-slate-900">
                          ${stats.totalProjects > 0 ? Math.round(stats.totalSpent / stats.totalProjects) : 0}
                        </div>
                        <div className="text-xs text-slate-600">Avg. Project Value</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-xl font-bold text-slate-900">{stats.totalProjects}</div>
                        <div className="text-xs text-slate-600">Total Projects</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Audit Report Dialog */}
      <Dialog open={isAuditReportOpen} onOpenChange={setIsAuditReportOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Audit Report
            </DialogTitle>
          </DialogHeader>
          
          {selectedAuditReport && (
            <div className="space-y-6">
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Project Name</Label>
                      <p className="text-sm font-semibold">{selectedAuditReport.auditRequest.projectName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedAuditReport.auditRequest.status)}>
                        {getStatusIcon(selectedAuditReport.auditRequest.status)}
                        <span className="ml-1 capitalize">{selectedAuditReport.auditRequest.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Created Date</Label>
                      <p className="text-sm">{new Date(selectedAuditReport.auditRequest.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estimated Completion</Label>
                      <p className="text-sm">{new Date(selectedAuditReport.auditRequest.estimatedCompletionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <AddressDisplay
                    address={selectedAuditReport.auditRequest.developerWallet}
                    label="Developer Wallet"
                    itemId="developer-wallet"
                    copiedItems={copiedItems}
                    onCopy={copyToClipboard}
                  />
                </CardContent>
              </Card>

              {/* Smart Contracts */}
              {selectedAuditReport.smartContracts && selectedAuditReport.smartContracts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCode className="w-5 h-5" />
                      Smart Contracts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedAuditReport.smartContracts.map((contract, index) => (
                      <div key={contract.id || index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{contract.contractName}</h4>
                          <Badge variant="outline">{contract.contractType}</Badge>
                          {contract.contractSymbol && (
                            <Badge variant="secondary">{contract.contractSymbol}</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AddressDisplay
                            address={contract.contractAddress}
                            label="Contract Address"
                            itemId={`contract-address-${index}`}
                            copiedItems={copiedItems}
                            onCopy={copyToClipboard}
                            explorerUrl={contract.explorerUrl}
                          />
                          
                          <AddressDisplay
                            address={contract.deploymentHash}
                            label="Deployment Hash"
                            itemId={`deployment-hash-${index}`}
                            copiedItems={copiedItems}
                            onCopy={copyToClipboard}
                          />
                          
                          {contract.totalSupply && (
                            <div>
                              <Label className="text-sm font-medium">Total Supply</Label>
                              <p className="text-sm font-mono">{contract.totalSupply.toLocaleString()}</p>
                            </div>
                          )}
                          
                          {contract.decimals && (
                            <div>
                              <Label className="text-sm font-medium">Decimals</Label>
                              <p className="text-sm">{contract.decimals}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Auditor Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Auditor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Auditor Name</Label>
                      <p className="text-sm font-semibold">{selectedAuditReport.auditor.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Accepted Date</Label>
                      <p className="text-sm">{new Date(selectedAuditReport.auditor.acceptedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <AddressDisplay
                    address={selectedAuditReport.auditor.wallet}
                    label="Auditor Wallet"
                    itemId="auditor-wallet"
                    copiedItems={copiedItems}
                    onCopy={copyToClipboard}
                  />
                </CardContent>
              </Card>

              {/* Audit Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Audit Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Findings Count</Label>
                      <p className="text-2xl font-bold">{selectedAuditReport.auditResult.findingsCount}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Completion Date</Label>
                      <p className="text-sm">{new Date(selectedAuditReport.auditResult.completionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedAuditReport.auditResult.status)}>
                        {getStatusIcon(selectedAuditReport.auditResult.status)}
                        <span className="ml-1 capitalize">{selectedAuditReport.auditResult.status}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedAuditReport.auditResult.severityBreakdown && (
                    <div>
                      <Label className="text-sm font-medium">Severity Breakdown</Label>
                      <div className="flex gap-2 mt-2">
                        {selectedAuditReport.auditResult.severityBreakdown.critical > 0 && (
                          <Badge variant="destructive">
                            {selectedAuditReport.auditResult.severityBreakdown.critical} Critical
                          </Badge>
                        )}
                        {selectedAuditReport.auditResult.severityBreakdown.high > 0 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            {selectedAuditReport.auditResult.severityBreakdown.high} High
                          </Badge>
                        )}
                        {selectedAuditReport.auditResult.severityBreakdown.medium > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {selectedAuditReport.auditResult.severityBreakdown.medium} Medium
                          </Badge>
                        )}
                        {selectedAuditReport.auditResult.severityBreakdown.low > 0 && (
                          <Badge variant="secondary">
                            {selectedAuditReport.auditResult.severityBreakdown.low} Low
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audit Result NFT */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Audit Result NFT
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Token ID</Label>
                      <p className="text-sm font-mono">
                        {selectedAuditReport.nft.id ? `#${selectedAuditReport.nft.id}` : "Not available"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex items-center gap-2">
                        {selectedAuditReport.verification.blockchainVerified ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {selectedAuditReport.verification.blockchainVerified ? "Blockchain Verified" : "Not Verified"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <AddressDisplay
                    address={selectedAuditReport.nft.address}
                    label="NFT Contract Address"
                    itemId="nft-address"
                    copiedItems={copiedItems}
                    onCopy={copyToClipboard}
                  />
                  
                  <AddressDisplay
                    address={selectedAuditReport.nft.transactionHash}
                    label="Transaction Hash"
                    itemId="nft-transaction"
                    copiedItems={copiedItems}
                    onCopy={copyToClipboard}
                    explorerUrl={selectedAuditReport.nft.explorerUrl}
                  />
                  
                  <AddressDisplay
                    address={selectedAuditReport.nft.ipfsHash || selectedAuditReport.nft.metadataUri}
                    label="IPFS Hash"
                    itemId="ipfs-hash"
                    copiedItems={copiedItems}
                    onCopy={copyToClipboard}
                    explorerUrl={selectedAuditReport.nft.ipfsUrl || undefined}
                  />
                </CardContent>
              </Card>

              {/* IPFS Audit Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    IPFS Audit Data
                    <div className="flex items-center gap-2 ml-auto">
                      {selectedAuditReport.verification.ipfsVerified ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {selectedAuditReport.verification.ipfsVerified ? "IPFS Verified" : "IPFS Error"}
                      </span>
                      {selectedAuditReport.verification.ipfsError && (
                        <span className="text-sm text-red-500">({selectedAuditReport.verification.ipfsError})</span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAuditReport.ipfsData ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">IPFS Content Preview</Label>
                        <div className="bg-muted/50 p-4 rounded-lg max-h-40 overflow-y-auto">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(selectedAuditReport.ipfsData, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">IPFS Data Not Available</h3>
                      <p className="text-muted-foreground mb-4">
                        {selectedAuditReport.verification.ipfsError || "No IPFS data found for this audit"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audit Findings */}
              {selectedAuditReport.findings && selectedAuditReport.findings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Audit Findings ({selectedAuditReport.findings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedAuditReport.findings.map((finding: any, index: number) => (
                      <div key={finding.id || index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{finding.title || `Finding ${index + 1}`}</h4>
                          <Badge className={getComplexityColor(finding.severity || finding.finding_category)}>
                            {finding.severity || finding.finding_category}
                          </Badge>
                        </div>
                        
                        {finding.description && (
                          <p className="text-sm text-muted-foreground">{finding.description}</p>
                        )}
                        
                        {finding.recommendation && (
                          <div>
                            <Label className="text-sm font-medium">Recommendation</Label>
                            <p className="text-sm">{finding.recommendation}</p>
                          </div>
                        )}
                        
                        {finding.external_references && (
                          <div>
                            <Label className="text-sm font-medium">References</Label>
                            <p className="text-sm font-mono text-xs">{finding.external_references}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {selectedAuditReport.verification.verified ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-semibold">Overall Verified</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedAuditReport.verification.verified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {selectedAuditReport.verification.blockchainVerified ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-semibold">Blockchain Verified</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedAuditReport.verification.blockchainVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {selectedAuditReport.verification.ipfsVerified ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-semibold">IPFS Verified</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedAuditReport.verification.ipfsVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-sm font-medium">Verified At</Label>
                    <p className="text-sm">{new Date(selectedAuditReport.verification.verifiedAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
