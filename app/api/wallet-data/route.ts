import { type NextRequest, NextResponse } from "next/server"
import { getContract } from "thirdweb"
import { defineChain } from "thirdweb/chains"
import { client } from "@/lib/client"

export const dynamic = "force-dynamic"

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

export interface ContractData {
  address: string
  name: string
  symbol: string
  type: string
  balance: string
  totalSupply?: string
  decimals?: number
  explorerUrl: string
  isVerified: boolean
  creationDate?: string
  creator?: string
}

export interface TokenData {
  contractAddress: string
  tokenId?: string
  name: string
  symbol: string
  balance: string
  metadataUri?: string
  metadata?: any
  explorerUrl: string
  type: "ERC20" | "ERC721" | "ERC1155"
}

export interface IPFSData {
  hash: string
  uri: string
  metadata: any
  type: string
  relatedContract?: string
  relatedToken?: string
}

export interface WalletData {
  walletAddress: string
  balance: string
  transactionCount: number
  contracts: ContractData[]
  tokens: TokenData[]
  ipfsData: IPFSData[]
  platformTokens: {
    auditRequests: TokenData[]
    developers: TokenData[]
  }
  stats: {
    totalContracts: number
    totalTokens: number
    totalNFTs: number
    totalIPFSFiles: number
  }
}

// We'll detect contracts dynamically from the wallet's transaction history
// No hardcoded platform contracts - everything is wallet-specific

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    console.log("[v0] Wallet data API called for wallet:", walletAddress)

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Fetch comprehensive wallet data
    const walletData = await fetchWalletData(walletAddress)

    return NextResponse.json({
      success: true,
      data: walletData,
      explorer: {
        baseUrl: "https://curtis.explorer.caldera.xyz",
        walletUrl: `https://curtis.explorer.caldera.xyz/address/${walletAddress}`,
        chain: apechainTestnet.name,
        chainId: apechainTestnet.id
      }
    })

  } catch (error: any) {
    console.error("[v0] Wallet data API error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch wallet data" 
    }, { status: 500 })
  }
}

// Detect contracts created by the wallet
async function detectWalletContracts(walletAddress: string): Promise<ContractData[]> {
  try {
    console.log(`[v0] Detecting contracts for wallet: ${walletAddress}`)
    
    const contracts: ContractData[] = []
    
    // Get recent transactions to find contract creations
    const txResult = await fetch(`https://curtis.rpc.caldera.xyz/http`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{
          fromBlock: '0x0',
          toBlock: 'latest',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
            null,
            `0x000000000000000000000000${walletAddress.substring(2)}` // To address
          ]
        }],
        id: 1
      })
    })
    
    const txData = await txResult.json()
    
    if (txData.result && Array.isArray(txData.result)) {
      // Extract unique contract addresses from transfer events
      const contractAddresses = new Set<string>()
      
      for (const log of txData.result) {
        if (log.address && log.address !== '0x0000000000000000000000000000000000000000') {
          contractAddresses.add(log.address)
        }
      }
      
      // Analyze each contract
      for (const contractAddress of contractAddresses) {
        try {
          const contractInfo = await analyzeContract(contractAddress, walletAddress)
          if (contractInfo) {
            contracts.push(contractInfo)
          }
        } catch (error) {
          console.warn(`[v0] Error analyzing contract ${contractAddress}:`, error)
        }
      }
    }
    
    console.log(`[v0] Found ${contracts.length} contracts for wallet ${walletAddress}`)
    return contracts
    
  } catch (error) {
    console.error(`[v0] Error detecting contracts for ${walletAddress}:`, error)
    return []
  }
}

// Analyze a contract to determine its type and properties
async function analyzeContract(contractAddress: string, walletAddress: string): Promise<ContractData | null> {
  try {
    console.log(`[v0] Analyzing contract: ${contractAddress}`)
    
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
    })
    
    let contractInfo: ContractData = {
      address: contractAddress,
      name: "Unknown Contract",
      symbol: "UNK",
      type: "Unknown",
      balance: "0",
      explorerUrl: `https://curtis.explorer.caldera.xyz/address/${contractAddress}`,
      isVerified: false
    }
    
    // Try to detect if it's an ERC721 contract
    try {
      const nameResult = await contract.call("name")
      const symbolResult = await contract.call("symbol")
      const totalSupplyResult = await contract.call("totalSupply")
      
      contractInfo.name = nameResult.toString()
      contractInfo.symbol = symbolResult.toString()
      contractInfo.totalSupply = totalSupplyResult.toString()
      contractInfo.type = "ERC721"
      contractInfo.isVerified = true
      
      console.log(`[v0] Detected ERC721 contract: ${contractInfo.name} (${contractInfo.symbol})`)
      
    } catch (error) {
      // Try to detect if it's an ERC20 contract
      try {
        const nameResult = await contract.call("name")
        const symbolResult = await contract.call("symbol")
        const decimalsResult = await contract.call("decimals")
        const totalSupplyResult = await contract.call("totalSupply")
        
        contractInfo.name = nameResult.toString()
        contractInfo.symbol = symbolResult.toString()
        contractInfo.decimals = Number(decimalsResult)
        contractInfo.totalSupply = totalSupplyResult.toString()
        contractInfo.type = "ERC20"
        contractInfo.isVerified = true
        
        console.log(`[v0] Detected ERC20 contract: ${contractInfo.name} (${contractInfo.symbol})`)
        
      } catch (error2) {
        console.warn(`[v0] Contract ${contractAddress} is not a standard ERC20/ERC721`)
        return null
      }
    }
    
    // Get wallet's balance in this contract
    try {
      if (contractInfo.type === "ERC721") {
        const balanceResult = await contract.call("balanceOf", [walletAddress])
        contractInfo.balance = balanceResult.toString()
      } else if (contractInfo.type === "ERC20") {
        const balanceResult = await contract.call("balanceOf", [walletAddress])
        const balance = Number(balanceResult) / Math.pow(10, contractInfo.decimals || 18)
        contractInfo.balance = balance.toString()
      }
    } catch (error) {
      console.warn(`[v0] Could not fetch balance for contract ${contractAddress}:`, error)
    }
    
    return contractInfo
    
  } catch (error) {
    console.error(`[v0] Error analyzing contract ${contractAddress}:`, error)
    return null
  }
}

async function fetchWalletData(walletAddress: string): Promise<WalletData> {
  console.log(`[v0] Fetching comprehensive data for wallet: ${walletAddress}`)

  // Initialize wallet data structure
  const walletData: WalletData = {
    walletAddress,
    balance: "0",
    transactionCount: 0,
    contracts: [],
    tokens: [],
    ipfsData: [],
    platformTokens: {
      auditRequests: [],
      developers: []
    },
    stats: {
      totalContracts: 0,
      totalTokens: 0,
      totalNFTs: 0,
      totalIPFSFiles: 0
    }
  }

  try {
    // 1. Fetch wallet balance
    console.log("[v0] Fetching wallet balance...")
    const balanceResult = await fetch(`https://curtis.rpc.caldera.xyz/http`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
        id: 1
      })
    })
    const balanceData = await balanceResult.json()
    if (balanceData.result) {
      walletData.balance = (parseInt(balanceData.result, 16) / Math.pow(10, 18)).toFixed(4)
    }

    // 2. Fetch transaction count
    console.log("[v0] Fetching transaction count...")
    const txCountResult = await fetch(`https://curtis.rpc.caldera.xyz/http`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [walletAddress, 'latest'],
        id: 1
      })
    })
    const txCountData = await txCountResult.json()
    if (txCountData.result) {
      walletData.transactionCount = parseInt(txCountData.result, 16)
    }

    // 3. Detect and fetch wallet's own contracts
    console.log("[v0] Detecting wallet's contracts...")
    const walletContracts = await detectWalletContracts(walletAddress)
    
    // 4. Fetch tokens from wallet's contracts
    console.log("[v0] Fetching tokens from wallet's contracts...")
    for (const contract of walletContracts) {
      try {
        const tokens = await fetchContractTokens(
          contract.address,
          walletAddress,
          contract.name,
          contract.symbol,
          contract.type
        )
        
        // Categorize tokens based on contract type
        if (contract.name.toLowerCase().includes('audit') || contract.symbol.toLowerCase().includes('audit')) {
          walletData.platformTokens.auditRequests.push(...tokens)
        } else if (contract.name.toLowerCase().includes('developer') || contract.symbol.toLowerCase().includes('dev')) {
          walletData.platformTokens.developers.push(...tokens)
        } else {
          // Add to general tokens
          walletData.tokens.push(...tokens)
        }
        
        // Add contract info
        walletData.contracts.push(contract)
      } catch (error) {
        console.warn(`[v0] Error fetching tokens from contract ${contract.address}:`, error)
      }
    }

    // 5. Fetch IPFS data from token metadata
    console.log("[v0] Fetching IPFS data...")
    const allTokens = [
      ...walletData.platformTokens.auditRequests,
      ...walletData.platformTokens.developers
    ]
    
    for (const token of allTokens) {
      if (token.metadataUri) {
        try {
          const metadata = await fetchTokenMetadata(token.metadataUri)
          if (metadata) {
            walletData.ipfsData.push({
              hash: token.metadataUri,
              uri: token.metadataUri,
              metadata,
              type: "NFT Metadata",
              relatedContract: token.contractAddress,
              relatedToken: token.tokenId
            })
          }
        } catch (error) {
          console.warn(`[v0] Failed to fetch metadata for ${token.metadataUri}:`, error)
        }
      }
    }

    // 6. Calculate statistics
    walletData.stats.totalContracts = walletData.contracts.length
    walletData.stats.totalTokens = walletData.tokens.length
    walletData.stats.totalNFTs = allTokens.length
    walletData.stats.totalIPFSFiles = walletData.ipfsData.length

    console.log(`[v0] Wallet data fetched successfully for ${walletAddress}`)
    console.log(`[v0] Stats:`, walletData.stats)

    return walletData

  } catch (error) {
    console.error(`[v0] Error fetching wallet data for ${walletAddress}:`, error)
    throw error
  }
}

async function fetchContractTokens(
  contractAddress: string,
  walletAddress: string,
  contractName: string,
  contractSymbol: string,
  tokenType: "ERC20" | "ERC721" | "ERC1155"
): Promise<TokenData[]> {
  try {
    console.log(`[v0] Fetching ${tokenType} tokens from ${contractAddress} for wallet ${walletAddress}`)
    
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
    })

    const tokens: TokenData[] = []

    if (tokenType === "ERC721") {
      // Get balance of ERC721 tokens
      const balanceResult = await contract.call("balanceOf", [walletAddress])
      const balance = Number(balanceResult) || 0
      
      console.log(`[v0] Wallet ${walletAddress} owns ${balance} ${contractName} tokens`)
      
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

          tokens.push({
            contractAddress,
            tokenId,
            name: `${contractName} #${tokenId}`,
            symbol: contractSymbol,
            balance: "1",
            metadataUri,
            explorerUrl: `https://curtis.explorer.caldera.xyz/token/${contractAddress}?a=${tokenId}`,
            type: tokenType
          })
        } catch (error) {
          console.warn(`[v0] Error fetching token ${i} for wallet ${walletAddress}:`, error)
        }
      }
    }

    return tokens

  } catch (error) {
    console.error(`[v0] Error fetching contract tokens:`, error)
    return []
  }
}

// Helper function to fetch metadata from IPFS URI
async function fetchTokenMetadata(metadataUri: string): Promise<any> {
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
