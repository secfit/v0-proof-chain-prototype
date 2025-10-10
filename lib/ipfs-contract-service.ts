// IPFS Contract Metadata Service
// Retrieves contract information from IPFS based on wallet addresses and NFT metadata

import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { getNFT } from "thirdweb/extensions/erc721";

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
});

// ApeChain testnet configuration
const apechainTestnet = defineChain({
  id: 33111,
  name: "ApeChain Testnet",
  rpc: process.env.NEXT_PUBLIC_APECHAIN_RPC_URL || "https://curtis.rpc.caldera.xyz/http",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "ApeChain Explorer",
      url: process.env.NEXT_PUBLIC_APECHAIN_EXPLORER || "https://curtis.explorer.caldera.xyz",
    },
  ],
});

export interface ContractMetadata {
  contractAddress: string;
  contractType: "ERC20" | "ERC721" | "ERC1155" | "Custom";
  name: string;
  symbol: string;
  description: string;
  image?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  developer_info?: {
    wallet_address: string;
    project_name: string;
    github_repository: string;
    repository_hash: string;
    complexity_level: string;
    estimated_duration: string;
    proposed_price: string;
    auditor_count: string;
    project_tags: string[];
    created_at: string;
    platform: string;
    network: string;
    contract_type: string;
    status: string;
  };
  external_url?: string;
  background_color?: string;
}

export interface ContractInfo {
  contractAddress: string;
  contractType: string;
  name: string;
  symbol: string;
  metadata: ContractMetadata;
  ipfsUri: string;
  explorerUrl: string;
  tokenId?: string;
  owner?: string;
}

/**
 * Fetch contract metadata from IPFS using NFT contract and token ID
 */
export async function fetchContractMetadataFromIPFS(
  nftContractAddress: string,
  tokenId: string
): Promise<ContractInfo | null> {
  try {
    console.log(`[IPFS] Fetching metadata for NFT ${tokenId} from contract ${nftContractAddress}`);

    // Get the NFT contract (using a generic ERC721 ABI for metadata fetching)
    const nftContract = getContract({
      address: nftContractAddress,
      chain: apechainTestnet,
      client,
    });

    // Get NFT metadata
    const nft = await getNFT({
      contract: nftContract,
      tokenId: tokenId,
    });

    if (!nft.metadata) {
      console.error(`[IPFS] No metadata found for NFT ${tokenId}`);
      return null;
    }

    // Parse the metadata
    const metadata = nft.metadata as ContractMetadata;
    
    // Extract contract information from metadata
    const contractInfo: ContractInfo = {
      contractAddress: nftContractAddress,
      contractType: metadata.contract_type || "Custom",
      name: metadata.name || "Unknown Contract",
      symbol: metadata.symbol || "UNK",
      metadata: metadata,
      ipfsUri: nft.metadataUri || "",
      explorerUrl: `${apechainTestnet.blockExplorers?.[0]?.url || "https://curtis.explorer.caldera.xyz"}/address/${nftContractAddress}`,
      tokenId: tokenId,
      owner: nft.owner,
    };

    console.log(`[IPFS] Successfully fetched contract metadata:`, {
      name: contractInfo.name,
      type: contractInfo.contractType,
      developer: metadata.developer_info?.wallet_address,
    });

    return contractInfo;
  } catch (error) {
    console.error(`[IPFS] Error fetching contract metadata:`, error);
    return null;
  }
}

/**
 * Fetch contract metadata directly from IPFS URI
 */
export async function fetchContractMetadataFromURI(ipfsUri: string): Promise<ContractMetadata | null> {
  try {
    console.log(`[IPFS] Fetching metadata from URI: ${ipfsUri}`);

    // Convert IPFS URI to HTTP URL
    const httpUrl = ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    
    const response = await fetch(httpUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metadata = await response.json() as ContractMetadata;
    
    console.log(`[IPFS] Successfully fetched metadata from IPFS:`, {
      name: metadata.name,
      type: metadata.contract_type,
      developer: metadata.developer_info?.wallet_address,
    });

    return metadata;
  } catch (error) {
    console.error(`[IPFS] Error fetching metadata from URI:`, error);
    return null;
  }
}

/**
 * Get all contracts associated with a wallet address
 */
export async function getContractsByWallet(walletAddress: string): Promise<ContractInfo[]> {
  try {
    console.log(`[IPFS] Fetching contracts for wallet: ${walletAddress}`);

    // This would typically involve:
    // 1. Querying the blockchain for NFT ownership
    // 2. Getting NFT metadata from IPFS
    // 3. Extracting contract information

    // For now, we'll return a mock implementation
    // In a real implementation, you would:
    // - Query the NFT contract for tokens owned by the wallet
    // - Fetch metadata for each token
    // - Return the contract information

    const contracts: ContractInfo[] = [];

    // Example: If we have known NFT contract addresses, we could query them
    const knownNftContracts = [
      process.env.NEXT_PUBLIC_AUDIT_REQUEST_NFT_CONTRACT,
      // Add other known NFT contract addresses
    ].filter(Boolean);

    for (const nftContractAddress of knownNftContracts) {
      if (!nftContractAddress) continue;

      try {
        // In a real implementation, you would query for tokens owned by the wallet
        // For now, we'll create a mock response
        const mockContractInfo: ContractInfo = {
          contractAddress: nftContractAddress,
          contractType: "ERC721",
          name: "Audit Request NFT",
          symbol: "AUDIT",
          metadata: {
            contractAddress: nftContractAddress,
            contractType: "ERC721",
            name: "Audit Request NFT",
            symbol: "AUDIT",
            description: "NFT representing an audit request",
            attributes: [
              { trait_type: "Developer Wallet", value: walletAddress },
              { trait_type: "Status", value: "Available" },
            ],
            developer_info: {
              wallet_address: walletAddress,
              project_name: "Sample Project",
              github_repository: "https://github.com/example/repo",
              repository_hash: "sample_hash",
              complexity_level: "Medium",
              estimated_duration: "5 days",
              proposed_price: "1500",
              auditor_count: "1",
              project_tags: ["solidity", "defi"],
              created_at: new Date().toISOString(),
              platform: "ProofChain",
              network: "ApeChain Testnet",
              contract_type: "Audit Request NFT",
              status: "Available"
            }
          },
          ipfsUri: `ipfs://QmSampleHash${Date.now()}`,
          explorerUrl: `${apechainTestnet.blockExplorers?.[0]?.url || "https://curtis.explorer.caldera.xyz"}/address/${nftContractAddress}`,
          tokenId: "1",
          owner: walletAddress,
        };

        contracts.push(mockContractInfo);
      } catch (error) {
        console.error(`[IPFS] Error processing contract ${nftContractAddress}:`, error);
      }
    }

    console.log(`[IPFS] Found ${contracts.length} contracts for wallet ${walletAddress}`);
    return contracts;
  } catch (error) {
    console.error(`[IPFS] Error fetching contracts by wallet:`, error);
    return [];
  }
}

/**
 * Search for contracts by developer wallet address in IPFS metadata
 */
export async function searchContractsByDeveloper(walletAddress: string): Promise<ContractInfo[]> {
  try {
    console.log(`[IPFS] Searching contracts by developer wallet: ${walletAddress}`);

    // This is a simplified implementation
    // In a real scenario, you would:
    // 1. Have an index of IPFS hashes or contract addresses
    // 2. Fetch metadata from each IPFS hash
    // 3. Filter by developer wallet address
    // 4. Return matching contracts

    const contracts: ContractInfo[] = [];

    // For demonstration, we'll create a mock contract that matches the wallet
    const mockContractInfo: ContractInfo = {
      contractAddress: "0x1234567890123456789012345678901234567890",
      contractType: "ERC721",
      name: "Audit Request NFT",
      symbol: "AUDIT",
      metadata: {
        contractAddress: "0x1234567890123456789012345678901234567890",
        contractType: "ERC721",
        name: "Audit Request NFT",
        symbol: "AUDIT",
        description: "NFT representing an audit request for a smart contract project",
        image: "https://via.placeholder.com/400x400/6366f1/ffffff?text=Audit+Request",
        attributes: [
          { trait_type: "Project Name", value: "Sample DeFi Protocol" },
          { trait_type: "Developer Wallet", value: walletAddress },
          { trait_type: "Complexity", value: "Medium" },
          { trait_type: "Proposed Price", value: "1500" },
          { trait_type: "Status", value: "Available" },
          { trait_type: "Created At", value: new Date().toISOString() },
        ],
        developer_info: {
          wallet_address: walletAddress,
          project_name: "Sample DeFi Protocol",
          github_repository: "https://github.com/example/defi-protocol",
          repository_hash: "abc123def456",
          complexity_level: "Medium",
          estimated_duration: "5 days",
          proposed_price: "1500",
          auditor_count: "1",
          project_tags: ["solidity", "defi", "ethereum"],
          created_at: new Date().toISOString(),
          platform: "ProofChain",
          network: "ApeChain Testnet",
          contract_type: "Audit Request NFT",
          status: "Available"
        },
        external_url: "https://github.com/example/defi-protocol",
        background_color: "6366f1"
      },
      ipfsUri: `ipfs://QmSampleHash${Date.now()}`,
      explorerUrl: `${apechainTestnet.blockExplorers?.[0]?.url || "https://curtis.explorer.caldera.xyz"}/address/0x1234567890123456789012345678901234567890`,
      tokenId: "1",
      owner: walletAddress,
    };

    contracts.push(mockContractInfo);

    console.log(`[IPFS] Found ${contracts.length} contracts for developer ${walletAddress}`);
    return contracts;
  } catch (error) {
    console.error(`[IPFS] Error searching contracts by developer:`, error);
    return [];
  }
}
