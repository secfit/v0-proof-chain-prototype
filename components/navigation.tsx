"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, Settings, Bell, ChevronDown, Menu, X, Moon, Sun, LogOut, User, Wallet } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useActiveAccount, useDisconnect } from "thirdweb/react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const account = useActiveAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Test auth context on mount
  useEffect(() => {
    console.log("🔧 Navigation mounted - Auth Debug:")
    console.log("🔧 User:", user)
    console.log("🔧 Is authenticated:", isAuthenticated)
    console.log("🔧 Logout function type:", typeof logout)
    
    // Test if we can call logout directly
    if (typeof logout === 'function') {
      console.log("✅ Logout function is available and callable")
    } else {
      console.error("❌ Logout function is not available!")
    }
  }, [user, isAuthenticated, logout])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleLogout = async () => {
    console.log("🚪 Logout button clicked!")
    console.log("🔍 Current user:", user)
    console.log("🔍 Is authenticated:", isAuthenticated)
    console.log("🔍 localStorage before:", localStorage.getItem("proofchain_user"))
    
    try {
      console.log("🧹 Clearing auth context...")
      // Clear auth context first
      logout()
      console.log("✅ Auth context cleared")
      console.log("🔍 localStorage after:", localStorage.getItem("proofchain_user"))
      
      console.log("🏠 Redirecting to home...")
      // Redirect to home
      router.push("/")
      console.log("✅ Redirected to home")
    } catch (error) {
      console.error("❌ Error during logout:", error)
      console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace')
      // Still clear auth context even if something fails
      logout()
      router.push("/")
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

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
            {/*<Link href="/blockchain" className="text-muted-foreground hover:text-foreground transition-colors">
              Blockchain
            </Link>*/}
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} title={isDarkMode ? "Light mode" : "Dark mode"}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {/*<Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>*/}

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {/* Test logout button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log("🧪 DIRECT LOGOUT TEST - Button clicked!")
                    handleLogout()
                  }}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                >
                  🚪 Logout
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center space-x-2"
                      onClick={() => {
                        console.log("🖱️ Dropdown trigger clicked!")
                      }}
                    >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        {user.authMethod === "email" ? (
                          <User className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Wallet className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {user.email || (user.walletAddress && formatAddress(user.walletAddress))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.authMethod === "email" ? "Email" : 
                           user.authMethod === "wallet" ? "Wallet" : 
                           user.authMethod === "both" ? "Email + Wallet" : "User"}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 z-50">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    console.log("🧪 TEST ITEM CLICKED!")
                    alert("Test item clicked!")
                  }}>
                    🧪 Test Item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.email && (
                    <DropdownMenuItem disabled className="flex flex-col items-start">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">Email</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-6">{user.email}</span>
                    </DropdownMenuItem>
                  )}
                  {user.walletAddress && (
                    <DropdownMenuItem disabled className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Wallet className="w-4 h-4 mr-2" />
                        <span className="font-medium">Wallet</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-6 font-mono">{formatAddress(user.walletAddress)}</span>
                    </DropdownMenuItem>
                  )}
                  {user.verifiedAt && (
                    <DropdownMenuItem disabled className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-medium">Verified</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-6">
                        {new Date(user.verifiedAt).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  )}
                  {user.isNewUser && (
                    <DropdownMenuItem disabled className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-medium">New User</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-6">
                        Welcome to ProofChain!
                      </span>
                    </DropdownMenuItem>
                  )}
                  {user.profiles && user.profiles.length > 0 && (
                    <DropdownMenuItem disabled className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-medium">Auth Profiles</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-6 space-y-1">
                        {user.profiles.map((profile, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span>{profile.type}:</span>
                            <span className={profile.verified ? "text-green-500" : "text-yellow-500"}>
                              {profile.identifier} {profile.verified ? "✓" : "⏳"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    console.log("🖱️ Settings button clicked - testing router")
                    router.push("/dashboard")
                  }}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      console.log("🖱️ Logout menu item clicked!", e)
                      handleLogout()
                    }}
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button onClick={() => router.push("/login")} size="sm">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {isAuthenticated && user && (
                <div className="px-2 py-3 border-b border-border mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      {user.authMethod === "email" ? (
                        <User className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Wallet className="w-5 h-5 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {user.email || (user.walletAddress && formatAddress(user.walletAddress))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.authMethod === "email" ? "Email" : 
                         user.authMethod === "wallet" ? "Wallet" : 
                         user.authMethod === "both" ? "Email + Wallet" : "User"}
                      </div>
                      {user.email && user.walletAddress && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div>📧 {user.email}</div>
                          <div>🔗 {formatAddress(user.walletAddress)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
              {/*<Link
                href="/blockchain"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Blockchain
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                Admin
              </Link>*/}
              <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                Help
              </Link>

              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="outline" className="mx-2 mt-2 bg-transparent">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button onClick={() => router.push("/login")} className="mx-2 mt-2">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
