# ProofChain Architecture Documentation

This document provides a comprehensive overview of the ProofChain platform architecture, including system design, data flow, and technical implementation details.

## 🏗️ System Overview

ProofChain is a decentralized smart contract auditing marketplace built on a modern web3 stack. The platform enables privacy-preserving interactions between developers and auditors while maintaining cryptographic proof of audit quality.

### Core Principles

- **Privacy-First**: Complete anonymity for all participants
- **Decentralized**: Built on blockchain with IPFS storage
- **Transparent**: All interactions are verifiable on-chain
- **Scalable**: Modern architecture supporting high throughput
- **Secure**: Multiple layers of security and verification

## 🎯 High-Level Architecture

\`\`\`mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App] --> B[React Components]
        B --> C[UI Components]
        C --> D[Thirdweb Provider]
    end
    
    subgraph "API Layer"
        E[Next.js API Routes] --> F[Authentication]
        E --> G[Business Logic]
        E --> H[Data Validation]
    end
    
    subgraph "Service Layer"
        I[Supabase Service] --> J[Database Operations]
        K[Thirdweb Service] --> L[Blockchain Operations]
        M[OpenAI Service] --> N[AI Analysis]
        O[IPFS Service] --> P[File Storage]
    end
    
    subgraph "External Services"
        Q[Supabase Database] --> R[PostgreSQL]
        S[ApeChain Network] --> T[Smart Contracts]
        U[OpenAI API] --> V[GPT-4]
        W[IPFS Network] --> X[Distributed Storage]
    end
    
    A --> E
    E --> I
    E --> K
    E --> M
    E --> O
    I --> Q
    K --> S
    M --> U
    O --> W
\`\`\`

## 📱 Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Context + useState/useEffect
- **Web3 Integration**: Thirdweb SDK
- **Authentication**: Thirdweb Auth

### Component Structure

\`\`\`
app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Landing page
├── dashboard/                 # Developer dashboard
│   └── page.tsx              # Comprehensive project overview
├── upload/                    # Audit request submission
│   └── page.tsx              # Multi-step form with AI integration
├── audits/                    # Auditor marketplace
│   └── page.tsx              # Available audit listings
├── help/                      # Documentation and help
│   └── page.tsx              # Architecture and API documentation
└── api/                       # API routes
    ├── submit-audit/         # Submit new audit request
    ├── dashboard-supabase/   # Get dashboard data
    ├── estimate-audit/       # AI-powered estimation
    └── accept-audit/         # Accept audit request
\`\`\`

### Key Components

#### Navigation Component
- Responsive navigation with wallet connection
- User authentication state management
- Mobile-friendly design

#### Dashboard Component
- Real-time data display from Supabase
- Comprehensive project overview
- Interactive charts and statistics
- Multi-tab interface for different data types

#### Upload Component
- Multi-step form with validation
- GitHub repository integration
- AI-powered complexity estimation
- Smart contract deployment

#### Audit Marketplace
- Filterable audit listings
- Real-time status updates
- Auditor acceptance workflow
- Progress tracking

## 🔧 Backend Architecture

### API Design

The backend follows RESTful principles with Next.js API routes:

\`\`\`typescript
// API Route Structure
app/api/
├── submit-audit/route.ts      # POST - Create audit request
├── dashboard-supabase/route.ts # GET - Fetch dashboard data
├── estimate-audit/route.ts    # POST - AI estimation
├── accept-audit/route.ts      # POST - Accept audit
├── contracts/route.ts         # GET - Contract data
└── wallet-data/route.ts       # GET - Wallet information
\`\`\`

### Service Layer Architecture

#### Database Service (`lib/supabase-audit-service.ts`)
\`\`\`typescript
class SupabaseAuditService {
  // Audit Requests
  async createAuditRequest(data: AuditRequestData): Promise<AuditRequest>
  async getAuditRequestsByDeveloper(wallet: string): Promise<AuditRequest[]>
  async updateAuditRequestStatus(id: string, status: string): Promise<void>
  
  // Smart Contracts
  async createSmartContract(data: ContractData): Promise<SmartContract>
  async getAllContractsByWallet(wallet: string): Promise<SmartContract[]>
  
  // NFTs
  async createNFT(data: NFTData): Promise<NFT>
  async getAllNFTsByWallet(wallet: string): Promise<NFT[]>
  
  // IPFS Data
  async createIPFSData(data: IPFSData): Promise<IPFSData>
  async getAllIPFSDataByWallet(wallet: string): Promise<IPFSData[]>
  
  // Developer Profiles
  async getDeveloperProfile(wallet: string): Promise<Developer>
  async updateDeveloperStats(wallet: string, stats: DeveloperStats): Promise<void>
}
\`\`\`

#### Blockchain Service (`lib/thirdweb-contracts.ts`)
\`\`\`typescript
class ThirdwebContractService {
  // NFT Operations
  async mintAuditRequestNFT(data: NFTMintData): Promise<MintResult>
  async mintAuditOwnerNFT(data: OwnerNFTData): Promise<MintResult>
  
  // Token Operations
  async transferTokens(from: string, to: string, amount: BigNumber): Promise<TransactionResult>
  async getTokenBalance(wallet: string): Promise<BigNumber>
  
  // Contract Deployment
  async deployAuditRequestNFT(): Promise<ContractAddress>
  async deployProofChainToken(): Promise<ContractAddress>
}
\`\`\`

#### AI Service (`lib/enhanced-gpt-service.ts`)
\`\`\`typescript
class EnhancedGPTService {
  // Repository Analysis
  async analyzeRepository(githubUrl: string): Promise<RepositoryAnalysis>
  async estimateAuditComplexity(analysis: RepositoryAnalysis): Promise<AuditEstimation>
  
  // Complexity Mapping
  mapComplexityToSupabase(complexity: string): SupabaseComplexity
  
  // Risk Assessment
  async assessRiskFactors(codebase: CodebaseData): Promise<RiskFactor[]>
}
\`\`\`

#### IPFS Service (`lib/ipfs-service.ts`)
\`\`\`typescript
class IPFSService {
  // File Operations
  async uploadFile(file: File): Promise<IPFSHash>
  async uploadJSON(data: object): Promise<IPFSHash>
  async retrieveFile(hash: string): Promise<File>
  
  // Metadata Operations
  async uploadMetadata(metadata: NFTMetadata): Promise<IPFSHash>
  async retrieveMetadata(hash: string): Promise<NFTMetadata>
}
\`\`\`

## 🗄️ Database Architecture

### Supabase Schema Design

The database uses PostgreSQL with the following core tables:

#### Audit Requests Table
\`\`\`sql
CREATE TABLE audit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    project_description TEXT,
    github_url TEXT,
    repository_hash TEXT,
    complexity TEXT CHECK (complexity IN ('Low', 'Medium', 'High', 'Critical')),
    estimated_duration INTEGER,
    proposed_price DECIMAL(10,2),
    auditor_count INTEGER,
    developer_wallet TEXT NOT NULL,
    status TEXT DEFAULT 'Available',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

#### Smart Contracts Table
\`\`\`sql
CREATE TABLE smart_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_request_id UUID REFERENCES audit_requests(id),
    contract_address TEXT NOT NULL,
    contract_type TEXT CHECK (contract_type IN ('ERC20', 'ERC721', 'ERC1155')),
    contract_name TEXT,
    contract_symbol TEXT,
    total_supply BIGINT,
    decimals INTEGER,
    deployment_hash TEXT,
    explorer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

#### NFTs Table
\`\`\`sql
CREATE TABLE nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_request_id UUID REFERENCES audit_requests(id),
    contract_id UUID REFERENCES smart_contracts(id),
    token_id TEXT NOT NULL,
    token_name TEXT,
    token_description TEXT,
    metadata_uri TEXT,
    owner_wallet TEXT NOT NULL,
    mint_transaction_hash TEXT,
    explorer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

#### IPFS Data Table
\`\`\`sql
CREATE TABLE ipfs_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_request_id UUID REFERENCES audit_requests(id),
    nft_id UUID REFERENCES nfts(id),
    ipfs_hash TEXT NOT NULL,
    ipfs_uri TEXT,
    content_type TEXT CHECK (content_type IN ('Metadata', 'Image', 'Document', 'Other')),
    file_size BIGINT,
    related_contract TEXT,
    related_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

#### Developers Table
\`\`\`sql
CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    total_projects INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    reputation_score INTEGER DEFAULT 100,
    first_project_date TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Database Relationships

\`\`\`mermaid
erDiagram
    AUDIT_REQUESTS ||--o{ SMART_CONTRACTS : "has"
    AUDIT_REQUESTS ||--o{ NFTS : "generates"
    AUDIT_REQUESTS ||--o{ IPFS_DATA : "stores"
    SMART_CONTRACTS ||--o{ NFTS : "mints"
    NFTS ||--o{ IPFS_DATA : "references"
    DEVELOPERS ||--o{ AUDIT_REQUESTS : "creates"
    
    AUDIT_REQUESTS {
        uuid id PK
        text project_name
        text project_description
        text github_url
        text complexity
        decimal proposed_price
        text developer_wallet
        text status
        timestamp created_at
    }
    
    SMART_CONTRACTS {
        uuid id PK
        uuid audit_request_id FK
        text contract_address
        text contract_type
        text contract_name
        bigint total_supply
    }
    
    NFTS {
        uuid id PK
        uuid audit_request_id FK
        uuid contract_id FK
        text token_id
        text token_name
        text owner_wallet
        text metadata_uri
    }
    
    IPFS_DATA {
        uuid id PK
        uuid audit_request_id FK
        uuid nft_id FK
        text ipfs_hash
        text content_type
        bigint file_size
    }
    
    DEVELOPERS {
        uuid id PK
        text wallet_address
        integer total_projects
        decimal total_spent
        integer reputation_score
        text status
    }
\`\`\`

## ⛓️ Blockchain Architecture

### Smart Contract Design

#### AuditRequestNFT Contract
\`\`\`solidity
// ERC-721 for audit request certificates
contract AuditRequestNFT is ERC721, Ownable {
    struct AuditRequest {
        string projectName;
        string githubUrl;
        string complexity;
        uint256 proposedPrice;
        address developerWallet;
        uint256 timestamp;
    }
    
    mapping(uint256 => AuditRequest) public auditRequests;
    uint256 public nextTokenId = 1;
    
    function mintAuditRequest(
        address to,
        AuditRequest memory request
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        auditRequests[tokenId] = request;
        return tokenId;
    }
}
\`\`\`

#### ProofChainToken Contract
\`\`\`solidity
// ERC-20 for platform payments
contract ProofChainToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;
    
    constructor() ERC20("ProofChain Token", "PCT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
\`\`\`

### Blockchain Integration Flow

\`\`\`mermaid
sequenceDiagram
    participant D as Developer
    participant F as Frontend
    participant A as API
    participant S as Supabase
    participant T as Thirdweb
    participant B as Blockchain
    
    D->>F: Submit Audit Request
    F->>A: POST /api/submit-audit
    A->>S: Store Request Data
    A->>T: Mint Audit Request NFT
    T->>B: Deploy NFT Contract
    B-->>T: Return Transaction Hash
    T-->>A: Return NFT Data
    A-->>F: Return Success Response
    F-->>D: Show NFT Confirmation
\`\`\`

## 🤖 AI Integration Architecture

### OpenAI GPT-4 Integration

The platform uses GPT-4 for intelligent audit estimation:

\`\`\`typescript
interface RepositoryAnalysis {
  solidityFiles: number;
  totalLines: number;
  complexity: 'Simple' | 'Medium' | 'Complex';
  riskFactors: string[];
  recommendations: string[];
}

interface AuditEstimation {
  complexity: 'Simple' | 'Medium' | 'Complex';
  duration: string;
  durationDays: number;
  price: number;
  minimumPrice: number;
  reasoning: string;
  riskFactors: string[];
  recommendations: string[];
}
\`\`\`

### AI Analysis Flow

\`\`\`mermaid
flowchart TD
    A[GitHub Repository URL] --> B[Fetch Repository Data]
    B --> C[Analyze Solidity Files]
    C --> D[Count Lines of Code]
    D --> E[Identify Risk Factors]
    E --> F[GPT-4 Analysis]
    F --> G[Complexity Assessment]
    G --> H[Price Estimation]
    H --> I[Duration Calculation]
    I --> J[Generate Recommendations]
    J --> K[Return Analysis Results]
\`\`\`

## 📁 IPFS Storage Architecture

### Decentralized Storage Strategy

The platform uses IPFS for storing:
- Audit reports and findings
- NFT metadata
- Repository snapshots
- Verification proofs

### IPFS Integration Flow

\`\`\`mermaid
sequenceDiagram
    participant A as Application
    participant I as IPFS Service
    participant N as IPFS Network
    participant S as Supabase
    
    A->>I: Upload File/Metadata
    I->>N: Pin to IPFS Network
    N-->>I: Return IPFS Hash
    I->>S: Store Hash in Database
    S-->>I: Confirm Storage
    I-->>A: Return IPFS URI
\`\`\`

## 🔐 Security Architecture

### Multi-Layer Security

1. **Frontend Security**
   - Input validation and sanitization
   - XSS protection
   - CSRF tokens
   - Secure authentication

2. **API Security**
   - Rate limiting
   - Input validation
   - Authentication middleware
   - Error handling

3. **Database Security**
   - Row Level Security (RLS)
   - Encrypted connections
   - Access controls
   - Audit logging

4. **Blockchain Security**
   - Smart contract audits
   - Access controls
   - Gas optimization
   - Transaction validation

### Authentication Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant T as Thirdweb
    participant W as Wallet
    participant A as API
    
    U->>F: Connect Wallet
    F->>T: Request Connection
    T->>W: Prompt Wallet Connection
    W-->>T: Return Wallet Address
    T-->>F: Return Auth Token
    F->>A: Include Auth in Requests
    A->>T: Verify Token
    T-->>A: Return User Data
    A-->>F: Return Protected Data
\`\`\`

## 📊 Data Flow Architecture

### Complete System Data Flow

\`\`\`mermaid
flowchart TD
    A[User Action] --> B[Frontend Component]
    B --> C[API Route]
    C --> D[Service Layer]
    D --> E[External Service]
    E --> F[Database/Blockchain]
    F --> G[Response Processing]
    G --> H[UI Update]
    
    subgraph "Service Layer"
        D1[Supabase Service]
        D2[Thirdweb Service]
        D3[OpenAI Service]
        D4[IPFS Service]
    end
    
    subgraph "External Services"
        E1[Supabase Database]
        E2[ApeChain Network]
        E3[OpenAI API]
        E4[IPFS Network]
    end
    
    D --> D1
    D --> D2
    D --> D3
    D --> D4
    
    D1 --> E1
    D2 --> E2
    D3 --> E3
    D4 --> E4
\`\`\`

## 🚀 Performance Architecture

### Optimization Strategies

1. **Frontend Optimization**
   - Code splitting and lazy loading
   - Image optimization
   - Caching strategies
   - Bundle optimization

2. **Backend Optimization**
   - Database query optimization
   - Connection pooling
   - Caching layers
   - API rate limiting

3. **Blockchain Optimization**
   - Gas optimization
   - Batch operations
   - Event filtering
   - Transaction batching

### Caching Strategy

\`\`\`mermaid
graph LR
    A[User Request] --> B[CDN Cache]
    B --> C{Cache Hit?}
    C -->|Yes| D[Return Cached Data]
    C -->|No| E[API Server]
    E --> F[Database Cache]
    F --> G{DB Cache Hit?}
    G -->|Yes| H[Return Cached Data]
    G -->|No| I[Database Query]
    I --> J[Update Caches]
    J --> K[Return Data]
\`\`\`

## 🔄 Deployment Architecture

### Production Environment

\`\`\`mermaid
graph TB
    subgraph "CDN Layer"
        A[Vercel Edge Network]
    end
    
    subgraph "Application Layer"
        B[Vercel Functions]
        C[Next.js Application]
    end
    
    subgraph "Service Layer"
        D[Supabase Database]
        E[ApeChain Network]
        F[OpenAI API]
        G[IPFS Network]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
\`\`\`

### Environment Configuration

- **Development**: Local development with testnet
- **Staging**: Vercel preview deployments
- **Production**: Vercel production with mainnet

## 📈 Scalability Considerations

### Horizontal Scaling

1. **Database Scaling**
   - Read replicas for query distribution
   - Connection pooling
   - Query optimization

2. **Application Scaling**
   - Vercel automatic scaling
   - Edge functions
   - CDN distribution

3. **Blockchain Scaling**
   - Layer 2 solutions
   - Batch processing
   - Optimistic updates

### Monitoring and Observability

- **Application Monitoring**: Vercel Analytics
- **Database Monitoring**: Supabase Dashboard
- **Blockchain Monitoring**: Block explorers
- **Error Tracking**: Built-in error handling
- **Performance Monitoring**: Real-time metrics

---

This architecture provides a robust, scalable, and secure foundation for the ProofChain platform, enabling privacy-preserving smart contract auditing at scale.
