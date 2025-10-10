// Thirdweb Configuration for ProofChain
// Based on Thirdweb AI guidance for custom chain deployment

import { defineChain, createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";

// ApeChain testnet configuration (corrected based on Thirdweb AI guidance)
export const apechainTestnet = defineChain({
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

// Create the client (use clientId for public/client or secretKey for server)
export const client = createThirdwebClient({ 
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c"
});

// Account configuration for Node.js backends
export const account = privateKeyToAccount({
  client,
  privateKey: process.env.PRIVATE_KEY || "0xabe86c3d7406a74f9b916e70d0b0e2d9ea506de84477759443a4ab41c91775cf",
});
