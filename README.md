# ProofChain - ZKP Smart Contract Auditing Platform

A privacy-first smart contract auditing marketplace powered by Zero-Knowledge Proofs, built on ApeChain with comprehensive blockchain integration.

## 🚀 Overview

ProofChain is a revolutionary platform that connects smart contract developers with security auditors through a decentralized marketplace. The platform ensures complete privacy and anonymity while providing cryptographic proof of audit quality through Zero-Knowledge Proofs (ZKP).

### Key Features

- **🔒 Privacy-First**: Complete anonymity for developers and auditors
- **⛓️ Blockchain Integration**: Built on ApeChain with smart contract automation
- **🎯 AI-Powered Estimation**: GPT-4 powered audit complexity and pricing estimation
- **📊 Comprehensive Dashboard**: Real-time tracking of projects, contracts, and assets
- **🖼️ NFT Certificates**: Immutable audit request and completion certificates
- **💾 IPFS Storage**: Decentralized storage for audit reports and metadata
- **🔐 ZKP Verification**: Cryptographic proof of audit quality without revealing details

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: ApeChain, Thirdweb SDK, Ethers.js
- **Smart Contracts**: Solidity, OpenZeppelin
- **Storage**: IPFS (InterPlanetary File System)
- **AI**: OpenAI GPT-4 API
- **Authentication**: Thirdweb Auth
- **Deployment**: Vercel

### Core Components

1. **Web Application** (`app/`)
   - Dashboard for project management
   - Upload system for audit requests
   - Auditor marketplace
   - Verification tools

2. **Smart Contracts** (`contracts/`)
   - `AuditRequestNFT.sol`: ERC-721 for audit requests
   - `ProofChainToken.sol`: ERC-20 platform token

3. **API Layer** (`app/api/`)
   - RESTful endpoints for all platform operations
   - Integration with Supabase, IPFS, and blockchain

4. **Services** (`lib/`)
   - Database services (Supabase)
   - Blockchain services (Thirdweb)
   - AI estimation services
   - IPFS storage services

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Thirdweb account
- OpenAI API key
- ApeChain testnet access

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# ApeChain Configuration
NEXT_PUBLIC_CHAIN_ID=33139
NEXT_PUBLIC_CHAIN_NAME=ApeChain Testnet
NEXT_PUBLIC_RPC_URL=https://rpc-testnet.apechain.io

# Optional: IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
\`\`\`

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd v0-proof-chain-prototype
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Set up Supabase database**
   \`\`\`bash
   # Run the SQL schema in your Supabase SQL Editor
   cat SUPABASE_DATABASE_SCHEMA.sql
   \`\`\`

4. **Deploy smart contracts** (optional for development)
   \`\`\`bash
   npx hardhat compile
   npx hardhat run scripts/deploy-platform-contracts.js --network apechain-testnet
   \`\`\`

5. **Start development server**
   \`\`\`bash
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### For Developers

1. **Connect Wallet**: Use Thirdweb to connect your wallet
2. **Submit Audit Request**: Upload your smart contract repository
3. **AI Estimation**: Get automated complexity and pricing analysis
4. **Track Progress**: Monitor your audit requests in the dashboard
5. **Receive Results**: Get cryptographically verified audit reports

### For Auditors

1. **Browse Available Audits**: View anonymized audit requests
2. **Accept Projects**: Claim audit requests and mint ownership NFTs
3. **Conduct Audits**: Perform security analysis with provided tools
4. **Submit Results**: Upload findings with ZKP verification
5. **Get Paid**: Receive payments in platform tokens

## 🔧 Development

### Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Developer dashboard
│   ├── upload/            # Audit request submission
│   ├── audits/            # Auditor marketplace
│   └── help/              # Documentation and help
├── components/            # Reusable UI components
├── lib/                   # Core services and utilities
├── contracts/             # Smart contracts
├── public/                # Static assets
└── scripts/               # Deployment and utility scripts
\`\`\`

### Key Services

- **`supabase-audit-service.ts`**: Database operations
- **`thirdweb-contracts.ts`**: Blockchain interactions
- **`enhanced-gpt-service.ts`**: AI-powered analysis
- **`ipfs-service.ts`**: Decentralized storage

### API Endpoints

- `POST /api/submit-audit`: Submit new audit request
- `GET /api/dashboard-supabase`: Get dashboard data
- `POST /api/estimate-audit`: AI-powered audit estimation
- `POST /api/accept-audit`: Accept audit request
- `GET /api/contracts`: Get smart contract data

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide


## 🆘 Support

For support and questions:
- Review the [Architecture Documentation](./ARCHITECTURE.md)
- Open an issue on GitHub

## 🔮 Roadmap

- [ ] Multi-chain support (Ethereum, Polygon, BSC)
- [ ] Advanced ZKP implementations
- [ ] Mobile application
- [ ] Governance token integration
- [ ] Automated audit tools
- [ ] Reputation system enhancements

---
