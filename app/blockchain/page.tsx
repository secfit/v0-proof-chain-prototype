"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Wallet, Link, Shield, Activity, CheckCircle, Clock, AlertCircle, Copy, Zap } from "lucide-react"

export default function BlockchainPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [networkStatus, setNetworkStatus] = useState("connected")

  // Mock wallet connection
  const connectWallet = async () => {
    setIsConnected(true)
    setWalletAddress("0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4")
    setBalance("1,247.83")
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setBalance("0")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
  }

  // Mock blockchain data
  const recentTransactions = [
    {
      id: "0x8f2a...b4c1",
      type: "Audit Verification",
      status: "confirmed",
      timestamp: "2 minutes ago",
      gasUsed: "0.0023 APE",
      project: "DeFi Protocol v2.1",
    },
    {
      id: "0x7e1b...a3d2",
      type: "Proof Anchoring",
      status: "confirmed",
      timestamp: "15 minutes ago",
      gasUsed: "0.0018 APE",
      project: "NFT Marketplace",
    },
    {
      id: "0x6d0c...92e3",
      type: "Escrow Release",
      status: "pending",
      timestamp: "1 hour ago",
      gasUsed: "0.0031 APE",
      project: "Gaming Contract",
    },
  ]

  const smartContracts = [
    {
      name: "ProofChain Core",
      address: "0x1234...5678",
      version: "v1.2.0",
      status: "active",
      verifications: 1247,
    },
    {
      name: "ZKP Verifier",
      address: "0x9abc...def0",
      version: "v2.1.0",
      status: "active",
      verifications: 892,
    },
    {
      name: "Escrow Manager",
      address: "0x5678...9abc",
      version: "v1.0.3",
      status: "active",
      verifications: 634,
    },
  ]

  const networkStats = {
    blockHeight: 2847392,
    avgBlockTime: "2.1s",
    totalVerifications: 12847,
    activeAuditors: 156,
    totalValueLocked: "2.4M APE",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Blockchain Integration</h1>
          <p className="text-muted-foreground">
            Connect to ApeChain network and monitor on-chain verification activities
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
            <CardDescription>Connect your wallet to interact with ProofChain smart contracts</CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6">Connect to ApeChain network to access blockchain features</p>
                <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Connected to ApeChain</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{walletAddress}</span>
                      <Button variant="ghost" size="sm" onClick={copyAddress}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{balance} APE</div>
                    <Button variant="outline" size="sm" onClick={disconnectWallet}>
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="network">Network Status</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Your recent blockchain interactions on ApeChain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {tx.status === "confirmed" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : tx.status === "pending" ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Badge variant={tx.status === "confirmed" ? "default" : "secondary"}>{tx.status}</Badge>
                        </div>
                        <div>
                          <div className="font-medium">{tx.type}</div>
                          <div className="text-sm text-muted-foreground">{tx.project}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">{tx.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.gasUsed} • {tx.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Smart Contracts
                </CardTitle>
                <CardDescription>ProofChain smart contracts deployed on ApeChain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartContracts.map((contract) => (
                    <div key={contract.address} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{contract.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{contract.address}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{contract.version}</Badge>
                          <Badge variant="default">{contract.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contract.verifications.toLocaleString()} verifications
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>ApeChain Mainnet</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Block Height</span>
                    <span className="font-mono">{networkStats.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Block Time</span>
                    <span>{networkStats.avgBlockTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gas Price</span>
                    <span>12 gwei</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    ProofChain Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Verifications</span>
                    <span className="font-semibold">{networkStats.totalVerifications.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Auditors</span>
                    <span className="font-semibold">{networkStats.activeAuditors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Value Locked</span>
                    <span className="font-semibold">{networkStats.totalValueLocked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Network Health</span>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Volume</CardTitle>
                  <CardDescription>Daily verification activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today</span>
                      <span className="font-semibold">247 verifications</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>85% of daily target</span>
                      <span>+12% vs yesterday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gas Usage</CardTitle>
                  <CardDescription>Network efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Gas per Verification</span>
                      <span className="font-semibold">0.0021 APE</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>65% below network average</span>
                      <span>Optimized circuits</span>
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
