"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings, Bell, ChevronDown, Menu, X } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ProofChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/audits" className="text-muted-foreground hover:text-foreground transition-colors">
              Audits
            </Link>
            <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/verification" className="text-muted-foreground hover:text-foreground transition-colors">
              Verification
            </Link>
            <Link href="/blockchain" className="text-muted-foreground hover:text-foreground transition-colors">
              Blockchain
            </Link>
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                Developer
              </Badge>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-primary rounded-full"></div>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Dashboard
              </Link>
              <Link href="/audits" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                Audits
              </Link>
              <Link
                href="/marketplace"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Marketplace
              </Link>
              <Link
                href="/verification"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Verification
              </Link>
              <Link
                href="/blockchain"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Blockchain
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
