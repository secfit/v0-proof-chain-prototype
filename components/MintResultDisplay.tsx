"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Copy, ArrowRight } from "lucide-react";

interface ContractInfo {
  address: string;
  name: string;
  symbol: string;
  explorerUrl: string;
}

interface NFTMintInfo {
  tokenId: string;
  transactionHash: string;
  metadataUri: string;
  explorerUrl: string;
}

interface MintResultDisplayProps {
  tokenContract: ContractInfo;
  nftContract: ContractInfo;
  nftMint: NFTMintInfo;
  onContinue: () => void;
}

export function MintResultDisplay({ 
  tokenContract, 
  nftContract, 
  nftMint, 
  onContinue 
}: MintResultDisplayProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          🎉 Audit Request Created Successfully!
        </h1>
        <p className="text-muted-foreground">
          Your smart contracts have been deployed and NFT has been minted on ApeChain testnet
        </p>
      </div>

      {/* Contract Information Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* ERC20 Token Contract */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              ERC20 Token Contract
            </CardTitle>
            <CardDescription>
              Payment token for this audit request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Name</label>
              <p className="font-mono text-sm">{tokenContract.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Symbol</label>
              <Badge variant="secondary">{tokenContract.symbol}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm flex-1">{formatAddress(tokenContract.address)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(tokenContract.address, "token")}
                >
                  {copiedAddress === "token" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(tokenContract.explorerUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ERC721 NFT Contract */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              ERC721 NFT Contract
            </CardTitle>
            <CardDescription>
              NFT collection for this audit request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Name</label>
              <p className="font-mono text-sm">{nftContract.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Symbol</label>
              <Badge variant="secondary">{nftContract.symbol}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm flex-1">{formatAddress(nftContract.address)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(nftContract.address, "nft")}
                >
                  {copiedAddress === "nft" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(nftContract.explorerUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NFT Mint Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Minted NFT Details
          </CardTitle>
          <CardDescription>
            Your audit request NFT has been successfully minted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Token ID</label>
              <p className="font-mono text-lg font-bold text-primary">#{nftMint.tokenId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm flex-1">{formatAddress(nftMint.transactionHash)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(nftMint.transactionHash, "tx")}
                >
                  {copiedAddress === "tx" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(nftMint.explorerUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Metadata URI</label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm flex-1 break-all">{nftMint.metadataUri}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(nftMint.metadataUri, "metadata")}
              >
                {copiedAddress === "metadata" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-green-600">✅ Deployment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">2</div>
              <div className="text-sm text-muted-foreground">Smart Contracts Deployed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">NFT Minted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">Metadata Created</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          onClick={onContinue}
          size="lg"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
