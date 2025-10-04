import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Upload, Search, FileCheck } from "lucide-react"
import Link from "next/link"
import { VerifyProofButton } from "@/components/verify-proof-button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/20 text-primary border-primary/30">
            ZKP for Enterprise
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-bold text-balance mb-6">
            Privacy-first smart contract <span className="text-primary">auditing marketplace</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
            Secure your smart contracts with Zero-Knowledge Proof verification. Connect with qualified auditors while
            preserving your code's intellectual property.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <VerifyProofButton variant="outline" size="lg" />
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How ProofChain Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to get your smart contracts audited with cryptographic proof
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Upload & Sanitize</CardTitle>
                <CardDescription>
                  Upload your smart contracts with AI-powered sanitization to protect your IP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Automatic code sanitization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Optional obfuscation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Commitment hash anchoring
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Match & Audit</CardTitle>
                <CardDescription>Get matched with qualified auditors based on expertise and reputation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    AI-powered matching
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Reputation-based ranking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Secure audit workspace
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Verify & Badge</CardTitle>
                <CardDescription>Receive cryptographic proof of your audit results on ApeChain</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Zero-Knowledge Proofs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    On-chain verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Immutable audit badges
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Privacy Preserved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <div className="text-muted-foreground">Verified Auditors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">1000+</div>
              <div className="text-muted-foreground">Contracts Audited</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to secure your smart contracts?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join the future of smart contract security with cryptographic proof of audit quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">Start Your First Audit</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/marketplace">Browse Auditors</Link>
            </Button>
            <VerifyProofButton variant="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
