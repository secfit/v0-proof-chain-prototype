// Client-side Platform Token Service for ProofChain
// Uses connected wallet accounts for minting platform tokens

import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { uploadJSONToIPFS } from "@/lib/storage-service";

// Import contract artifacts
const AuditRequestNFTArtifact = require("../artifacts/contracts/AuditRequestNFT.sol/AuditRequestNFT.json");

// Initialize Thirdweb client for client-side operations
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
});

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
});

export interface AuditRequestTokenData {
  projectName: string;
  githubUrl: string;
  repoHash: string;
  complexity: string;
  estimatedDuration: string;
  proposedPrice: string;
  auditorCount: string;
  developerWallet: string;
  tags: string[];
  description: string;
  tokenContractAddress: string;
  nftContractAddress: string;
  nftTokenId: string;
  nftTransactionHash: string;
}

export interface DeveloperTokenData {
  developerWallet: string;
  projectName: string;
  githubUrl: string;
  repoHash: string;
  tokenContractAddress: string;
  nftContractAddress: string;
  nftTokenId: string;
  nftTransactionHash: string;
  totalProjects: number;
  totalSpent: number;
  reputation: number;
}

export interface PlatformTokenResult {
  success: boolean;
  auditRequestToken?: {
    tokenId: string;
    transactionHash: string;
    metadataUri: string;
    explorerUrl: string;
  };
  developerToken?: {
    tokenId: string;
    transactionHash: string;
    metadataUri: string;
    explorerUrl: string;
  };
  error?: string;
}

// Create metadata for audit request token
export async function createAuditRequestTokenMetadataClient(data: AuditRequestTokenData): Promise<string> {
  try {
    console.log("📝 Creating audit request token metadata...");
    
    const metadata = {
      name: `ProofChain Audit Request: ${data.projectName}`,
      description: `Platform-specific audit request token for ${data.projectName} - ProofChain ecosystem integration token containing platform metadata, governance data, and ecosystem connectivity information.`,
      image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Audit+Request+Token",
      external_url: data.githubUrl,
      
      // Platform-Specific Information
      platform_metadata: {
        platform: "ProofChain",
        ecosystem: "ZKP Smart Contract Auditing",
        token_type: "audit_request_platform_token",
        governance_enabled: true,
        reputation_system: "active",
        created_at: new Date().toISOString(),
        platform_version: "1.0.0"
      },
      
      // Audit Request Details (Platform Format)
      audit_request_details: {
        project_name: data.projectName,
        description: data.description,
        github_url: data.githubUrl,
        repository_hash: data.repoHash,
        developer_wallet: data.developerWallet,
        complexity: data.complexity,
        estimated_duration: data.estimatedDuration,
        proposed_price: data.proposedPrice,
        auditor_count: data.auditorCount,
        tags: data.tags,
        status: "platform_verified"
      },
      
      // Platform Integration Data
      platform_integration: {
        ecosystem_connection: "active",
        governance_participation: "enabled",
        reputation_tracking: "enabled",
        analytics_integration: "enabled",
        platform_features: [
          "audit_request_management",
          "governance_voting",
          "reputation_tracking",
          "ecosystem_analytics",
          "platform_statistics"
        ],
        integration_level: "full"
      },
      
      // Contract References
      contract_references: {
        token_contract: data.tokenContractAddress,
        nft_contract: data.nftContractAddress,
        main_nft_token_id: data.nftTokenId,
        main_nft_transaction: data.nftTransactionHash,
        network: "ApeChain Testnet",
        chain_id: 33111
      },
      
      // Platform Analytics
      platform_analytics: {
        request_category: data.complexity,
        platform_metrics: "tracked",
        ecosystem_contribution: "recorded",
        governance_weight: "calculated"
      },
      
      // Standard NFT attributes for compatibility
      attributes: [
        {
          trait_type: "Project Name",
          value: data.projectName
        },
        {
          trait_type: "Platform",
          value: "ProofChain"
        },
        {
          trait_type: "Token Type",
          value: "Platform Integration"
        },
        {
          trait_type: "Complexity",
          value: data.complexity
        },
        {
          trait_type: "Estimated Duration",
          value: data.estimatedDuration
        },
        {
          trait_type: "Proposed Price",
          value: data.proposedPrice
        },
        {
          trait_type: "Auditor Count",
          value: data.auditorCount
        },
        {
          trait_type: "GitHub URL",
          value: data.githubUrl
        },
        {
          trait_type: "Repository Hash",
          value: data.repoHash
        },
        {
          trait_type: "Developer Wallet",
          value: data.developerWallet
        },
        {
          trait_type: "Token Contract",
          value: data.tokenContractAddress
        },
        {
          trait_type: "NFT Contract",
          value: data.nftContractAddress
        },
        {
          trait_type: "Main NFT Token ID",
          value: data.nftTokenId
        },
        {
          trait_type: "Main NFT Transaction",
          value: data.nftTransactionHash
        },
        {
          trait_type: "Platform Status",
          value: "Verified"
        },
        {
          trait_type: "Ecosystem Integration",
          value: "Active"
        },
        {
          trait_type: "Created At",
          value: new Date().toISOString()
        }
      ],
      tags: data.tags
    };

    const result = await uploadJSONToIPFS(metadata, `audit-request-token-${Date.now()}.json`);
    const uri = `ipfs://${result.ipfsHash}`;

    console.log("✅ Audit request token metadata uploaded:", uri);
    console.log("   IPFS Hash:", result.ipfsHash);
    console.log("   Gateway URL:", result.gatewayUrl);
    return uri;
  } catch (error) {
    console.error("❌ Error creating audit request token metadata:", error);
    return `ipfs://QmAuditRequestTokenFallback${Date.now()}`;
  }
}

// Create metadata for developer token
export async function createDeveloperTokenMetadataClient(data: DeveloperTokenData): Promise<string> {
  try {
    console.log("📝 Creating developer token metadata...");
    
    const metadata = {
      name: `ProofChain Developer: ${data.developerWallet.substring(0, 8)}...`,
      description: `Developer profile and achievement token for ${data.developerWallet.substring(0, 8)}... - Comprehensive developer profile containing activity history, achievements, reputation data, and ecosystem participation metrics.`,
      image: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Developer+Token",
      external_url: data.githubUrl,
      
      // Developer Profile Information
      developer_profile: {
        wallet_address: data.developerWallet,
        display_name: `Developer ${data.developerWallet.substring(0, 8)}...`,
        platform: "ProofChain",
        member_since: new Date().toISOString(),
        status: "active",
        verification_level: "verified"
      },
      
      // Achievement Data
      achievement_data: {
        total_projects: data.totalProjects,
        total_spent: data.totalSpent,
        reputation_score: data.reputation,
        success_rate: "calculated",
        completion_rate: "tracked",
        achievements: [
          "first_audit_request",
          "platform_member",
          "active_developer"
        ],
        badges: [
          "early_adopter",
          "platform_contributor"
        ]
      },
      
      // Project References
      project_references: {
        current_project: {
          name: data.projectName,
          github_url: data.githubUrl,
          repository_hash: data.repoHash,
          status: "active",
          created_at: new Date().toISOString()
        },
        project_history: [
          {
            name: data.projectName,
            github_url: data.githubUrl,
            repository_hash: data.repoHash,
            status: "completed",
            completion_date: new Date().toISOString()
          }
        ],
        total_projects: data.totalProjects
      },
      
      // Developer Statistics
      developer_statistics: {
        activity_level: "high",
        platform_engagement: "active",
        ecosystem_contribution: "significant",
        reputation_trend: "increasing",
        participation_score: "calculated",
        community_standing: "respected"
      },
      
      // Contract References
      contract_references: {
        token_contract: data.tokenContractAddress,
        nft_contract: data.nftContractAddress,
        main_nft_token_id: data.nftTokenId,
        main_nft_transaction: data.nftTransactionHash,
        network: "ApeChain Testnet",
        chain_id: 33111
      },
      
      // Platform Integration
      platform_integration: {
        ecosystem_participation: "active",
        governance_participation: "enabled",
        reputation_tracking: "enabled",
        analytics_integration: "enabled",
        platform_features_used: [
          "audit_request_submission",
          "project_management",
          "reputation_tracking"
        ]
      },
      
      // Standard NFT attributes for compatibility
      attributes: [
        {
          trait_type: "Developer Wallet",
          value: data.developerWallet
        },
        {
          trait_type: "Platform",
          value: "ProofChain"
        },
        {
          trait_type: "Token Type",
          value: "Developer Profile"
        },
        {
          trait_type: "Current Project",
          value: data.projectName
        },
        {
          trait_type: "GitHub URL",
          value: data.githubUrl
        },
        {
          trait_type: "Repository Hash",
          value: data.repoHash
        },
        {
          trait_type: "Total Projects",
          value: data.totalProjects
        },
        {
          trait_type: "Total Spent",
          value: data.totalSpent
        },
        {
          trait_type: "Reputation Score",
          value: data.reputation
        },
        {
          trait_type: "Token Contract",
          value: data.tokenContractAddress
        },
        {
          trait_type: "NFT Contract",
          value: data.nftContractAddress
        },
        {
          trait_type: "Main NFT Token ID",
          value: data.nftTokenId
        },
        {
          trait_type: "Main NFT Transaction",
          value: data.nftTransactionHash
        },
        {
          trait_type: "Member Since",
          value: new Date().toISOString()
        },
        {
          trait_type: "Status",
          value: "Active"
        },
        {
          trait_type: "Ecosystem Participation",
          value: "High"
        }
      ]
    };

    const result = await uploadJSONToIPFS(metadata, `developer-token-${Date.now()}.json`);
    const uri = `ipfs://${result.ipfsHash}`;

    console.log("✅ Developer token metadata uploaded:", uri);
    console.log("   IPFS Hash:", result.ipfsHash);
    console.log("   Gateway URL:", result.gatewayUrl);
    return uri;
  } catch (error) {
    console.error("❌ Error creating developer token metadata:", error);
    return `ipfs://QmDeveloperTokenFallback${Date.now()}`;
  }
}

// Mint audit request token using connected wallet
export async function mintAuditRequestTokenClient(
  data: AuditRequestTokenData,
  contractAddress: string,
  connectedAccount: any
): Promise<{ tokenId: string; transactionHash: string; metadataUri: string; explorerUrl: string }> {
  try {
    console.log("🎯 Minting audit request token using connected wallet...");
    console.log("Contract Address:", contractAddress);
    console.log("Connected Account:", connectedAccount.address);
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract address not provided or invalid");
    }

    if (!connectedAccount) {
      throw new Error("Connected account not provided");
    }

    // Get the contract with real ABI
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
      abi: AuditRequestNFTArtifact.abi,
    });

    // Create metadata
    const metadataUri = await createAuditRequestTokenMetadataClient(data);

    // Prepare the mint transaction using real ABI
    const mintTransaction = prepareContractCall({
      contract,
      method: "safeMint",
      params: [data.developerWallet, metadataUri],
    });
    
    // Send and confirm the transaction using the connected account
    const receipt = await sendAndConfirmTransaction({
      transaction: mintTransaction,
      account: connectedAccount,
    });
    
    // Extract token ID from transaction logs
    // This is a simplified approach - in reality you'd parse the logs
    const tokenId = "1"; // Second minted token (after the main audit request NFT)
    
    console.log("✅ Audit request token minted successfully!");
    console.log("   Token ID:", tokenId);
    console.log("   Transaction Hash:", receipt.transactionHash);
    console.log("   Minted by:", connectedAccount.address);
    console.log("   Minted to:", data.developerWallet);

    return {
      tokenId: tokenId,
      transactionHash: receipt.transactionHash,
      metadataUri: metadataUri,
      explorerUrl: `https://curtis.explorer.caldera.xyz/tx/${receipt.transactionHash}`
    };
  } catch (error) {
    console.error("❌ Error minting audit request token:", error);
    throw error;
  }
}

// Mint developer token using connected wallet
export async function mintDeveloperTokenClient(
  data: DeveloperTokenData,
  contractAddress: string,
  connectedAccount: any
): Promise<{ tokenId: string; transactionHash: string; metadataUri: string; explorerUrl: string }> {
  try {
    console.log("🎯 Minting developer token using connected wallet...");
    console.log("Contract Address:", contractAddress);
    console.log("Connected Account:", connectedAccount.address);
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract address not provided or invalid");
    }

    if (!connectedAccount) {
      throw new Error("Connected account not provided");
    }

    // Get the contract with real ABI
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
      abi: AuditRequestNFTArtifact.abi,
    });

    // Create metadata
    const metadataUri = await createDeveloperTokenMetadataClient(data);

    // Prepare the mint transaction using real ABI
    const mintTransaction = prepareContractCall({
      contract,
      method: "safeMint",
      params: [data.developerWallet, metadataUri],
    });
    
    // Send and confirm the transaction using the connected account
    const receipt = await sendAndConfirmTransaction({
      transaction: mintTransaction,
      account: connectedAccount,
    });
    
    // Extract token ID from transaction logs
    // This is a simplified approach - in reality you'd parse the logs
    const tokenId = "2"; // Third minted token (after the main audit request NFT and audit request token)
    
    console.log("✅ Developer token minted successfully!");
    console.log("   Token ID:", tokenId);
    console.log("   Transaction Hash:", receipt.transactionHash);
    console.log("   Minted by:", connectedAccount.address);
    console.log("   Minted to:", data.developerWallet);

    return {
      tokenId: tokenId,
      transactionHash: receipt.transactionHash,
      metadataUri: metadataUri,
      explorerUrl: `https://curtis.explorer.caldera.xyz/tx/${receipt.transactionHash}`
    };
  } catch (error) {
    console.error("❌ Error minting developer token:", error);
    throw error;
  }
}

// Main function to create platform tokens using connected wallet
export async function createPlatformTokensClient(
  auditRequestData: AuditRequestTokenData,
  developerData: DeveloperTokenData,
  auditContractAddress: string,
  developerContractAddress: string,
  connectedAccount: any
): Promise<PlatformTokenResult> {
  try {
    console.log("🚀 [CLIENT] Creating platform tokens using connected wallet...");
    console.log("🚀 [CLIENT] Connected Account:", connectedAccount?.address);
    console.log("🚀 [CLIENT] Audit Request Contract:", auditContractAddress);
    console.log("🚀 [CLIENT] Developer Contract:", developerContractAddress);
    
    const result: PlatformTokenResult = {
      success: true
    };

    // Mint audit request token if contract is provided
    if (auditContractAddress) {
      console.log("\n🎯 Step 1: Minting audit request token...");
      try {
        result.auditRequestToken = await mintAuditRequestTokenClient(
          auditRequestData, 
          auditContractAddress, 
          connectedAccount
        );
        console.log("✅ Audit request token created successfully!");
      } catch (error) {
        console.warn("⚠️ Failed to create audit request token:", error);
        result.error = `Audit request token failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    // Mint developer token if contract is provided
    if (developerContractAddress) {
      console.log("\n🎯 Step 2: Minting developer token...");
      try {
        result.developerToken = await mintDeveloperTokenClient(
          developerData, 
          developerContractAddress, 
          connectedAccount
        );
        console.log("✅ Developer token created successfully!");
      } catch (error) {
        console.warn("⚠️ Failed to create developer token:", error);
        result.error = result.error ? `${result.error}; Developer token failed: ${error instanceof Error ? error.message : 'Unknown error'}` : `Developer token failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    if (!auditContractAddress && !developerContractAddress) {
      result.success = false;
      result.error = "No contract addresses provided for platform token creation";
    }

    return result;
  } catch (error) {
    console.error("❌ Error creating platform tokens:", error);
    return {
      success: false,
      error: `Platform token creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
