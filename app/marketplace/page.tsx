"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Star,
  Shield,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Filter,
  MapPin,
  CheckCircle,
  Eye,
  MessageCircle,
} from "lucide-react"

// Mock auditor data
const mockAuditors = [
  {
    id: "1",
    name: "SecureAudit Labs",
    avatar: "/security-lab.jpg",
    rating: 4.9,
    totalAudits: 127,
    specializations: ["DeFi", "NFT", "Governance"],
    hourlyRate: 150,
    availability: "Available",
    location: "Global",
    responseTime: "< 2 hours",
    successRate: 98.5,
    stakedTokens: 50000,
    verificationLevel: "Premium",
    recentProjects: ["Uniswap V4", "Compound III", "Aave V3"],
    bio: "Leading security firm specializing in DeFi protocols with 5+ years of experience.",
    languages: ["English", "Mandarin"],
    timezone: "UTC+0",
  },
  {
    id: "2",
    name: "BlockSec Auditors",
    avatar: "/blockchain-security.jpg",
    rating: 4.8,
    totalAudits: 89,
    specializations: ["Smart Contracts", "Layer 2", "Cross-chain"],
    hourlyRate: 120,
    availability: "Busy",
    location: "North America",
    responseTime: "< 4 hours",
    successRate: 96.2,
    stakedTokens: 35000,
    verificationLevel: "Verified",
    recentProjects: ["Polygon zkEVM", "Arbitrum Nova", "Optimism Bedrock"],
    bio: "Specialized in Layer 2 solutions and cross-chain bridge security audits.",
    languages: ["English", "Spanish"],
    timezone: "UTC-5",
  },
  {
    id: "3",
    name: "CryptoGuard Security",
    avatar: "/crypto-guard.jpg",
    rating: 4.7,
    totalAudits: 156,
    specializations: ["NFT", "Gaming", "Metaverse"],
    hourlyRate: 100,
    availability: "Available",
    location: "Europe",
    responseTime: "< 1 hour",
    successRate: 94.8,
    stakedTokens: 25000,
    verificationLevel: "Verified",
    recentProjects: ["Axie Infinity", "The Sandbox", "Decentraland"],
    bio: "Gaming and NFT security experts with deep understanding of tokenomics.",
    languages: ["English", "German", "French"],
    timezone: "UTC+1",
  },
  {
    id: "4",
    name: "ZK Security Solutions",
    avatar: "/zero-knowledge.jpg",
    rating: 5.0,
    totalAudits: 43,
    specializations: ["Zero-Knowledge", "Privacy", "Cryptography"],
    hourlyRate: 200,
    availability: "Limited",
    location: "Global",
    responseTime: "< 6 hours",
    successRate: 100,
    stakedTokens: 75000,
    verificationLevel: "Premium",
    recentProjects: ["Zcash Orchard", "Tornado Cash", "Aztec Network"],
    bio: "Cutting-edge zero-knowledge proof and privacy protocol specialists.",
    languages: ["English", "Japanese"],
    timezone: "UTC+9",
  },
]

// Mock active jobs
const mockActiveJobs = [
  {
    id: "1",
    title: "DeFi Lending Protocol Audit",
    description: "Comprehensive audit of a new lending protocol with flash loan capabilities",
    budget: "$5,000 - $8,000",
    deadline: "2024-02-15",
    complexity: "High",
    package: "Deep",
    specializations: ["DeFi", "Flash Loans"],
    bids: 7,
    status: "Open",
    postedBy: "DeFi Innovations",
    postedDate: "2024-01-20",
  },
  {
    id: "2",
    title: "NFT Marketplace Security Review",
    description: "Security audit for NFT marketplace with royalty management and auction features",
    budget: "$2,000 - $3,500",
    deadline: "2024-02-10",
    complexity: "Medium",
    package: "Standard",
    specializations: ["NFT", "Marketplace"],
    bids: 12,
    status: "Open",
    postedBy: "NFT Creators",
    postedDate: "2024-01-18",
  },
  {
    id: "3",
    title: "Cross-chain Bridge Audit",
    description: "Critical security review of cross-chain bridge protocol",
    budget: "$10,000 - $15,000",
    deadline: "2024-03-01",
    complexity: "Critical",
    package: "Deep",
    specializations: ["Cross-chain", "Bridge"],
    bids: 4,
    status: "Open",
    postedBy: "Bridge Protocol",
    postedDate: "2024-01-22",
  },
]

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("auditors")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("All")
  const [selectedAuditor, setSelectedAuditor] = useState<string | null>(null)

  const specializations = ["All", "DeFi", "NFT", "Gaming", "Layer 2", "Cross-chain", "Zero-Knowledge", "Governance"]

  const filteredAuditors = mockAuditors.filter((auditor) => {
    const matchesSearch =
      auditor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auditor.specializations.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSpecialization =
      selectedSpecialization === "All" || auditor.specializations.includes(selectedSpecialization)
    return matchesSearch && matchesSpecialization
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-success/20 text-success border-success/30"
      case "Busy":
        return "bg-warning/20 text-warning border-warning/30"
      case "Limited":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Audit Marketplace</h1>
          <p className="text-muted-foreground">Connect with verified auditors and discover audit opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auditors</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
              <Shield className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">23 posted today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">Auditor response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.8%</div>
              <p className="text-xs text-muted-foreground">Project completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search auditors, specializations, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="auditors">Find Auditors</TabsTrigger>
            <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
            <TabsTrigger value="matching">AI Matching</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="auditors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAuditors.map((auditor) => (
                <Card key={auditor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={auditor.avatar || "/placeholder.svg"} alt={auditor.name} />
                          <AvatarFallback>{auditor.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{auditor.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-warning mr-1" />
                              <span className="text-sm font-medium">{auditor.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {auditor.totalAudits} audits
                            </Badge>
                            <Badge
                              className={
                                auditor.verificationLevel === "Premium"
                                  ? "bg-primary/20 text-primary border-primary/30"
                                  : "bg-success/20 text-success border-success/30"
                              }
                            >
                              {auditor.verificationLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className={getAvailabilityColor(auditor.availability)}>{auditor.availability}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{auditor.bio}</p>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {auditor.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>${auditor.hourlyRate}/hour</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>{auditor.responseTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>{auditor.location}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>{auditor.successRate}% success</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Shield className="w-4 h-4 mr-1" />
                          <span>{auditor.stakedTokens.toLocaleString()} PROOF staked</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedAuditor(auditor.id)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                          <Button size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="space-y-4">
              {mockActiveJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="mt-1">{job.description}</CardDescription>
                      </div>
                      <Badge className={getComplexityColor(job.complexity)}>{job.complexity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {job.specializations.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>{job.budget}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>Due {job.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>{job.package} Audit</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-muted-foreground mr-1" />
                          <span>{job.bids} bids</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          Posted by {job.postedBy} on {job.postedDate}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm">Submit Bid</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Auditor Matching</CardTitle>
                <CardDescription>
                  Get personalized auditor recommendations based on your project requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Project Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Contract Complexity:</span>
                            <Badge variant="outline">High</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Security Risk Level:</span>
                            <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">Medium-High</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Duration:</span>
                            <span>7-10 days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recommended Package:</span>
                            <Badge variant="outline">Deep Audit</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Matching Criteria</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Required Specializations:</span>
                            <span>DeFi, Flash Loans</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Minimum Rating:</span>
                            <span>4.5+ stars</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Budget Range:</span>
                            <span>$5,000 - $8,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Availability:</span>
                            <span>Within 48 hours</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Top Matches</h3>
                    <div className="space-y-3">
                      {mockAuditors.slice(0, 3).map((auditor, index) => (
                        <div
                          key={auditor.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                            </div>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={auditor.avatar || "/placeholder.svg"} alt={auditor.name} />
                              <AvatarFallback>{auditor.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{auditor.name}</div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Star className="w-3 h-3 text-warning" />
                                <span>{auditor.rating}</span>
                                <span>•</span>
                                <span>{auditor.totalAudits} audits</span>
                                <span>•</span>
                                <span>${auditor.hourlyRate}/hr</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-success/20 text-success border-success/30">
                              {95 - index * 3}% match
                            </Badge>
                            <Button size="sm">Contact</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auditor Leaderboard</CardTitle>
                <CardDescription>Top-performing auditors ranked by reputation and verified audits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAuditors
                    .sort((a, b) => b.rating * b.totalAudits - a.rating * a.totalAudits)
                    .map((auditor, index) => (
                      <div
                        key={auditor.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 flex items-center justify-center">
                            {index < 3 ? (
                              <Award
                                className={`w-6 h-6 ${
                                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-600"
                                }`}
                              />
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                            )}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={auditor.avatar || "/placeholder.svg"} alt={auditor.name} />
                            <AvatarFallback>{auditor.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{auditor.name}</div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-warning mr-1" />
                                <span>{auditor.rating}</span>
                              </div>
                              <span>{auditor.totalAudits} audits</span>
                              <span>{auditor.successRate}% success</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{auditor.stakedTokens.toLocaleString()} PROOF</div>
                          <div className="text-sm text-muted-foreground">Staked</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Auditor Modal/Details */}
        {selectedAuditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Auditor Profile</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAuditor(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const auditor = mockAuditors.find((a) => a.id === selectedAuditor)
                  if (!auditor) return null

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={auditor.avatar || "/placeholder.svg"} alt={auditor.name} />
                          <AvatarFallback>{auditor.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-bold">{auditor.name}</h2>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-warning mr-1" />
                              <span>{auditor.rating}</span>
                            </div>
                            <Badge variant="outline">{auditor.totalAudits} audits</Badge>
                            <Badge className={getAvailabilityColor(auditor.availability)}>{auditor.availability}</Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground">{auditor.bio}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3">Specializations</h3>
                          <div className="flex flex-wrap gap-2">
                            {auditor.specializations.map((spec) => (
                              <Badge key={spec} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Recent Projects</h3>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {auditor.recentProjects.map((project, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-success mr-2" />
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Hourly Rate</div>
                          <div className="text-muted-foreground">${auditor.hourlyRate}/hour</div>
                        </div>
                        <div>
                          <div className="font-medium">Response Time</div>
                          <div className="text-muted-foreground">{auditor.responseTime}</div>
                        </div>
                        <div>
                          <div className="font-medium">Success Rate</div>
                          <div className="text-muted-foreground">{auditor.successRate}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Timezone</div>
                          <div className="text-muted-foreground">{auditor.timezone}</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
