"use client"

import { useActiveAccount, useActiveWallet, ConnectButton, useConnect } from "thirdweb/react"
import { client } from "@/lib/thirdweb-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function WalletDebug() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const connect = useConnect()
  const [connectionStatus, setConnectionStatus] = useState<string>("Not attempted")

  console.log("[WalletDebug] Account:", account)
  console.log("[WalletDebug] Wallet:", wallet)
  console.log("[WalletDebug] Client:", client)
  console.log("[WalletDebug] Connect function:", connect)

  const testConnection = async () => {
    try {
      setConnectionStatus("Attempting connection...")
      console.log("[WalletDebug] Testing wallet connection...")
      
      // Try to connect with a simple wallet
      const result = await connect(async () => {
        // This is a simplified connection test
        console.log("[WalletDebug] Connection attempt started")
        return null // This will likely fail, but we can see the error
      })
      
      console.log("[WalletDebug] Connection result:", result)
      setConnectionStatus("Connection successful")
    } catch (error) {
      console.error("[WalletDebug] Connection error:", error)
      setConnectionStatus(`Connection failed: ${error}`)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Wallet Connection Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Client:</strong> {client ? 'Exists' : 'Null'}
          </div>
          <div>
            <strong>Client ID:</strong> {client?.clientId || 'None'}
          </div>
          <div>
            <strong>Account:</strong> {account ? 'Exists' : 'Null'}
          </div>
          <div>
            <strong>Account Address:</strong> {account?.address || 'None'}
          </div>
          <div>
            <strong>Wallet:</strong> {wallet ? 'Exists' : 'Null'}
          </div>
          <div>
            <strong>Wallet Address:</strong> {wallet?.getAccount()?.address || 'None'}
          </div>
          <div>
            <strong>Connect Function:</strong> {connect ? 'Exists' : 'Null'}
          </div>
          <div>
            <strong>Connection Status:</strong> {connectionStatus}
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <ConnectButton client={client} />
          <Button 
            variant="outline"
            onClick={() => {
              console.log("=== WALLET DEBUG INFO ===")
              console.log("Client:", client)
              console.log("Client ID:", client?.clientId)
              console.log("Account:", account)
              console.log("Account Address:", account?.address)
              console.log("Wallet:", wallet)
              console.log("Wallet Address:", wallet?.getAccount()?.address)
              console.log("Connect Function:", connect)
              console.log("=========================")
            }}
          >
            Log Debug Info
          </Button>
          <Button 
            variant="secondary"
            onClick={testConnection}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
