# ProofChain - Privacy-First Smart Contract Auditing Platform

ProofChain is a decentralized marketplace for smart contract security audits that uses Zero-Knowledge Proofs (ZKP) to maintain complete anonymity between developers, auditors, and investors while ensuring cryptographic verification of all audit results on ApeChain.

## 🎯 Core Concept
 
ProofChain solves the trust problem in smart contract auditing by:
- **Privacy**: Developers submit contracts anonymously with AI-powered sanitization
- **Verification**: Auditors generate ZK proofs for their findings without revealing private details
- **Transparency**: All audit results are cryptographically verified on-chain
- **Anonymity**: Complete separation between developers and auditors throughout the process

## 🏗️ Architecture

### System Components

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        ProofChain                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Developer  │    │   Auditor    │    │   Investor   │  │
│  │   Portal     │    │   Portal     │    │   Portal     │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                    │           │
│         └───────────────────┼────────────────────┘           │
│                             │                                │
│  ┌──────────────────────────┴─────────────────────────────┐ │
│  │              Core Platform Layer                        │ │
│  │  • AI Sanitization Engine                              │ │
│  │  • ZKP Proof Generator                                 │ │
│  │  • Smart Contract Escrow                               │ │
│  │  • Reputation System                                   │ │
│  └──────────────────────────┬─────────────────────────────┘ │
│                             │                                │
│  ┌──────────────────────────┴─────────────────────────────┐ │
│  │           ApeChain Blockchain Layer                     │ │
│  │  • On-chain Verification                               │ │
│  │  • Commitment Hash Storage                             │ │
│  │  • Payment Settlement                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Data Flow

1. **Upload Phase**
   - Developer uploads smart contract
   - AI sanitizes/obfuscates sensitive code
   - Commitment hash anchored on-chain
   - Contract distributed to selected auditors

2. **Audit Phase**
   - Auditors receive anonymized contracts
   - AI negotiates pricing
   - Auditors analyze for 13 vulnerability categories
   - ZK proofs generated for findings

3. **Verification Phase**
   - Proofs submitted with contract hash only
   - On-chain verification via ApeChain
   - Results published anonymously
   - Payments released from escrow

## 📁 Project Structure

\`\`\`
proofchain-prototype/
├── app/                          # Next.js App Router pages
│   ├── audits/                   # Auditor job marketplace
│   ├── auditor/                  # Auditor workspace
│   │   └── job/[id]/            # Individual audit job interface
│   ├── blockchain/               # Blockchain explorer & wallet
│   ├── dashboard/                # Developer dashboard
│   ├── help/                     # Interactive help & documentation
│   ├── marketplace/              # Auditor discovery & matching
│   ├── upload/                   # Contract upload wizard
│   ├── verification/             # ZKP verification interface
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles & design tokens
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   └── navigation.tsx           # Main navigation component
│
├── lib/                         # Utility functions
│   ├── blockchain.ts            # Blockchain interaction utilities
│   └── utils.ts                 # General utilities (cn, etc.)
│
├── public/                      # Static assets
│   └── *.jpg                    # Images for marketplace
│
└── README.md                    # This file
\`\`\`

## 🔑 Key Features by Section

### Developer Portal (`/dashboard`, `/upload`)
- **Upload Wizard**: Multi-step contract submission with AI sanitization
- **Audit Packages**: Quick ($50), Standard ($75), Deep ($110)
- **Auditor Selection**: Choose 1-3 auditors (price multiplier)
- **Status Tracking**: Real-time audit progress monitoring
- **Report Access**: View findings and ZK proofs

### Auditor Portal (`/audits`, `/auditor`)
- **Job Marketplace**: Browse anonymized contracts
- **AI Negotiation**: Automated price negotiation
- **Vulnerability Analysis**: 13 predefined categories
  - Reentrancy, Integer Overflow, Access Control, etc.
- **ZK Proof Generation**: Create cryptographic evidence
- **Reputation System**: Build trust through verified audits

### Verification System (`/verification`)
- **Proof Verification**: Validate ZK proofs on-chain
- **Blockchain Explorer**: View ApeChain transactions
- **Circuit Library**: Browse available ZKP circuits
- **Public Registry**: Search audits by hash

### Marketplace (`/marketplace`)
- **Auditor Discovery**: Find verified security experts
- **AI Matching**: Automated auditor recommendations
- **Reputation Leaderboard**: Top performers ranking
- **Bidding System**: Competitive pricing

### Blockchain Integration (`/blockchain`)
- **Wallet Connection**: MetaMask integration
- **Transaction Monitoring**: Real-time blockchain activity
- **Smart Contract Interaction**: Direct on-chain operations
- **Network Status**: ApeChain health monitoring

## 🚀 Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd proofchain-prototype
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

4. **Open browser**
\`\`\`
http://localhost:3000
\`\`\`

### Production Deployment

#### Deploy to Vercel (Recommended)

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Deploy via Vercel**
- Click "Publish" button in v0 interface, or
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Deploy automatically

#### Environment Variables (Optional)

For blockchain integration, add these to your Vercel project:

\`\`\`env
NEXT_PUBLIC_APECHAIN_RPC_URL=https://apechain-rpc-url
NEXT_PUBLIC_PROOFCHAIN_CONTRACT_ADDRESS=0x...
\`\`\`

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Blockchain**: ApeChain (EVM-compatible)
- **Cryptography**: Zero-Knowledge Proofs (ZKP)
- **AI**: Contract sanitization & price negotiation
- **Language**: TypeScript

## 🔐 Security Features

1. **AI Sanitization**: Removes sensitive information from contracts
2. **Zero-Knowledge Proofs**: Verify audits without revealing details
3. **On-chain Anchoring**: Immutable commitment hashes
4. **Complete Anonymity**: No direct contact between parties
5. **Escrow System**: Secure payment handling
6. **Reputation Staking**: Economic incentives for honest audits

## 📊 Vulnerability Categories

ProofChain auditors check for 13 critical vulnerability types:

1. Reentrancy Attacks
2. Integer Overflow/Underflow
3. Access Control Issues
4. Unchecked External Calls
5. Denial of Service (DoS)
6. Front-Running Vulnerabilities
7. Timestamp Dependence
8. Gas Limit Issues
9. Delegatecall Injection
10. Uninitialized Storage
11. Logic Errors
12. Oracle Manipulation
13. Flash Loan Attacks

## 🤝 How Components Intersect

### Privacy Layer
- **AI Sanitization** → **Auditor Portal**: Ensures auditors never see developer identity
- **ZK Proofs** → **Verification**: Proves findings without revealing audit details
- **Hash-based IDs** → **All Systems**: No personal information stored

### Economic Layer
- **Upload Wizard** → **Escrow**: Locks payment on submission
- **Auditor Completion** → **Escrow**: Releases payment on verification
- **Reputation System** → **Marketplace**: Influences auditor pricing

### Trust Layer
- **ZK Proofs** → **Blockchain**: Cryptographic verification
- **On-chain Storage** → **Public Registry**: Immutable audit records
- **Reputation Staking** → **Quality Assurance**: Economic incentives

### AI Layer
- **Contract Upload** → **Sanitization**: Automated privacy protection
- **Job Posting** → **Price Negotiation**: Fair market pricing
- **Auditor Selection** → **Matching**: Optimal auditor-contract pairing

## 📖 Learn More

Visit `/help` in the application for an interactive guide covering:
- Complete workflow walkthrough
- Detailed component explanations
- System intersection diagrams
- Best practices for developers and auditors

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
- Visit the `/help` page in the application
- Check the interactive documentation
- Review the architecture diagrams

---

Built with ❤️ for secure, private, and verifiable smart contract auditing
