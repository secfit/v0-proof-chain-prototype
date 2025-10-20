# ProofChain - Privacy-First Smart Contract Auditing Platform

ProofChain is a decentralized marketplace for smart contract security audits that uses Zero-Knowledge Proofs (ZKP) to maintain complete anonymity between developers, auditors, and investors while ensuring cryptographic verification of all audit results on ApeChain.

## 🎯 Core Concept

ProofChain solves the trust problem in smart contract auditing by:
- **Privacy**: Developers submit contracts anonymously with AI-powered sanitization
- **Verification**: Auditors generate ZK proofs for their findings without revealing private details
- **Transparency**: All audit results are cryptographically verified on-chain
- **Anonymity**: Complete separation between developers and auditors throughout the process


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


## 🆘 Support

For issues or questions:
- Visit the `/help` page in the application
- Check the interactive documentation
- Review the architecture diagrams

---
