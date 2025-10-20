"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Upload,
  Search,
  FileCheck,
  Users,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle,
  Eye,
  Coins,
  Network,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Target,
  Workflow,
  Database,
  Hexagon,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "architecture", label: "Architecture", icon: Database },
    { id: "workflow", label: "Workflow", icon: Workflow },
    { id: "components", label: "Components", icon: Target },
    { id: "intersections", label: "Intersections", icon: Network },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
              <HelpCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">ProofChain Help Center</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete guide to understanding ProofChain's privacy-first smart contract auditing marketplace
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                <section.icon className="w-4 h-4" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-primary" />
                  ProofChain Global Concept
                </CardTitle>
                <CardDescription className="text-lg">
                  The world's first privacy-preserving smart contract auditing marketplace powered by Zero-Knowledge
                  Proofs, NFTs, and IPFS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Core Innovation
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Complete Anonymity:</strong> Developers and auditors never know each other's identity
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>IP Protection:</strong> AI-powered sanitization and obfuscation protects code secrets
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>NFT Audit Trail:</strong> Three linked NFTs (Request, Owner, Result) create immutable
                          proof of audit lifecycle
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>IPFS Evidence Storage:</strong> Decentralized storage ensures audit evidence is
                          permanent and tamper-proof
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Blockchain Anchoring:</strong> Immutable audit records on ApeChain with cryptographic
                          verification
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>For Developers:</strong> Secure audits without exposing proprietary code, with NFT
                          proof of audit request
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>For Auditors:</strong> Access to quality projects with fair compensation and NFT
                          ownership certificates
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>For Investors:</strong> Verifiable audit quality through cryptographic proofs and
                          on-chain NFT verification
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>For Ecosystem:</strong> Higher security standards with permanent, decentralized audit
                          records
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-accent/10 to-success/10 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Hexagon className="w-8 h-8 text-accent" />
                  NFT & IPFS Technology Stack
                </CardTitle>
                <CardDescription className="text-lg">
                  Three-tier NFT system with decentralized evidence storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Upload className="w-5 h-5 text-primary" />
                        Audit Request NFT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Minted when:</strong> Developer submits contract for audit
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Contains:</strong> Project metadata, complexity, proposed price, GitHub hash, tags
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Status:</strong> Available - Acts as digital job posting
                      </p>
                      <Badge variant="outline" className="mt-2">
                        ERC-721 on ApeChain
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/5 border-accent/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="w-5 h-5 text-accent" />
                        Audit Owner NFT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Current behavior:</strong> No minting on acceptance; status changes to "In Progress"
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Planned contents:</strong> Auditor details, accepted price, timeline, ref to Request NFT
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Status:</strong> Planned (not minted in current release)
                      </p>
                      <Badge variant="outline" className="mt-2">
                        Planned ERC-721 on ApeChain
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-success/5 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileCheck className="w-5 h-5 text-success" />
                        Audit Result NFT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Minted when:</strong> Auditor submits audit results (client-side wallet minting)
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Contains:</strong> IPFS hash (metadata), findings summary, vulnerabilities, links
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Status:</strong> Completed - Immutable audit proof
                      </p>
                      <Badge variant="outline" className="mt-2">
                        ERC-721 on ApeChain
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Database className="w-5 h-5" />
                      IPFS Evidence Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Stored on IPFS:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Complete audit findings and recommendations</li>
                          <li>• Vulnerability assessment details</li>
                          <li>• Static analysis reports (Slither, Mythril)</li>
                          <li>• Auditor notes and evidence files</li>
                          <li>• Cryptographic signatures and timestamps</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Permanent, tamper-proof storage</li>
                          <li>• Decentralized - no single point of failure</li>
                          <li>• Content-addressed - verifiable integrity</li>
                          <li>• Linked to Result NFT via IPFS hash</li>
                          <li>• Accessible for verification anytime</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    Problem Solved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Traditional auditing exposes sensitive code to auditors, creating IP theft risks and limiting
                    participation from companies with proprietary algorithms.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Our Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI sanitization + ZKP verification creates a trustless environment where audit quality is
                    cryptographically proven without revealing code details.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-success" />
                    Market Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enables enterprise adoption of DeFi by providing institutional-grade security auditing with complete
                    confidentiality guarantees.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-8">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Database className="w-8 h-8 text-primary" />
                  System Architecture Overview
                </CardTitle>
                <CardDescription className="text-lg">
                  Modern web3 stack with privacy-first design and comprehensive blockchain integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Network className="w-5 h-5 text-primary" />
                      Technology Stack
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Frontend:</strong> Next.js 14, React 18, TypeScript, Tailwind CSS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Database:</strong> Supabase (PostgreSQL) with Row Level Security</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Blockchain:</strong> ApeChain testnet, Thirdweb SDK (client), Ethers.js</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Smart Contracts:</strong> Solidity, OpenZeppelin libraries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Storage:</strong> IPFS via Thirdweb storage (no Pinata)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>AI:</strong> OpenAI GPT-4 for intelligent analysis</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-accent" />
                      Core Principles
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Privacy-First:</strong> Complete anonymity for all participants</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Decentralized:</strong> Built on blockchain with IPFS storage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Transparent:</strong> All interactions verifiable on-chain</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Scalable:</strong> Modern architecture supporting high throughput</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Secure:</strong> Multiple layers of security and verification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Database Layer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Supabase PostgreSQL</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Audit requests and metadata</li>
                      <li>• Smart contract information</li>
                      <li>• NFT and IPFS data tracking</li>
                      <li>• Developer profiles and stats</li>
                      <li>• Row Level Security (RLS)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-accent" />
                    Blockchain Layer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">ApeChain Integration</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Audit Result NFT (ERC-721) minted on submission</li>
                      <li>• Immutable audit records on ApeChain testnet</li>
                      <li>• Cryptographic verification and explorer links</li>
                      <li>• Thirdweb SDK integration (client-side mint)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-success/5 border-success/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hexagon className="w-5 h-5 text-success" />
                    Storage Layer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">IPFS Network</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Audit reports and findings</li>
                      <li>• NFT metadata storage</li>
                      <li>• Repository snapshots</li>
                      <li>• Verification proofs</li>
                      <li>• Decentralized access</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-accent/10 to-success/10 border-accent/20">
                  <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Workflow className="w-8 h-8 text-accent" />
                  API Architecture & Key Endpoints
                </CardTitle>
                <CardDescription className="text-lg">
                  RESTful API design with comprehensive service layer integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" />
                      Core API Endpoints
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>POST /api/submit-audit:</strong> Create new audit request (Request NFT client-side)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>GET /api/dashboard-supabase:</strong> Fetch dashboard data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>POST /api/estimate-audit:</strong> AI-powered estimation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>POST /api/accept-audit:</strong> Accept audit request (no NFT mint on accept)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>POST /api/submit-audit-results:</strong> Save results + client-minted NFT data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>GET /api/audit-results/[id]:</strong> Latest result by audit_request_id</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>POST /api/verify-audit:</strong> Verify by audit_request_id (uses ipfs_hash)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-success" />
                      Service Layer
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>SupabaseAuditService:</strong> Database operations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>ThirdwebContractService:</strong> Blockchain interactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>EnhancedGPTService:</strong> AI-powered analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>StorageService:</strong> Thirdweb IPFS storage (no Pinata)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-warning/10 to-primary/10 border-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-warning" />
                  Security Architecture
                </CardTitle>
                <CardDescription className="text-lg">
                  Multi-layer security with privacy-preserving design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-warning" />
                      Privacy Protection
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>AI Sanitization:</strong> Automatic code obfuscation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Anonymization:</strong> No identity exposure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>ZKP Verification:</strong> Cryptographic proofs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>IPFS Encryption:</strong> Secure file storage</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Access Control
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Row Level Security:</strong> Database access control</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Wallet Authentication:</strong> Thirdweb integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Smart Contract Security:</strong> OpenZeppelin standards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Rate Limiting:</strong> API protection</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Complete ProofChain Workflow</CardTitle>
                <CardDescription>
                  Step-by-step process from contract upload to verified audit badge with NFT trail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Developer Flow */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Developer Journey
                    </h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-primary-foreground font-bold text-sm">1</span>
                            </div>
                            <h4 className="font-semibold mb-1">Upload Contract</h4>
                            <p className="text-xs text-muted-foreground">
                              Submit smart contract with AI sanitization options
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Request NFT Minted
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/5 border-accent/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-accent-foreground font-bold text-sm">2</span>
                            </div>
                            <h4 className="font-semibold mb-1">Select Package</h4>
                            <p className="text-xs text-muted-foreground">
                              Choose audit depth and number of auditors ($50-$110)
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Saved to Airtable
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-warning/5 border-warning/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-warning-foreground font-bold text-sm">3</span>
                            </div>
                            <h4 className="font-semibold mb-1">Track Progress</h4>
                            <p className="text-xs text-muted-foreground">Monitor audit status through dashboard</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Status: In Progress
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-success/5 border-success/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-success-foreground font-bold text-sm">4</span>
                            </div>
                            <h4 className="font-semibold mb-1">Receive Badge</h4>
                            <p className="text-xs text-muted-foreground">Get verified audit badge with ZKP</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Result NFT + IPFS
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Auditor Flow */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Search className="w-5 h-5 text-accent" />
                      Auditor Journey
                    </h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-primary-foreground font-bold text-sm">1</span>
                            </div>
                            <h4 className="font-semibold mb-1">Browse Jobs</h4>
                            <p className="text-xs text-muted-foreground">
                              View anonymized contracts available for audit
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              View Request NFTs
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/5 border-accent/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-accent-foreground font-bold text-sm">2</span>
                            </div>
                            <h4 className="font-semibold mb-1">Accept Job</h4>
                            <p className="text-xs text-muted-foreground">Accept audit and receive ownership NFT</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Owner NFT Minted
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-warning/5 border-warning/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-warning-foreground font-bold text-sm">3</span>
                            </div>
                            <h4 className="font-semibold mb-1">Conduct Audit</h4>
                            <p className="text-xs text-muted-foreground">
                              Review sanitized code for 13 vulnerability types
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Evidence Collected
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-success/5 border-success/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-success-foreground font-bold text-sm">4</span>
                            </div>
                            <h4 className="font-semibold mb-1">Submit Proof</h4>
                            <p className="text-xs text-muted-foreground">Upload to IPFS and mint Result NFT</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Client-side Mint
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* System Flow */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-success" />
                      System Processing
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                              <Zap className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <h4 className="font-semibold mb-1">AI Processing</h4>
                            <p className="text-xs text-muted-foreground">
                              Sanitization, matching, and price optimization
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/5 border-accent/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                              <Database className="w-4 h-4 text-accent-foreground" />
                            </div>
                            <h4 className="font-semibold mb-1">IPFS Storage</h4>
                            <p className="text-xs text-muted-foreground">
                              Decentralized evidence and audit data storage (ipfs_hash used for verification fetch)
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-success/5 border-success/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                              <Network className="w-4 h-4 text-success-foreground" />
                            </div>
                            <h4 className="font-semibold mb-1">Blockchain Anchoring</h4>
                            <p className="text-xs text-muted-foreground">
                              NFT minting and immutable record on ApeChain
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Dashboard */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Dashboard
                  </CardTitle>
                  <CardDescription>Developer's central command center</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Purpose:</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides developers with a comprehensive overview of all their projects, audit statuses, and
                      verification badges.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Elements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Project overview cards with statistics</li>
                      <li>• Audit progress tracking with visual indicators</li>
                      <li>• Quick access to upload new projects</li>
                      <li>• Verification badge management</li>
                      <li>• Recent activity timeline</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Upload System */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent" />
                    Upload System
                  </CardTitle>
                  <CardDescription>Secure project submission workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Purpose:</h4>
                    <p className="text-sm text-muted-foreground">
                      Enables developers to securely submit smart contracts with AI-powered sanitization and audit
                      package selection.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Elements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drag-and-drop file upload interface</li>
                      <li>• AI sanitization and obfuscation options</li>
                      <li>• Three-tier audit packages ($50-$110)</li>
                      <li>• Auditor member selection (1-3 auditors)</li>
                      <li>• NDA and terms acceptance</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/upload">Try Upload</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Audits Interface */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-warning" />
                    Audits Interface
                  </CardTitle>
                  <CardDescription>Auditor's job management system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Purpose:</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides auditors with anonymized contract access, AI price negotiation, and structured
                      vulnerability assessment tools.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Elements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Anonymized contract listings</li>
                      <li>• AI-powered price negotiation</li>
                      <li>• 13 predefined vulnerability categories</li>
                      <li>• Secure audit workspace with countdown</li>
                      <li>• ZKP evidence generation tools</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/audits">View Audits</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Marketplace */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-success" />
                    Marketplace
                  </CardTitle>
                  <CardDescription>Auditor discovery and reputation system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Purpose:</h4>
                    <p className="text-sm text-muted-foreground">
                      Connects developers with qualified auditors through AI-powered matching, reputation tracking, and
                      transparent bidding.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Elements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Verified auditor profiles with ratings</li>
                      <li>• AI-powered matching recommendations</li>
                      <li>• Active job board with bidding</li>
                      <li>• Reputation and staking information</li>
                      <li>• Leaderboard and performance metrics</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Verification System */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-primary" />
                    Verification System
                  </CardTitle>
                  <CardDescription>ZKP proof validation and transparency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Purpose:</h4>
                    <p className="text-sm text-muted-foreground">
                      Enables anyone to verify audit proofs cryptographically without accessing sensitive contract
                      details.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Elements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Proof hash search and verification</li>
                      <li>• ZKP circuit library documentation</li>
                      <li>• Recent verification timeline</li>
                      <li>• Cryptographic proof details</li>
                      <li>• Public verification interface</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/verification">Try Verification</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Blockchain Integration */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-accent" />
                    Blockchain Integration
                  </CardTitle>
                  <CardDescription>ApeChain anchoring and wallet connectivity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Purpose:</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides immutable audit record storage, wallet connectivity, and on-chain verification
                      capabilities.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Elements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Wallet connection and management</li>
                      <li>• Transaction monitoring and history</li>
                      <li>• Smart contract interaction interface</li>
                      <li>• Network status and statistics</li>
                      <li>• Gas fee estimation and optimization</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/blockchain">View Blockchain</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Intersections Tab */}
          <TabsContent value="intersections" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">System Intersections & Data Flow</CardTitle>
                <CardDescription>
                  How all ProofChain components work together to create a seamless auditing ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Data Flow Diagram */}
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-center">Core Data Flow</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-2">
                        <Upload className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-medium">Upload</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mb-2">
                        <Zap className="w-8 h-8 text-accent-foreground" />
                      </div>
                      <span className="text-sm font-medium">AI Processing</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-warning rounded-lg flex items-center justify-center mb-2">
                        <Users className="w-8 h-8 text-warning-foreground" />
                      </div>
                      <span className="text-sm font-medium">Marketplace</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-success rounded-lg flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 text-success-foreground" />
                      </div>
                      <span className="text-sm font-medium">Audit</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-2">
                        <FileCheck className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-medium">Verification</span>
                    </div>
                  </div>
                </div>

                {/* Key Intersections */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        Privacy Layer Intersections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Upload ↔ AI Processing</h4>
                        <p className="text-xs text-muted-foreground">
                          Smart contracts are sanitized and obfuscated before any human interaction, ensuring IP
                          protection from the start.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Marketplace ↔ Audits</h4>
                        <p className="text-xs text-muted-foreground">
                          Auditors see only anonymized contract hashes and complexity metrics, never developer
                          identities or project names.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Audits ↔ Verification</h4>
                        <p className="text-xs text-muted-foreground">
                          ZKP generation ensures audit findings are cryptographically proven without revealing sensitive
                          audit details.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/5 border-accent/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-accent" />
                        Economic Layer Intersections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Upload ↔ Marketplace</h4>
                        <p className="text-xs text-muted-foreground">
                          Audit package pricing ($50-$110) and auditor member selection directly influence marketplace
                          matching algorithms.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Marketplace ↔ Blockchain</h4>
                        <p className="text-xs text-muted-foreground">
                          Auditor staking, reputation scores, and payment escrow are all managed through smart contracts
                          on ApeChain.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Dashboard ↔ All Systems</h4>
                        <p className="text-xs text-muted-foreground">
                          Real-time cost tracking, payment status, and ROI calculations aggregate data from all platform
                          components.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-success/5 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-success" />
                        Trust Layer Intersections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Verification ↔ Blockchain</h4>
                        <p className="text-xs text-muted-foreground">
                          Every ZKP verification is anchored on ApeChain, creating an immutable audit trail that can be
                          publicly verified.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Marketplace ↔ Verification</h4>
                        <p className="text-xs text-muted-foreground">
                          Auditor reputation scores are calculated based on verified audit quality and accuracy over
                          time.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Dashboard ↔ Verification</h4>
                        <p className="text-xs text-muted-foreground">
                          Developers receive verification badges that can be embedded in their projects as proof of
                          audit quality.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-warning/5 border-warning/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-warning" />
                        AI Layer Intersections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Upload ↔ Marketplace</h4>
                        <p className="text-xs text-muted-foreground">
                          AI analyzes contract complexity and automatically matches with auditors who have relevant
                          expertise and availability.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Audits ↔ Marketplace</h4>
                        <p className="text-xs text-muted-foreground">
                          AI-powered price negotiation ensures fair compensation while maintaining competitive market
                          rates.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">All Systems ↔ AI</h4>
                        <p className="text-xs text-muted-foreground">
                          Machine learning continuously improves matching accuracy, pricing optimization, and
                          vulnerability detection patterns.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary */}
                <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Complete System Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      ProofChain creates a <strong>trustless auditing ecosystem</strong> where developers can secure
                      their smart contracts without exposing proprietary code, auditors can access quality projects with
                      fair compensation, and investors can verify audit quality through cryptographic proofs. The
                      system's <strong>AI-powered privacy layer</strong> ensures complete anonymity between all parties,
                      while <strong>Zero-Knowledge Proofs</strong> provide mathematical certainty of audit integrity.{" "}
                      <strong>Blockchain anchoring</strong> on ApeChain creates an immutable record of all audits,
                      enabling a new standard of transparency and trust in smart contract security. Each component
                      reinforces the others, creating a <strong>network effect</strong> where increased participation
                      improves matching accuracy, pricing efficiency, and overall security standards across the entire
                      DeFi ecosystem.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Ready to Get Started?</CardTitle>
            <CardDescription>Choose your path in the ProofChain ecosystem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href="/upload">
                  <Upload className="w-6 h-6" />
                  <span>Upload Contract</span>
                  <span className="text-xs opacity-80">Start as Developer</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Link href="/marketplace">
                  <Users className="w-6 h-6" />
                  <span>Browse Auditors</span>
                  <span className="text-xs opacity-80">Find Experts</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Link href="/audits">
                  <Search className="w-6 h-6" />
                  <span>View Audits</span>
                  <span className="text-xs opacity-80">Start as Auditor</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
