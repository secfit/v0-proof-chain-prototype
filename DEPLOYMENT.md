# ProofChain Deployment Guide

This guide covers the complete deployment process for the ProofChain platform, including database setup, smart contract deployment, and application deployment.

## 📋 Prerequisites

### Required Accounts & Services

1. **Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Thirdweb Account**
   - Sign up at [thirdweb.com](https://thirdweb.com)
   - Create a new project
   - Note your client ID and secret key

3. **OpenAI Account**
   - Sign up at [openai.com](https://openai.com)
   - Generate an API key
   - Ensure you have credits for GPT-4 API calls

4. **Vercel Account** (for deployment)
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

5. **ApeChain Testnet Access**
   - Get testnet tokens from [ApeChain faucet](https://curtis.hub.caldera.xyz/)
   - Add ApeChain testnet to your wallet

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be created

### Step 2: Configure Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `SUPABASE_DATABASE_SCHEMA.sql`
3. Paste and execute the SQL commands
4. Verify that all tables are created successfully

### Step 3: Get Connection Details

1. Go to Settings > API
2. Copy your Project URL and anon public key
3. These will be used in your environment variables

## 🔗 Blockchain Setup (Thirdweb)

### Step 1: Create Thirdweb Project

1. Go to [thirdweb.com](https://thirdweb.com) and create a new project
2. Select "Web3 App" as the project type
3. Choose "Ethereum" as the blockchain (we'll configure ApeChain later)

### Step 2: Configure ApeChain

1. In your Thirdweb project, go to Settings > Networks
2. Add a custom network with these details:
   \`\`\`
   Network Name: ApeChain Testnet
   RPC URL: https://rpc-testnet.apechain.io
   Chain ID: 33139
   Currency Symbol: APE
   Block Explorer: https://testnet.apechain.io
   \`\`\`

### Step 3: Deploy Smart Contracts

1. Go to the Contracts section in Thirdweb
2. Deploy the following contracts:
   - **AuditRequestNFT**: ERC-721 for audit request certificates
   - **ProofChainToken**: ERC-20 for platform payments

3. Note the contract addresses for environment variables

### Step 4: Get API Keys

1. Go to Settings > API Keys
2. Create a new API key
3. Copy the Client ID and Secret Key

## 🤖 AI Setup (OpenAI)

### Step 1: Create OpenAI Account

1. Go to [openai.com](https://openai.com) and create an account
2. Add payment method (required for API access)
3. Generate an API key

### Step 2: Configure API Access

1. Go to API Keys section
2. Create a new secret key
3. Copy the key (it won't be shown again)

## 🚀 Application Deployment

### Method 1: Vercel Deployment (Recommended)

#### Step 1: Prepare Repository

1. Push your code to GitHub
2. Ensure all environment variables are documented
3. Test locally with `pnpm dev`

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   \`\`\`
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   \`\`\`

#### Step 3: Configure Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CHAIN_ID=33139
NEXT_PUBLIC_CHAIN_NAME=ApeChain Testnet
NEXT_PUBLIC_RPC_URL=https://rpc-testnet.apechain.io
NEXT_PUBLIC_AUDIT_REQUEST_NFT_CONTRACT=your_nft_contract_address
NEXT_PUBLIC_PROOFCHAIN_TOKEN_CONTRACT=your_token_contract_address
\`\`\`

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete
3. Your app will be available at `https://your-project.vercel.app`

### Method 2: Manual Deployment

#### Step 1: Build the Application

\`\`\`bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Start production server
pnpm start
\`\`\`

#### Step 2: Configure Web Server

For production deployment, configure your web server (Nginx, Apache, etc.) to:
- Serve static files from `.next/static`
- Proxy API routes to the Next.js server
- Enable HTTPS
- Set proper security headers

## 🔧 Post-Deployment Configuration

### Step 1: Verify Database Connection

1. Go to your deployed application
2. Navigate to the dashboard
3. Check if data loads correctly
4. Test creating a new audit request

### Step 2: Test Blockchain Integration

1. Connect a wallet with ApeChain testnet
2. Try submitting an audit request
3. Verify NFT minting works
4. Check transaction on the block explorer

### Step 3: Test AI Features

1. Submit a GitHub repository URL
2. Verify AI estimation works
3. Check that complexity analysis is accurate

### Step 4: Configure Domain (Optional)

1. In Vercel, go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS

## 🔍 Monitoring & Maintenance

### Health Checks

Set up monitoring for:
- Database connection status
- API response times
- Smart contract interactions
- AI service availability

### Logging

Configure logging for:
- API requests and responses
- Database queries
- Blockchain transactions
- Error tracking

### Backup Strategy

1. **Database**: Supabase provides automatic backups
2. **Smart Contracts**: Source code is version controlled
3. **IPFS Data**: Distributed across the network
4. **Application**: Code is in Git repository

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Errors
- Verify Supabase URL and keys
- Check RLS policies
- Ensure tables exist

#### Blockchain Connection Issues
- Verify ApeChain RPC URL
- Check contract addresses
- Ensure wallet has testnet tokens

#### AI Service Errors
- Verify OpenAI API key
- Check API quota and billing
- Ensure proper request format

#### Build Errors
- Check Node.js version (18+)
- Verify all dependencies installed
- Check TypeScript errors

### Debug Mode

Enable debug mode by setting:
\`\`\`env
NODE_ENV=development
DEBUG=true
\`\`\`

## 📊 Performance Optimization

### Database Optimization

1. **Indexes**: Ensure proper indexes on frequently queried columns
2. **Connection Pooling**: Configure Supabase connection limits
3. **Query Optimization**: Use efficient queries and avoid N+1 problems

### Application Optimization

1. **Caching**: Implement Redis for session storage
2. **CDN**: Use Vercel's edge network
3. **Image Optimization**: Configure Next.js image optimization
4. **Bundle Analysis**: Use `@next/bundle-analyzer` to optimize bundle size

### Blockchain Optimization

1. **Gas Optimization**: Optimize smart contract gas usage
2. **Batch Operations**: Group multiple transactions
3. **Event Listening**: Use efficient event filtering

## 🔐 Security Considerations

### Environment Variables

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly
- Use Vercel's environment variable encryption

### Database Security

- Enable Row Level Security (RLS) in Supabase
- Implement proper access controls
- Regular security audits
- Backup encryption

### Smart Contract Security

- Audit all smart contracts before deployment
- Use OpenZeppelin libraries
- Implement proper access controls
- Regular security updates

## 📈 Scaling Considerations

### Horizontal Scaling

- Use Vercel's automatic scaling
- Implement database read replicas
- Use CDN for static assets
- Consider microservices architecture

### Vertical Scaling

- Upgrade Supabase plan for more resources
- Optimize database queries
- Implement caching strategies
- Use connection pooling

---

**For additional support, check the [Architecture Documentation](./ARCHITECTURE.md) or open an issue on GitHub.**
