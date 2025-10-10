// Platform Contract Service for ProofChain
// Manages audit request tokens and developer contract tokens on platform contracts

import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import { upload } from "thirdweb/storage";
import { getContract } from "thirdweb";
import { mintTo } from "thirdweb/extensions/erc721";
import { mint } from "thirdweb/extensions/erc20";

// Initialize Thirdweb client
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

// Create account from private key
const account = privateKeyToAccount({
  client,
  privateKey: process.env.PRIVATE_KEY || "0xabe86c3d7406a74f9b916e70d0b0e2d9ea506de84477759443a4ab41c91775cf",
});

// We'll use the wallet's own contracts instead of platform contracts
// This will be determined dynamically based on the wallet's deployed contracts

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

// Create IPFS metadata for audit request token
export async function createAuditRequestTokenMetadata(data: AuditRequestTokenData): Promise<string> {
  try {
    console.log("📝 Creating audit request token metadata for platform...");
    
    const metadata = {
      name: `Audit Request: ${data.projectName}`,
      description: `Platform audit request token for ${data.projectName}`,
      image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Audit+Request+Token",
      attributes: [
        {
          trait_type: "Project Name",
          value: data.projectName
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
          trait_type: "NFT Token ID",
          value: data.nftTokenId
        },
        {
          trait_type: "NFT Transaction",
          value: data.nftTransactionHash
        },
        {
          trait_type: "Tags",
          value: data.tags.join(", ")
        },
        {
          trait_type: "Created At",
          value: new Date().toISOString()
        }
      ],
      external_url: data.githubUrl,
      background_color: "10b981"
    };

    // Upload to Thirdweb IPFS
    const uri = await upload({
      client,
      files: [new File([JSON.stringify(metadata, null, 2)], "audit-request-token-metadata.json", { type: "application/json" })]
    });

    console.log("✅ Audit request token metadata uploaded:", uri);
    return uri;
  } catch (error) {
    console.error("❌ Error creating audit request token metadata:", error);
    return `ipfs://QmAuditRequestTokenFallback${Date.now()}`;
  }
}

// Create IPFS metadata for developer token
export async function createDeveloperTokenMetadata(data: DeveloperTokenData): Promise<string> {
  try {
    console.log("📝 Creating developer token metadata for platform...");
    
    const metadata = {
      name: `Developer: ${data.developerWallet.substring(0, 8)}...`,
      description: `Platform developer token for ${data.projectName}`,
      image: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Developer+Token",
      attributes: [
        {
          trait_type: "Developer Wallet",
          value: data.developerWallet
        },
        {
          trait_type: "Project Name",
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
          trait_type: "Token Contract",
          value: data.tokenContractAddress
        },
        {
          trait_type: "NFT Contract",
          value: data.nftContractAddress
        },
        {
          trait_type: "NFT Token ID",
          value: data.nftTokenId
        },
        {
          trait_type: "NFT Transaction",
          value: data.nftTransactionHash
        },
        {
          trait_type: "Total Projects",
          value: data.totalProjects.toString()
        },
        {
          trait_type: "Total Spent",
          value: data.totalSpent.toString()
        },
        {
          trait_type: "Reputation",
          value: data.reputation.toString()
        },
        {
          trait_type: "Created At",
          value: new Date().toISOString()
        }
      ],
      external_url: data.githubUrl,
      background_color: "3b82f6"
    };

    // Upload to Thirdweb IPFS
    const uri = await upload({
      client,
      files: [new File([JSON.stringify(metadata, null, 2)], "developer-token-metadata.json", { type: "application/json" })]
    });

    console.log("✅ Developer token metadata uploaded:", uri);
    return uri;
  } catch (error) {
    console.error("❌ Error creating developer token metadata:", error);
    return `ipfs://QmDeveloperTokenFallback${Date.now()}`;
  }
}

// Mint audit request token on wallet's own contract
export async function mintAuditRequestToken(
  data: AuditRequestTokenData,
  contractAddress: string
): Promise<{ tokenId: string; transactionHash: string; metadataUri: string; explorerUrl: string }> {
  try {
    console.log("🎯 Minting audit request token on wallet's contract...");
    console.log("Contract Address:", contractAddress);
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract address not provided or invalid");
    }

    // Get the wallet's contract
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
    });

    // Create metadata
    const metadataUri = await createAuditRequestTokenMetadata(data);

    // Mint NFT to developer's wallet
    const mintResult = await mintTo({
      contract,
      to: data.developerWallet,
      metadata: {
        name: `Audit Request: ${data.projectName}`,
        description: `Audit request token for ${data.projectName}`,
        image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Audit+Request+Token",
      },
    });

    console.log("✅ Audit request token minted successfully!");
    console.log("   Mint Result:", mintResult);
    console.log("   Token ID:", mintResult?.id);
    console.log("   Transaction Hash:", mintResult?.transactionHash);

    // Handle case where mintResult might be undefined or have undefined properties
    if (!mintResult || mintResult.id === undefined || mintResult.transactionHash === undefined) {
      throw new Error("Minting failed - invalid mint result received");
    }

    return {
      tokenId: mintResult.id.toString(),
      transactionHash: mintResult.transactionHash,
      metadataUri: metadataUri,
      explorerUrl: `https://curtis.explorer.caldera.xyz/tx/${mintResult.transactionHash}`
    };
  } catch (error) {
    console.error("❌ Error minting audit request token:", error);
    throw error;
  }
}

// Mint developer token on wallet's own contract
export async function mintDeveloperToken(
  data: DeveloperTokenData,
  contractAddress: string
): Promise<{ tokenId: string; transactionHash: string; metadataUri: string; explorerUrl: string }> {
  try {
    console.log("🎯 Minting developer token on wallet's contract...");
    console.log("Contract Address:", contractAddress);
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract address not provided or invalid");
    }

    // Get the wallet's contract
    const contract = getContract({
      address: contractAddress,
      chain: apechainTestnet,
      client,
    });

    // Create metadata
    const metadataUri = await createDeveloperTokenMetadata(data);

    // Mint NFT to developer's wallet
    const mintResult = await mintTo({
      contract,
      to: data.developerWallet,
      metadata: {
        name: `Developer: ${data.developerWallet.substring(0, 8)}...`,
        description: `Developer token for ${data.projectName}`,
        image: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Developer+Token",
      },
    });

    console.log("✅ Developer token minted successfully!");
    console.log("   Mint Result:", mintResult);
    console.log("   Token ID:", mintResult?.id);
    console.log("   Transaction Hash:", mintResult?.transactionHash);

    // Handle case where mintResult might be undefined or have undefined properties
    if (!mintResult || mintResult.id === undefined || mintResult.transactionHash === undefined) {
      throw new Error("Minting failed - invalid mint result received");
    }

    return {
      tokenId: mintResult.id.toString(),
      transactionHash: mintResult.transactionHash,
      metadataUri: metadataUri,
      explorerUrl: `https://curtis.explorer.caldera.xyz/tx/${mintResult.transactionHash}`
    };
  } catch (error) {
    console.error("❌ Error minting developer token:", error);
    throw error;
  }
}

// Main function to create tokens on wallet's contracts
export async function createPlatformTokens(
  auditRequestData: AuditRequestTokenData,
  developerData: DeveloperTokenData,
  auditContractAddress?: string,
  developerContractAddress?: string
): Promise<PlatformTokenResult> {
  try {
    console.log("🚀 Creating tokens on wallet's contracts...");
    console.log("Audit Request Contract:", auditContractAddress);
    console.log("Developers Contract:", developerContractAddress);
    
    const result: PlatformTokenResult = {
      success: true
    };

    // Mint audit request token if contract is provided
    if (auditContractAddress) {
      console.log("\n🎯 Step 1: Minting audit request token...");
      try {
        result.auditRequestToken = await mintAuditRequestToken(auditRequestData, auditContractAddress);
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
        result.developerToken = await mintDeveloperToken(developerData, developerContractAddress);
        console.log("✅ Developer token created successfully!");
      } catch (error) {
        console.warn("⚠️ Failed to create developer token:", error);
        result.error = result.error ? `${result.error}; Developer token failed: ${error instanceof Error ? error.message : 'Unknown error'}` : `Developer token failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    if (!auditContractAddress && !developerContractAddress) {
      console.log("⚠️ No contract addresses provided - skipping token creation");
      result.success = false;
      result.error = "No contract addresses provided for token creation";
    }

    console.log("\n🎉 Token creation process completed!");
    return result;
  } catch (error) {
    console.error("❌ Error creating tokens:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Get contract details (now dynamic based on wallet)
export function getContractDetails() {
  return {
    chain: apechainTestnet,
    explorer: "https://curtis.explorer.caldera.xyz"
  };
}
