// Client-side Wallet Minting Service for ProofChain
// Uses connected wallet accounts for minting instead of server-side private keys

import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { uploadJSONToIPFS } from "@/lib/storage-service";

// Import contract artifacts
const ProofChainTokenArtifact = require("../artifacts/contracts/ProofChainToken.sol/ProofChainToken.json");
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
    name: "ApeChain Testnet Gas Token",
    symbol: "APE",
    decimals: 18
  },
  explorers: [
    { 
      name: "ApeChain Explorer", 
      url: "https://curtis.explorer.caldera.xyz", 
      standard: "EIP3091" 
    }
  ]
});

export interface AuditRequestData {
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
}

export interface ContractCreationResult {
  success: boolean;
  tokenContract?: {
    address: string;
    name: string;
    symbol: string;
    explorerUrl: string;
  };
  nftContract?: {
    address: string;
    name: string;
    symbol: string;
    explorerUrl: string;
  };
  nftMintResult?: {
    tokenId: string;
    transactionHash: string;
    metadataUri: string;
    explorerUrl: string;
  };
  error?: string;
}

// Upload metadata to IPFS (client-side)
export async function uploadMetadataToIPFSClient(data: AuditRequestData): Promise<string> {
  try {
    console.log("📝 Uploading metadata to IPFS (client-side)...");
    
    const metadata = {
      name: `Audit Request: ${data.projectName}`,
      description: `Comprehensive audit request for ${data.projectName} - A detailed smart contract security audit request containing project specifications, repository analysis, and audit requirements.`,
      image: "https://via.placeholder.com/400x400/6366f1/ffffff?text=Audit+Request",
      external_url: data.githubUrl,
      
      // Main Audit Request Information
      audit_request: {
        project_name: data.projectName,
        description: data.description,
        github_url: data.githubUrl,
        repository_hash: data.repoHash,
        developer_wallet: data.developerWallet,
        created_at: new Date().toISOString(),
        status: "pending",
        type: "smart_contract_audit"
      },
      
      // Audit Specifications
      audit_specifications: {
        complexity: data.complexity,
        estimated_duration: data.estimatedDuration,
        proposed_price: data.proposedPrice,
        auditor_count: data.auditorCount,
        tags: data.tags,
        requirements: {
          security_analysis: true,
          code_review: true,
          vulnerability_assessment: true,
          gas_optimization: true,
          best_practices_review: true
        }
      },
      
      // Repository Information
      repository_info: {
        url: data.githubUrl,
        hash: data.repoHash,
        analysis_completed: true,
        solidity_files: "analyzed",
        total_lines: "calculated",
        complexity_score: data.complexity
      },
      
      // Contract Information (will be added after deployment)
      contract_info: {
        token_contract: "pending_deployment",
        nft_contract: "pending_deployment",
        network: "ApeChain Testnet",
        chain_id: 33111
      },
      
      // Platform Integration
      platform_info: {
        platform: "ProofChain",
        ecosystem: "ZKP Smart Contract Auditing",
        governance: "decentralized",
        reputation_system: "enabled"
      },
      
      // Standard NFT attributes for compatibility
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
          trait_type: "Repository Hash",
          value: data.repoHash
        },
        {
          trait_type: "Developer Wallet",
          value: data.developerWallet
        },
        {
          trait_type: "Tags",
          value: data.tags.join(", ")
        },
        {
          trait_type: "Status",
          value: "Pending"
        },
        {
          trait_type: "Created At",
          value: new Date().toISOString()
        },
        {
          trait_type: "Platform",
          value: "ProofChain"
        },
        {
          trait_type: "Network",
          value: "ApeChain Testnet"
        }
      ]
    };

    // Upload to real IPFS
    const result = await uploadJSONToIPFS(metadata, `audit-request-${data.projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`);
    const ipfsUri = `ipfs://${result.ipfsHash}`;
    
    console.log("✅ Main audit request metadata uploaded to IPFS:", ipfsUri);
    console.log("   IPFS Hash:", result.ipfsHash);
    console.log("   Gateway URL:", result.gatewayUrl);
    return ipfsUri;
  } catch (error) {
    console.error("❌ Error uploading metadata to IPFS:", error);
    throw error;
  }
}

// Deploy ERC20 token contract using connected wallet
export async function deployTokenContractClient(
  projectName: string,
  developerWallet: string,
  connectedAccount: any
): Promise<{ address: string; name: string; symbol: string; explorerUrl: string }> {
  try {
    console.log("🚀 Deploying ERC20 token contract using connected wallet...");
    
    const tokenName = `${projectName} Audit Token`;
    const tokenSymbol = `${projectName.substring(0, 4).toUpperCase()}AT`;
    
    console.log("📋 Contract parameters:", {
      tokenName,
      tokenSymbol,
      developerWallet,
      connectedAccount: connectedAccount.address,
      chainId: apechainTestnet.id
    });
    
    // Import deployContract from thirdweb/deploys
    const { deployContract } = await import("thirdweb/deploys");
    
    // Deploy contract using connected wallet
    const contractAddress = await deployContract({
      client,
      chain: apechainTestnet,
      account: connectedAccount,
      bytecode: ProofChainTokenArtifact.bytecode,
      abi: ProofChainTokenArtifact.abi,
      constructorParams: {
        name: tokenName,
        symbol: tokenSymbol,
        initialOwner: developerWallet,
      },
    });
    
    console.log("✅ ERC20 token contract deployed:", contractAddress);
    
    return {
      address: contractAddress,
      name: tokenName,
      symbol: tokenSymbol,
      explorerUrl: `https://curtis.explorer.caldera.xyz/address/${contractAddress}`
    };
  } catch (error) {
    console.error("❌ Error deploying ERC20 token contract:", error);
    throw error;
  }
}

// Deploy ERC721 NFT contract using connected wallet
export async function deployNFTContractClient(
  projectName: string,
  developerWallet: string,
  connectedAccount: any
): Promise<{ address: string; name: string; symbol: string; explorerUrl: string }> {
  try {
    console.log("🎨 Deploying ERC721 NFT contract using connected wallet...");
    
    const nftName = `${projectName} Audit NFT`;
    const nftSymbol = `${projectName.substring(0, 4).toUpperCase()}AN`;
    
    console.log("📋 NFT Contract parameters:", {
      nftName,
      nftSymbol,
      developerWallet,
      connectedAccount: connectedAccount.address,
      chainId: apechainTestnet.id
    });
    
    // Import deployContract from thirdweb/deploys
    const { deployContract } = await import("thirdweb/deploys");
    
    // Deploy contract using connected wallet
    const contractAddress = await deployContract({
      client,
      chain: apechainTestnet,
      account: connectedAccount,
      bytecode: AuditRequestNFTArtifact.bytecode,
      abi: AuditRequestNFTArtifact.abi,
      constructorParams: {
        name: nftName,
        symbol: nftSymbol,
        initialOwner: developerWallet,
      },
    });
    
    console.log("✅ ERC721 NFT contract deployed:", contractAddress);
    
    return {
      address: contractAddress,
      name: nftName,
      symbol: nftSymbol,
      explorerUrl: `https://curtis.explorer.caldera.xyz/address/${contractAddress}`
    };
  } catch (error) {
    console.error("❌ Error deploying ERC721 NFT contract:", error);
    throw error;
  }
}

// Mint NFT using connected wallet
export async function mintNFTClient(
  nftContractAddress: string,
  metadataUri: string,
  developerWallet: string,
  connectedAccount: any
): Promise<{ tokenId: string; transactionHash: string; metadataUri: string; explorerUrl: string }> {
  try {
    console.log("🎯 Minting NFT using connected wallet...");
    
    console.log("📋 Minting parameters:", {
      nftContractAddress,
      developerWallet,
      metadataUri,
      connectedAccount: connectedAccount.address,
      chainId: apechainTestnet.id
    });
    
    // Validate contract address format
    if (!nftContractAddress || !nftContractAddress.startsWith('0x') || nftContractAddress.length !== 42) {
      throw new Error(`Invalid contract address: ${nftContractAddress}`);
    }
    
    // Validate developer wallet address format
    if (!developerWallet || !developerWallet.startsWith('0x') || developerWallet.length !== 42) {
      throw new Error(`Invalid developer wallet address: ${developerWallet}`);
    }
    
    // Get the NFT contract with real ABI
    const nftContract = getContract({
      address: nftContractAddress,
      chain: apechainTestnet,
      client,
      abi: AuditRequestNFTArtifact.abi,
    });
    
    console.log("📝 Minting account details:", {
      address: connectedAccount.address,
      isOwner: connectedAccount.address.toLowerCase() === developerWallet.toLowerCase()
    });
    
    // Check if the minting account is the same as the developer wallet (contract owner)
    if (connectedAccount.address.toLowerCase() !== developerWallet.toLowerCase()) {
      console.warn("⚠️  Warning: Connected account is different from developer wallet (contract owner)");
      console.warn(`   Connected Account: ${connectedAccount.address}`);
      console.warn(`   Developer Wallet (Contract Owner): ${developerWallet}`);
      console.warn("   This will likely cause 'OwnableUnauthorizedAccount' error");
      console.warn("   Solution: Use the same wallet for both connection and as developer wallet");
    }
    
    // Prepare the mint transaction using real ABI
    const mintTransaction = prepareContractCall({
      contract: nftContract,
      method: "safeMint",
      params: [developerWallet, metadataUri],
    });
    
    // Send and confirm the transaction using the connected account
    const receipt = await sendAndConfirmTransaction({
      transaction: mintTransaction,
      account: connectedAccount,
    });
    
    // Extract token ID from transaction logs
    // This is a simplified approach - in reality you'd parse the logs
    const tokenId = "0"; // First minted token
    
    console.log("✅ NFT minted successfully!");
    console.log("   Token ID:", tokenId);
    console.log("   Transaction Hash:", receipt.transactionHash);
    console.log("   Minted by:", connectedAccount.address);
    console.log("   Minted to:", developerWallet);
    
    return {
      tokenId: tokenId,
      transactionHash: receipt.transactionHash,
      metadataUri: metadataUri,
      explorerUrl: `https://curtis.explorer.caldera.xyz/tx/${receipt.transactionHash}`
    };
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
    console.error("💡 Troubleshooting tips:");
    console.error("   1. Ensure the connected account is the contract owner");
    console.error("   2. Check that the contract was deployed with the correct owner");
    console.error("   3. Verify the connected wallet has sufficient gas");
    console.error("   4. Make sure you're connected to the correct network (ApeChain testnet)");
    throw error;
  }
}

// Main function to create contracts and mint NFT using connected wallet
export async function createAuditRequestContractsClient(
  data: AuditRequestData,
  connectedAccount: any
): Promise<ContractCreationResult> {
  try {
    console.log("🚀 Starting contract creation with connected wallet...");
    console.log("Project:", data.projectName);
    console.log("Developer:", data.developerWallet);
    console.log("Connected Account:", connectedAccount.address);

    // 1. Upload metadata to IPFS
    console.log("\n📝 Step 1: Uploading metadata to IPFS...");
    const metadataUri = await uploadMetadataToIPFSClient(data);

    // 2. Deploy ERC20 token contract
    console.log("\n💰 Step 2: Deploying ERC20 token contract...");
    const tokenContract = await deployTokenContractClient(data.projectName, data.developerWallet, connectedAccount);

    // 3. Deploy ERC721 NFT contract
    console.log("\n🎨 Step 3: Deploying ERC721 NFT contract...");
    const nftContract = await deployNFTContractClient(data.projectName, data.developerWallet, connectedAccount);

    // 4. Mint NFT
    console.log("\n🎯 Step 4: Minting NFT...");
    const nftMintResult = await mintNFTClient(nftContract.address, metadataUri, data.developerWallet, connectedAccount);

    console.log("\n🎉 Contract creation and NFT minting process completed!");

    return {
      success: true,
      tokenContract,
      nftContract,
      nftMintResult,
    };
  } catch (error: any) {
    console.error("❌ Error creating contracts with connected wallet:", error);
    return { success: false, error: error.message };
  }
}
