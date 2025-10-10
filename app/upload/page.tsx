"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Github,
  Shield,
  CheckCircle,
  Info,
  ArrowRight,
  Loader2,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  Sparkles,
  Edit3,
  ExternalLink,
  Tag,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { validateGitHubUrl } from "@/lib/github-service"
import { calculatePayment } from "@/lib/payment-service"
import { MintResultDisplay } from "@/components/MintResultDisplay"

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [nftConfirmation, setNftConfirmation] = useState<any>(null)
  const [contractResult, setContractResult] = useState<any>(null)
  const [showMintResult, setShowMintResult] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Form state
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [githubError, setGithubError] = useState("")

  // AI Estimation state
  const [aiEstimation, setAiEstimation] = useState<any>(null)
  const [repoAnalysis, setRepoAnalysis] = useState<any>(null)

  const [projectTags, setProjectTags] = useState<string[]>([])

  // User negotiation state
  const [userPrice, setUserPrice] = useState("")
  const [userDuration, setUserDuration] = useState("")

  const [auditorMembers, setAuditorMembers] = useState(1)
  const [acceptNDA, setAcceptNDA] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleGithubUrlChange = (value: string) => {
    setGithubUrl(value)
    setGithubError("")
    setAiEstimation(null)
    setRepoAnalysis(null)
    setProjectTags([])
  }

  const handleAnalyzeRepo = async () => {
    const validation = validateGitHubUrl(githubUrl)
    if (!validation.valid) {
      setGithubError(validation.error || "Invalid URL")
      return
    }

    setIsAnalyzing(true)
    setGithubError("")

    try {
      const response = await fetch("/api/estimate-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze repository")
      }

      console.log("[v0] AI estimation received:", data.estimation)
      setAiEstimation(data.estimation)
      setRepoAnalysis(data.repoAnalysis)

      const tags = generateTags(data.repoAnalysis, data.estimation)
      setProjectTags(tags)

      // Set default user negotiation to AI estimation
      setUserPrice(data.estimation.price.toString())
      setUserDuration(data.estimation.durationDays.toString())
    } catch (error: any) {
      console.error("[v0] Error analyzing repository:", error)
      setGithubError(error.message || "Failed to analyze repository")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateTags = (repoAnalysis: any, aiEstimation: any): string[] => {
    const tags: string[] = []
    tags.push(`complexity-${aiEstimation.complexity.toLowerCase()}`)

    if (repoAnalysis.solidityFiles > 10) {
      tags.push("large-codebase")
    } else if (repoAnalysis.solidityFiles > 5) {
      tags.push("medium-codebase")
    } else {
      tags.push("small-codebase")
    }

    if (repoAnalysis.totalLines > 5000) {
      tags.push("extensive-code")
    } else if (repoAnalysis.totalLines > 1000) {
      tags.push("moderate-code")
    }

    if (aiEstimation.riskFactors && aiEstimation.riskFactors.length > 0) {
      tags.push("high-risk")
    }

    if (aiEstimation.durationDays > 14) {
      tags.push("long-term")
    } else if (aiEstimation.durationDays > 7) {
      tags.push("medium-term")
    } else {
      tags.push("short-term")
    }

    return tags
  }

  const handleSubmit = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for initial payment
      setUploadProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate progress for fetching repository
      setUploadProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Submit audit request with NFT minting
      setUploadProgress(40)
      const response = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          projectDescription,
          githubUrl,
          complexity: aiEstimation.complexity,
          estimatedDuration: Number.parseInt(userDuration),
          proposedPrice: Number.parseFloat(userPrice),
          auditorCount: auditorMembers,
          developerWallet: walletAddress,
          repoAnalysis,
          aiEstimation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit audit")
      }

      console.log("[v0] Audit submitted successfully:", data)

      // Simulate progress for blockchain anchoring
      setUploadProgress(70)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Set contract result and show mint result
      setContractResult(data.contracts)
      setNftConfirmation(data.contracts.nftMint)

      // Complete progress
      setUploadProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show mint result instead of redirecting immediately
      setShowMintResult(true)
      setIsUploading(false)
    } catch (error: any) {
      console.error("[v0] Error submitting audit:", error)
      alert(error.message || "Failed to submit audit")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "completed"
    if (stepNumber === step) return "current"
    return "upcoming"
  }

  const canProceedToStep2 = projectName && projectDescription && githubUrl && aiEstimation
  const canProceedToStep3 = userPrice && userDuration && auditorMembers >= 1
  const canSubmit = acceptNDA && acceptTerms && walletAddress

  const paymentDetails = aiEstimation
    ? calculatePayment(Number.parseFloat(userPrice || aiEstimation.price), auditorMembers)
    : null

  // Show mint result if available
  if (showMintResult && contractResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <MintResultDisplay
          tokenContract={contractResult.tokenContract}
          nftContract={contractResult.nftContract}
          nftMint={contractResult.nftMint}
          onContinue={() => router.push("/dashboard")}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Submit Smart Contract for Audit</h1>
          <p className="text-muted-foreground">Connect your GitHub repository for AI-powered audit estimation</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    getStepStatus(stepNumber) === "completed"
                      ? "bg-success text-success-foreground"
                      : getStepStatus(stepNumber) === "current"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getStepStatus(stepNumber) === "completed" ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      getStepStatus(stepNumber) === "completed" ? "bg-success" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Project Details & GitHub Repository */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="w-5 h-5 mr-2" />
                Project Details & GitHub Repository
              </CardTitle>
              <CardDescription>Provide your project information and GitHub repository link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., DeFi Token Contract"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Brief description of your smart contract project..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>GitHub Repository</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => handleGithubUrlChange(e.target.value)}
                      className={githubError ? "border-destructive" : ""}
                    />
                    <Button
                      onClick={handleAnalyzeRepo}
                      disabled={!githubUrl || isAnalyzing}
                      className="whitespace-nowrap"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </div>

                  {githubError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {githubError}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    <Info className="w-3 h-3 inline mr-1" />
                    We'll analyze your Solidity smart contracts and provide an AI-powered audit estimation
                  </p>
                </div>

                {/* AI Analysis Results */}
                {aiEstimation && repoAnalysis && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Sparkles className="w-5 h-5" />
                      AI Analysis Complete
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Complexity</div>
                        <Badge variant="outline" className="mt-1">
                          {aiEstimation.complexity}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Solidity Files</div>
                        <div className="font-semibold">{repoAnalysis.solidityFiles}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Lines of Code</div>
                        <div className="font-semibold">{repoAnalysis.totalLines.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Est. Duration</div>
                        <div className="font-semibold">{aiEstimation.duration}</div>
                      </div>
                    </div>

                    {projectTags.length > 0 && (
                      <div className="pt-2 border-t border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Project Tags:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {projectTags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-primary/20">
                      <div className="text-sm text-muted-foreground mb-2">AI Reasoning:</div>
                      <p className="text-sm">{aiEstimation.reasoning}</p>
                    </div>

                    {aiEstimation.riskFactors.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">Risk Factors:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {aiEstimation.riskFactors.map((risk: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
                  Next: Audit Package
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Audit Package Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Audit Package</CardTitle>
                <CardDescription>Review AI estimation and adjust your proposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Estimation */}
                  <div className="border-2 border-primary/30 rounded-lg p-6 bg-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Platform Estimation</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Complexity Level</div>
                        <Badge variant="default" className="mt-1">
                          {aiEstimation?.complexity}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Duration</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold">{aiEstimation?.duration}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Recommended Price</div>
                        <div className="flex items-center gap-2 mt-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-2xl">${aiEstimation?.price}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-sm text-muted-foreground mb-2">Minimum Price</div>
                        <div className="text-sm font-medium">${aiEstimation?.minimumPrice}</div>
                      </div>

                      {aiEstimation?.recommendations && aiEstimation.recommendations.length > 0 && (
                        <div className="pt-3 border-t">
                          <div className="text-sm font-medium mb-2">Recommendations:</div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {aiEstimation.recommendations.map((rec: string, idx: number) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-success" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Negotiation */}
                  <div className="border-2 border-border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Edit3 className="w-5 h-5" />
                      <h3 className="font-semibold text-lg">Your Proposal</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="userPrice">Your Proposed Price (USD)</Label>
                        <Input
                          id="userPrice"
                          type="number"
                          min={aiEstimation?.minimumPrice}
                          value={userPrice}
                          onChange={(e) => setUserPrice(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Minimum: ${aiEstimation?.minimumPrice}</p>
                      </div>

                      <div>
                        <Label htmlFor="userDuration">Your Proposed Duration (days)</Label>
                        <Input
                          id="userDuration"
                          type="number"
                          min="1"
                          value={userDuration}
                          onChange={(e) => setUserDuration(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">Price Validation</div>
                        {Number.parseFloat(userPrice) < (aiEstimation?.minimumPrice || 0) ? (
                          <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Price below minimum threshold
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-success text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Price acceptable
                          </div>
                        )}
                      </div>

                      <div className="bg-primary/5 rounded-lg p-3 text-sm">
                        <Info className="w-4 h-4 inline mr-1" />
                        Your proposal will be reviewed by the platform. Final pricing will be negotiated between you and
                        the auditor.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auditor Members</CardTitle>
                <CardDescription>
                  Select how many auditors should review your contract for consensus validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((count) => (
                      <div
                        key={count}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          auditorMembers === count
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setAuditorMembers(count)}
                      >
                        <div className="text-center">
                          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold mb-2">{count}</div>
                          <div className="text-sm font-medium mb-1">
                            {count === 1 ? "Single Auditor" : `${count} Auditors`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {count === 1 && "Faster turnaround, single perspective"}
                            {count === 2 && "Balanced approach, dual validation"}
                            {count === 3 && "Maximum consensus, triple validation"}
                          </div>
                          {count > 1 && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                +{(count - 1) * 25}% fee
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      <Info className="w-4 h-4 inline mr-1" />
                      Multiple auditors provide consensus validation and reduce false positives, but increase cost and
                      time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3 || Number.parseFloat(userPrice) < (aiEstimation?.minimumPrice || 0)}
              >
                Next: Review & Submit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Review your submission and accept the terms to start the audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Wallet Connection
                </h3>
                <div className="space-y-3">
                  <Label htmlFor="walletAddress">Your Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    <Info className="w-3 h-3 inline mr-1" />
                    This wallet will receive the Audit Request NFT and be used for payments
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Submission Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Project:</span> {projectName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Repository:</span>{" "}
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub Link
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Complexity:</span> {aiEstimation?.complexity}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Solidity Files:</span> {repoAnalysis?.solidityFiles}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Proposed Duration:</span> {userDuration} days
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auditors:</span> {auditorMembers} member
                    {auditorMembers > 1 ? "s" : ""}
                  </div>
                </div>
                {projectTags.length > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {projectTags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {paymentDetails && (
                <div className="border-2 border-primary/30 rounded-lg p-4 bg-primary/5 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Payment Details
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Engagement (ERC-20):</span>
                      <span className="font-medium">${paymentDetails.initialEngagement.toFixed(6)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">• Paid now to secure your audit slot</div>

                    <div className="pt-2 border-t">
                      <div className="font-medium mb-2">After Platform-Auditor Negotiation:</div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auditor Payment:</span>
                        <span className="font-medium">${paymentDetails.auditorPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee (15%):</span>
                        <span className="font-medium">${paymentDetails.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base pt-2 border-t mt-2">
                        <span>Total Audit Cost:</span>
                        <span>${paymentDetails.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-background rounded p-2 text-xs">
                      <Info className="w-3 h-3 inline mr-1" />
                      You'll be notified of the final price after platform-auditor negotiation. Payment required before
                      audit begins.
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Audit Request NFT Certificate
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upon submission, you'll receive an ERC-721 Audit Request NFT on ApeChain containing:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Project name and GitHub repository hash</li>
                  <li>• Complexity level and project tags</li>
                  <li>• Proposed price and duration</li>
                  <li>• Auditor count and your wallet address</li>
                  <li>• Timestamp and immutable proof on blockchain</li>
                </ul>
                <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                  <strong>Status:</strong> Available - This NFT acts as a digital job posting for auditors
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="nda"
                    checked={acceptNDA}
                    onCheckedChange={(checked) => setAcceptNDA(checked as boolean)}
                  />
                  <Label htmlFor="nda" className="text-sm leading-relaxed">
                    I agree to the Non-Disclosure Agreement (NDA) and understand that my code will be handled
                    confidentiality by verified auditors without revealing my identity
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I accept the Terms of Service and understand that audit results will be cryptographically verified
                    on ApeChain blockchain with complete anonymity preserved. I agree to the payment terms including the
                    initial engagement fee and final audit payment.
                  </Label>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing submission...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadProgress < 20 && "Processing initial payment..."}
                    {uploadProgress >= 20 && uploadProgress < 40 && "Fetching repository from GitHub..."}
                    {uploadProgress >= 40 && uploadProgress < 60 && "Minting Audit Request NFT..."}
                    {uploadProgress >= 60 && uploadProgress < 80 && "Anchoring on ApeChain..."}
                    {uploadProgress >= 80 && "Saving to database and matching auditors..."}
                  </div>
                </div>
              )}

              {nftConfirmation && (
                <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-success font-semibold mb-3">
                    <CheckCircle className="w-5 h-5" />
                    Audit Request NFT Minted Successfully!
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Token ID:</span>{" "}
                      <span className="font-mono font-semibold">#{nftConfirmation.tokenId}</span>
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
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} disabled={isUploading}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit for Audit
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
