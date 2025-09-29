"use client"

import type React from "react"

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
import { Upload, FileCode, Shield, Eye, EyeOff, CheckCircle, Info, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const auditPackages = [
  {
    id: "quick",
    name: "Quick Audit",
    price: "$50",
    duration: "1-2 days",
    checks: ["Basic security patterns", "Common vulnerabilities", "Gas optimization"],
    description: "Essential security checks for simple contracts",
  },
  {
    id: "standard",
    name: "Standard Audit",
    price: "$75",
    duration: "3-5 days",
    checks: ["Comprehensive security analysis", "Business logic review", "Gas optimization", "Code quality assessment"],
    description: "Thorough audit for production-ready contracts",
  },
  {
    id: "deep",
    name: "Deep Audit",
    price: "$110",
    duration: "7-10 days",
    checks: [
      "Advanced security analysis",
      "Formal verification",
      "Economic model review",
      "Integration testing",
      "Documentation review",
    ],
    description: "Comprehensive audit for complex smart contracts",
  },
]

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Form state
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [auditorMembers, setAuditorMembers] = useState(1)
  const [enableSanitization, setEnableSanitization] = useState(true)
  const [enableObfuscation, setEnableObfuscation] = useState(false)
  const [acceptNDA, setAcceptNDA] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    setFiles(uploadedFiles)
  }

  const handleSubmit = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "completed"
    if (stepNumber === step) return "current"
    return "upcoming"
  }

  const canProceedToStep2 = projectName && projectDescription && files
  const canProceedToStep3 = selectedPackage && auditorMembers >= 1
  const canSubmit = acceptNDA && acceptTerms

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Smart Contract</h1>
          <p className="text-muted-foreground">Secure your smart contract with privacy-preserving ZKP auditing</p>
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

        {/* Step 1: Project Details & File Upload */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCode className="w-5 h-5 mr-2" />
                Project Details & File Upload
              </CardTitle>
              <CardDescription>Provide your project information and upload your smart contract files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Token Contract V1"
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
                <Label>Smart Contract Files</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Drag and drop your files here, or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports .sol, .zip, .tar.gz files up to 50MB</p>
                  </div>
                  <Input type="file" multiple accept=".sol,.zip,.tar.gz" onChange={handleFileUpload} className="mt-4" />
                </div>
                {files && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Files:</p>
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <FileCode className="w-4 h-4" />
                        <span>{file.name}</span>
                        <span>({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
                  Next: Privacy Settings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Privacy & Audit Package */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Configure how your code will be processed to protect your IP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sanitization"
                    checked={enableSanitization}
                    onCheckedChange={(checked) => setEnableSanitization(checked as boolean)}
                  />
                  <Label htmlFor="sanitization" className="flex items-center">
                    AI Sanitization
                    <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Automatically remove sensitive information like private keys, comments, and addresses
                </p>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="obfuscation"
                    checked={enableObfuscation}
                    onCheckedChange={(checked) => setEnableObfuscation(checked as boolean)}
                  />
                  <Label htmlFor="obfuscation" className="flex items-center">
                    Code Obfuscation
                    {enableObfuscation ? (
                      <EyeOff className="w-4 h-4 ml-1 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 ml-1 text-muted-foreground" />
                    )}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Transform your code to preserve functionality while protecting intellectual property
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Audit Package</CardTitle>
                <CardDescription>Choose the level of audit coverage for your smart contract</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {auditPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{pkg.name}</h3>
                        <Badge variant="outline">{pkg.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                      <div className="space-y-1 mb-3">
                        <p className="text-xs font-medium text-muted-foreground">Duration: {pkg.duration}</p>
                        <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {pkg.checks.map((check, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1 text-success" />
                              {check}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
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
              <Button onClick={() => setStep(3)} disabled={!canProceedToStep3}>
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
              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Submission Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Project:</span> {projectName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Files:</span> {files?.length} files
                  </div>
                  <div>
                    <span className="text-muted-foreground">Package:</span>{" "}
                    {auditPackages.find((p) => p.id === selectedPackage)?.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auditors:</span> {auditorMembers} member
                    {auditorMembers > 1 ? "s" : ""}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Privacy:</span> {enableSanitization ? "Sanitized" : "Raw"}{" "}
                    {enableObfuscation ? "+ Obfuscated" : ""}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cost:</span> {(() => {
                      const basePrice = Number.parseInt(
                        auditPackages.find((p) => p.id === selectedPackage)?.price.replace("$", "") || "0",
                      )
                      const multiplier = auditorMembers === 1 ? 1 : auditorMembers === 2 ? 1.25 : 1.5
                      return `$${Math.round(basePrice * multiplier)}`
                    })()}
                  </div>
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
                    confidentially by verified auditors without revealing my identity
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
                    on ApeChain blockchain with complete anonymity preserved
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
                    {uploadProgress < 30 && "Uploading and sanitizing files..."}
                    {uploadProgress >= 30 && uploadProgress < 60 && "Generating commitment hash..."}
                    {uploadProgress >= 60 && uploadProgress < 90 && "Anchoring on ApeChain..."}
                    {uploadProgress >= 90 &&
                      `Matching with ${auditorMembers} auditor${auditorMembers > 1 ? "s" : ""}...`}
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
