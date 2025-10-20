// Audit Result NFT Minting Service for ProofChain
// Comprehensive NFT minting for completed audit results

import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { uploadJSONToIPFS } from "@/lib/storage-service";

// Import contract artifacts
const AuditResultNFTArtifact = require("../artifacts/contracts/AuditResultNFT.sol/AuditResultNFT.json");

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

export interface AuditResultData {
  // Audit Request Information
  auditRequestId: string;
  projectName: string;
  projectDescription: string;
  complexity: string;
  estimatedDuration: string;
  proposedPrice: number;
  developerWallet: string;
  githubUrl: string;
  repositoryHash: string;
  requestNftId?: string;
  
  // Auditor Information
  auditorWallet: string;
  auditorName: string;
  acceptedPrice: number;
  startDate: string;
  estimatedCompletionDate: string;
  
  // Audit Results
  contractHash: string;
  findings: any[];
  vulnerabilities: any[];
  auditNotes: string;
  staticAnalysisReports: any[];
  evidenceFiles: any[];
  completionDate: string;
  
  // IPFS Data
  ipfsHash: string;
  evidenceFileHashes: string[];
}

export interface AuditResultNFTMintResult {
  success: boolean;
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

// Upload comprehensive audit result metadata to IPFS
export async function uploadAuditResultMetadataToIPFS(data: AuditResultData): Promise<string> {
  try {
    console.log("📝 Uploading comprehensive audit result metadata to IPFS...");
    
    const metadata = {
      name: `Audit Result Certificate: ${data.projectName}`,
      description: `Comprehensive audit result certificate for ${data.projectName} - A complete security audit report containing findings, vulnerabilities, and evidence stored on IPFS.`,
      image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Audit+Result+Certificate",
      external_url: data.githubUrl,
      
      // Main Audit Result Information
      audit_result: {
        audit_request_id: data.auditRequestId,
        project_name: data.projectName,
        project_description: data.projectDescription,
        completion_date: data.completionDate,
        auditor_wallet: data.auditorWallet,
        auditor_name: data.auditorName,
        status: "completed",
        type: "comprehensive_audit_result"
      },
      
      // Original Audit Request Details
      original_audit_request: {
        project_name: data.projectName,
        description: data.projectDescription,
        github_url: data.githubUrl,
        repository_hash: data.repositoryHash,
        developer_wallet: data.developerWallet,
        complexity: data.complexity,
        estimated_duration: data.estimatedDuration,
        proposed_price: data.proposedPrice,
        request_nft_id: data.requestNftId
      },
      
      // Auditor Information
      auditor_info: {
        wallet: data.auditorWallet,
        name: data.auditorName,
        accepted_price: data.acceptedPrice,
        start_date: data.startDate,
        estimated_completion_date: data.estimatedCompletionDate,
        actual_completion_date: data.completionDate
      },
      
      // Audit Results Summary
      audit_results_summary: {
        total_findings: data.findings.length,
        total_vulnerabilities: data.vulnerabilities.filter((v: any) => v.checked).length,
        severity_breakdown: {
          critical: data.findings.filter((f: any) => f.severity === "critical").length,
          high: data.findings.filter((f: any) => f.severity === "high").length,
          medium: data.findings.filter((f: any) => f.severity === "medium").length,
          low: data.findings.filter((f: any) => f.severity === "low").length,
        },
        contract_hash: data.contractHash,
        audit_notes: data.auditNotes,
        static_analysis_reports: data.staticAnalysisReports.length,
        evidence_files: data.evidenceFiles.length
      },
      
      // IPFS Evidence Package
      ipfs_evidence: {
        main_evidence_hash: data.ipfsHash,
        evidence_file_hashes: data.evidenceFileHashes,
        total_evidence_files: data.evidenceFileHashes.length,
        evidence_package_url: `https://ipfs.io/ipfs/${data.ipfsHash}`,
        individual_files: data.evidenceFileHashes.map(hash => `https://ipfs.io/ipfs/${hash}`)
      },
      
      // Detailed Findings (first 10 for metadata, full list in IPFS)
      detailed_findings: data.findings.slice(0, 10).map((finding: any) => ({
        title: finding.title,
        severity: finding.severity,
        category: finding.category,
        file_name: finding.fileName,
        line_number: finding.lineNumber,
        description: finding.description.substring(0, 200) + "..."
      })),
      
      // Platform Integration
      platform_info: {
        platform: "ProofChain",
        ecosystem: "ZKP Smart Contract Auditing",
        network: "ApeChain Testnet",
        chain_id: 33111,
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
          trait_type: "Auditor Name",
          value: data.auditorName
        },
        {
          trait_type: "Total Findings",
          value: data.findings.length.toString()
        },
        {
          trait_type: "Critical Findings",
          value: data.findings.filter((f: any) => f.severity === "critical").length.toString()
        },
        {
          trait_type: "High Findings",
          value: data.findings.filter((f: any) => f.severity === "high").length.toString()
        },
        {
          trait_type: "Medium Findings",
          value: data.findings.filter((f: any) => f.severity === "medium").length.toString()
        },
        {
          trait_type: "Low Findings",
          value: data.findings.filter((f: any) => f.severity === "low").length.toString()
        },
        {
          trait_type: "Total Vulnerabilities",
          value: data.vulnerabilities.filter((v: any) => v.checked).length.toString()
        },
        {
          trait_type: "Complexity",
          value: data.complexity
        },
        {
          trait_type: "Accepted Price",
          value: `$${data.acceptedPrice}`
        },
        {
          trait_type: "Completion Date",
          value: new Date(data.completionDate).toLocaleDateString()
        },
        {
          trait_type: "Contract Hash",
          value: data.contractHash
        },
        {
          trait_type: "IPFS Evidence Hash",
          value: data.ipfsHash
        },
        {
          trait_type: "Platform",
          value: "ProofChain"
        },
        {
          trait_type: "Network",
          value: "ApeChain Testnet"
        },
        {
          trait_type: "Certificate Type",
          value: "Comprehensive Audit Result"
        }
      ]
    };

    // Upload to real IPFS
    const result = await uploadJSONToIPFS(metadata, `audit-result-${data.projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`);
    const ipfsUri = `ipfs://${result.ipfsHash}`;
    
    console.log("✅ Comprehensive audit result metadata uploaded to IPFS:", ipfsUri);
    console.log("   IPFS Hash:", result.ipfsHash);
    console.log("   Gateway URL:", result.gatewayUrl);
    return ipfsUri;
  } catch (error) {
    console.error("❌ Error uploading audit result metadata to IPFS:", error);
    throw error;
  }
}

// Deploy Audit Result NFT contract using connected wallet
export async function deployAuditResultNFTContractClient(
  projectName: string,
  auditorWallet: string,
  connectedAccount: any
): Promise<{ address: string; name: string; symbol: string; explorerUrl: string }> {
  try {
    console.log("🎨 Deploying Audit Result NFT contract using connected wallet...");
    
    const nftName = `${projectName} Audit Result Certificate`;
    const nftSymbol = `${projectName.substring(0, 4).toUpperCase()}ARC`;
    
    console.log("📋 Audit Result NFT Contract parameters:", {
      nftName,
      nftSymbol,
      auditorWallet,
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
      bytecode: AuditResultNFTArtifact.bytecode,
      abi: AuditResultNFTArtifact.abi,
      constructorParams: {
        name: nftName,
        symbol: nftSymbol,
        initialOwner: auditorWallet,
      },
    });
    
    console.log("✅ Audit Result NFT contract deployed:", contractAddress);
    
    return {
      address: contractAddress,
      name: nftName,
      symbol: nftSymbol,
      explorerUrl: `https://curtis.explorer.caldera.xyz/address/${contractAddress}`
    };
  } catch (error) {
    console.error("❌ Error deploying Audit Result NFT contract:", error);
    throw error;
  }
}

// Mint Audit Result NFT using connected wallet
export async function mintAuditResultNFTClient(
  nftContractAddress: string,
  metadataUri: string,
  auditorWallet: string,
  connectedAccount: any
): Promise<{ tokenId: string; transactionHash: string; metadataUri: string; explorerUrl: string }> {
  try {
    console.log("🎯 Minting Audit Result NFT using connected wallet...");
    
    console.log("📋 Audit Result NFT Minting parameters:", {
      nftContractAddress,
      auditorWallet,
      metadataUri,
      connectedAccount: connectedAccount.address,
      chainId: apechainTestnet.id
    });
    
    // Validate contract address format
    if (!nftContractAddress || !nftContractAddress.startsWith('0x') || nftContractAddress.length !== 42) {
      throw new Error(`Invalid contract address: ${nftContractAddress}`);
    }
    
    // Validate auditor wallet address format
    if (!auditorWallet || !auditorWallet.startsWith('0x') || auditorWallet.length !== 42) {
      throw new Error(`Invalid auditor wallet address: ${auditorWallet}`);
    }
    
    // Get the NFT contract with real ABI
    const nftContract = getContract({
      address: nftContractAddress,
      chain: apechainTestnet,
      client,
      abi: AuditResultNFTArtifact.abi,
    });
    
    console.log("📝 Audit Result NFT Minting account details:", {
      address: connectedAccount.address,
      isOwner: connectedAccount.address.toLowerCase() === auditorWallet.toLowerCase()
    });
    
    // Check if the minting account is the same as the auditor wallet (contract owner)
    if (connectedAccount.address.toLowerCase() !== auditorWallet.toLowerCase()) {
      console.warn("⚠️  Warning: Connected account is different from auditor wallet (contract owner)");
      console.warn(`   Connected Account: ${connectedAccount.address}`);
      console.warn(`   Auditor Wallet (Contract Owner): ${auditorWallet}`);
      console.warn("   This will likely cause 'OwnableUnauthorizedAccount' error");
      console.warn("   Solution: Use the same wallet for both connection and as auditor wallet");
    }
    
    // Prepare the mint transaction using real ABI
    const mintTransaction = prepareContractCall({
      contract: nftContract,
      method: "safeMint",
      params: [auditorWallet, metadataUri],
    });
    
    // Send and confirm the transaction using the connected account
    const receipt = await sendAndConfirmTransaction({
      transaction: mintTransaction,
      account: connectedAccount,
    });
    
    // Extract token ID from transaction logs
    // For ERC-721, we can get the token ID from the transaction receipt
    let tokenId = "0"; // Default fallback
    
    try {
      // Try to get the token ID from the transaction receipt
      console.log("🔍 Transaction receipt logs:", receipt.logs);
      
      if (receipt.logs && receipt.logs.length > 0) {
        // Look for Transfer event (indexed topics: [Transfer, from, to, tokenId])
        const transferLog = receipt.logs.find(log => 
          log.topics && log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        );
        
        console.log("🔍 Transfer log found:", transferLog);
        
        if (transferLog && transferLog.topics && transferLog.topics.length >= 4) {
          // Token ID is the 4th topic (index 3)
          const tokenIdHex = transferLog.topics[3];
          tokenId = parseInt(tokenIdHex, 16).toString();
          console.log("🔍 Extracted token ID:", tokenId, "from hex:", tokenIdHex);
        }
      }
    } catch (error) {
      console.warn("Could not extract token ID from logs, using fallback:", error);
    }
    
    console.log("✅ Audit Result NFT minted successfully!");
    console.log("   Token ID:", tokenId);
    console.log("   Transaction Hash:", receipt.transactionHash);
    console.log("   Minted by:", connectedAccount.address);
    console.log("   Minted to:", auditorWallet);
    
    return {
      tokenId: tokenId,
      transactionHash: receipt.transactionHash,
      metadataUri: metadataUri,
      explorerUrl: `https://curtis.explorer.caldera.xyz/tx/${receipt.transactionHash}`
    };
  } catch (error) {
    console.error("❌ Error minting Audit Result NFT:", error);
    console.error("💡 Troubleshooting tips:");
    console.error("   1. Ensure the connected account is the contract owner");
    console.error("   2. Check that the contract was deployed with the correct owner");
    console.error("   3. Verify the connected wallet has sufficient gas");
    console.error("   4. Make sure you're connected to the correct network (ApeChain testnet)");
    throw error;
  }
}

// Main function to create audit result NFT using connected wallet
export async function createAuditResultNFTClient(
  data: AuditResultData,
  connectedAccount: any
): Promise<AuditResultNFTMintResult> {
  try {
    console.log("🚀 Starting audit result NFT creation with connected wallet...");
    console.log("Project:", data.projectName);
    console.log("Auditor:", data.auditorWallet);
    console.log("Connected Account:", connectedAccount.address);

    // 1. Upload comprehensive metadata to IPFS
    console.log("\n📝 Step 1: Uploading comprehensive audit result metadata to IPFS...");
    const metadataUri = await uploadAuditResultMetadataToIPFS(data);

    // 2. Deploy Audit Result NFT contract
    console.log("\n🎨 Step 2: Deploying Audit Result NFT contract...");
    const nftContract = await deployAuditResultNFTContractClient(data.projectName, data.auditorWallet, connectedAccount);

    // 3. Mint Audit Result NFT
    console.log("\n🎯 Step 3: Minting Audit Result NFT...");
    const nftMintResult = await mintAuditResultNFTClient(nftContract.address, metadataUri, data.auditorWallet, connectedAccount);

    console.log("\n🎉 Audit result NFT creation process completed!");

    return {
      success: true,
      nftContract,
      nftMintResult,
    };
  } catch (error: any) {
    console.error("❌ Error creating audit result NFT with connected wallet:", error);
    return { success: false, error: error.message };
  }
}
