#!/usr/bin/env node

/**
 * Script to deploy platform contracts for ProofChain
 * This script helps deploy the required platform contracts on ApeChain testnet
 */

const { createThirdwebClient } = require("thirdweb");
const { privateKeyToAccount } = require("thirdweb/wallets");
const { defineChain } = require("thirdweb/chains");
const { deployERC721Contract } = require("thirdweb/deploys");

// Load environment variables
require('dotenv').config({ path: '.env.local' });

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

async function deployPlatformContracts() {
  try {
    console.log("🚀 Starting platform contract deployment...");
    console.log("Chain:", apechainTestnet.name);
    console.log("Account:", account.address);
    console.log("");

    // Deploy Audit Requests Contract
    console.log("📝 Deploying Audit Requests Contract...");
    const auditRequestsContract = await deployERC721Contract({
      client,
      chain: apechainTestnet,
      account,
      type: "NFTCollection",
      name: "ProofChain Audit Requests",
      symbol: "PCAR",
      description: "Platform contract for ProofChain audit request tokens",
    });

    console.log("✅ Audit Requests Contract deployed!");
    console.log("   Address:", auditRequestsContract);
    console.log("   Explorer:", `https://curtis.explorer.caldera.xyz/address/${auditRequestsContract}`);
    console.log("");

    // Deploy Developers Contract
    console.log("👨‍💻 Deploying Developers Contract...");
    const developersContract = await deployERC721Contract({
      client,
      chain: apechainTestnet,
      account,
      type: "NFTCollection",
      name: "ProofChain Developers",
      symbol: "PCD",
      description: "Platform contract for ProofChain developer tokens",
    });

    console.log("✅ Developers Contract deployed!");
    console.log("   Address:", developersContract);
    console.log("   Explorer:", `https://curtis.explorer.caldera.xyz/address/${developersContract}`);
    console.log("");

    // Output environment variables
    console.log("🔧 Update your .env.local file with these addresses:");
    console.log("");
    console.log(`NEXT_PUBLIC_AUDIT_REQUESTS_CONTRACT=${auditRequestsContract}`);
    console.log(`NEXT_PUBLIC_DEVELOPERS_CONTRACT=${developersContract}`);
    console.log("");

    console.log("🎉 Platform contracts deployed successfully!");
    console.log("Next steps:");
    console.log("1. Update your .env.local file with the contract addresses above");
    console.log("2. Restart your development server");
    console.log("3. Test the platform token creation by submitting an audit request");

  } catch (error) {
    console.error("❌ Error deploying platform contracts:", error);
    process.exit(1);
  }
}

// Run the deployment
deployPlatformContracts();
