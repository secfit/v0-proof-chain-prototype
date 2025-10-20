import { type NextRequest, NextResponse } from "next/server"
import { getContract } from "thirdweb"
import { defineChain } from "thirdweb/chains"
import { client } from "@/lib/thirdweb-config"
import { getContractDetails } from "@/lib/platform-contract-service"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// ApeChain testnet configuration
const apechainTestnet = defineChain({
  id: 33111,
  name: "ApeChain Testnet",
  rpc: "https://curtis.rpc.caldera.xyz/http",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "ApeChain Explorer",
      url: "https://curtis.explorer.caldera.xyz",
    },
  ],
})

export interface PlatformTokenData {
  tokenId: string
  owner: string
  metadataUri: string
  metadata?: any
  transactionHash?: string
  blockNumber?: number
}

export interface PlatformContractData {
  contractAddress: string
  contractName: string
  totalSupply: number
  tokens: PlatformTokenData[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")
    const contractType = searchParams.get("type") || "all" // "audit-requests", "developers", or "all"

    console.log("[v0] Platform contracts API called with wallet:", walletAddress, "type:", contractType)

    const platformDetails = getContractDetails()
    
    if (!platformDetails.auditRequestsContract || !platformDetails.developersContract) {
      return NextResponse.json({ 
        error: "Platform contract addresses not configured",
        details: "Please set NEXT_PUBLIC_AUDIT_REQUESTS_CONTRACT and NEXT_PUBLIC_DEVELOPERS_CONTRACT environment variables"
      }, { status: 400 })
    }

    const results: { [key: string]: PlatformContractData } = {}

    // Fetch audit requests contract data
    if (contractType === "all" || contractType === "audit-requests") {
      try {
        console.log("[v0] Fetching audit requests contract data...")
        const auditRequestsData = await fetchContractData(
          platformDetails.auditRequestsContract,
          "ProofChain Audit Requests",
          walletAddress
        )
        results.auditRequests = auditRequestsData
      } catch (error) {
        console.error("[v0] Error fetching audit requests:", error)
        results.auditRequests = {
          contractAddress: platformDetails.auditRequestsContract,
          contractName: "ProofChain Audit Requests",
          totalSupply: 0,
          tokens: []
        }
      }
    }

    // Fetch developers contract data
    if (contractType === "all" || contractType === "developers") {
      try {
        console.log("[v0] Fetching developers contract data...")
        const developersData = await fetchContractData(
          platformDetails.developersContract,
          "ProofChain Developers",
          walletAddress
        )
        results.developers = developersData
      } catch (error) {
        console.error("[v0] Error fetching developers:", error)
        results.developers = {
          contractAddress: platformDetails.developersContract,
          contractName: "ProofChain Developers",
          totalSupply: 0,
          tokens: []
        }
      }
    }

    return NextResponse.json({
      success: true,
      contracts: results,
      platformDetails: {
        chain: platformDetails.chain.name,
        chainId: platformDetails.chain.id,
        explorer: platformDetails.explorer
      }
    })

  } catch (error: any) {
    console.error("[v0] Platform contracts API error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch platform contract data" 
    }, { status: 500 })
  }
}

async function fetchContractData(
  contractAddress: string,
  contractName: string,
  walletAddress?: string | null
): Promise<PlatformContractData> {
  try {
    console.log(`[v0] Fetching data for ${contractName} at ${contractAddress}`)
    
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
    })

    // Get total supply
    let totalSupply = 0
    try {
      // Note: This assumes the contract has a totalSupply() function
      // You might need to adjust this based on your actual contract implementation
      const supplyResult = await contract.call("totalSupply")
      totalSupply = Number(supplyResult) || 0
    } catch (error) {
      console.warn(`[v0] Could not fetch total supply for ${contractName}:`, error)
    }

    // Get tokens owned by wallet if wallet address provided
    const tokens: PlatformTokenData[] = []
    
    if (walletAddress) {
      try {
        // Get balance of tokens owned by wallet
        const balanceResult = await contract.call("balanceOf", [walletAddress])
        const balance = Number(balanceResult) || 0
        
        console.log(`[v0] Wallet ${walletAddress} owns ${balance} tokens in ${contractName}`)
        
        // Get token IDs owned by wallet
        for (let i = 0; i < balance; i++) {
          try {
            const tokenIdResult = await contract.call("tokenOfOwnerByIndex", [walletAddress, i])
            const tokenId = tokenIdResult.toString()
            
            // Get token URI
            let metadataUri = ""
            try {
              const uriResult = await contract.call("tokenURI", [tokenId])
              metadataUri = uriResult.toString()
            } catch (error) {
              console.warn(`[v0] Could not fetch token URI for token ${tokenId}:`, error)
            }

            // Get owner
            let owner = walletAddress
            try {
              const ownerResult = await contract.call("ownerOf", [tokenId])
              owner = ownerResult.toString()
            } catch (error) {
              console.warn(`[v0] Could not fetch owner for token ${tokenId}:`, error)
            }

            tokens.push({
              tokenId,
              owner,
              metadataUri,
            })
          } catch (error) {
            console.warn(`[v0] Error fetching token ${i} for wallet ${walletAddress}:`, error)
          }
        }
      } catch (error) {
        console.warn(`[v0] Could not fetch tokens for wallet ${walletAddress}:`, error)
      }
    }

    return {
      contractAddress,
      contractName,
      totalSupply,
      tokens
    }

  } catch (error) {
    console.error(`[v0] Error fetching contract data for ${contractName}:`, error)
    throw error
  }
}

// Helper function to fetch metadata from IPFS URI
export async function fetchTokenMetadata(metadataUri: string): Promise<any> {
  try {
    if (!metadataUri || metadataUri === "") {
      return null
    }

    // Handle IPFS URIs
    let url = metadataUri
    if (metadataUri.startsWith("ipfs://")) {
      url = `https://ipfs.io/ipfs/${metadataUri.replace("ipfs://", "")}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching token metadata:", error)
    return null
  }
}
