import { NextRequest, NextResponse } from "next/server";
import { 
  fetchContractMetadataFromIPFS, 
  fetchContractMetadataFromURI, 
  getContractsByWallet, 
  searchContractsByDeveloper 
} from "@/lib/ipfs-contract-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("wallet");
    const nftContract = searchParams.get("nftContract");
    const tokenId = searchParams.get("tokenId");
    const ipfsUri = searchParams.get("ipfsUri");
    const searchType = searchParams.get("type") || "wallet"; // wallet, nft, uri, developer

    console.log("[v0] Contracts API called with params:", {
      walletAddress,
      nftContract,
      tokenId,
      ipfsUri,
      searchType
    });

    if (!walletAddress && !nftContract && !ipfsUri) {
      return NextResponse.json({ 
        error: "Either wallet address, NFT contract, or IPFS URI is required" 
      }, { status: 400 });
    }

    let contracts = [];

    try {
      switch (searchType) {
        case "nft":
          if (nftContract && tokenId) {
            console.log("[v0] Fetching contract metadata from NFT...");
            const contractInfo = await fetchContractMetadataFromIPFS(nftContract, tokenId);
            if (contractInfo) {
              contracts = [contractInfo];
            }
          } else {
            return NextResponse.json({ 
              error: "NFT contract address and token ID are required for NFT search" 
            }, { status: 400 });
          }
          break;

        case "uri":
          if (ipfsUri) {
            console.log("[v0] Fetching contract metadata from IPFS URI...");
            const metadata = await fetchContractMetadataFromURI(ipfsUri);
            if (metadata) {
              contracts = [{
                contractAddress: "Unknown",
                contractType: metadata.contract_type || "Custom",
                name: metadata.name || "Unknown Contract",
                symbol: metadata.symbol || "UNK",
                metadata: metadata,
                ipfsUri: ipfsUri,
                explorerUrl: "",
                tokenId: undefined,
                owner: undefined,
              }];
            }
          } else {
            return NextResponse.json({ 
              error: "IPFS URI is required for URI search" 
            }, { status: 400 });
          }
          break;

        case "developer":
          if (walletAddress) {
            console.log("[v0] Searching contracts by developer wallet...");
            contracts = await searchContractsByDeveloper(walletAddress);
          } else {
            return NextResponse.json({ 
              error: "Wallet address is required for developer search" 
            }, { status: 400 });
          }
          break;

        case "wallet":
        default:
          if (walletAddress) {
            console.log("[v0] Fetching contracts by wallet address...");
            contracts = await getContractsByWallet(walletAddress);
          } else {
            return NextResponse.json({ 
              error: "Wallet address is required for wallet search" 
            }, { status: 400 });
          }
          break;
      }

      console.log(`[v0] Found ${contracts.length} contracts`);

      return NextResponse.json({
        success: true,
        contracts: contracts,
        count: contracts.length,
        searchType: searchType,
        searchParams: {
          walletAddress,
          nftContract,
          tokenId,
          ipfsUri
        }
      });

    } catch (error) {
      console.error("[v0] Error fetching contracts:", error);
      return NextResponse.json({
        success: false,
        error: "Failed to fetch contract information",
        details: error instanceof Error ? error.message : "Unknown error",
        contracts: [],
        count: 0
      });
    }

  } catch (error) {
    console.error("[v0] Contracts API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        contracts: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
