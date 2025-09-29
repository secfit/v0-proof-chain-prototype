"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"

type AuthContextValue = {
  userEmail: string | null
  isVerified: boolean
  requestCode: (email: string) => Promise<void>
  verifyCode: (code: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const requestCode = useCallback(async (email: string) => {
    // Demo-only: accept any email and "send" a code of 123456
    setUserEmail(email)
    setIsVerified(false)
    // In a real app, call your backend to send the code via email.
    await new Promise((r) => setTimeout(r, 400))
  }, [])

  const verifyCode = useCallback(async (code: string) => {
    // Demo-only verification logic
    const success = code.trim() === "123456"
    setIsVerified(success)
    return success
  }, [])

  const logout = useCallback(() => {
    setUserEmail(null)
    setIsVerified(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ userEmail, isVerified, requestCode, verifyCode, logout }),
    [userEmail, isVerified, requestCode, verifyCode, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}



