# Airtable Setup Guide for ProofChain

This guide explains how to set up your Airtable database for ProofChain.

## Prerequisites

1. An Airtable account (free tier works)
2. Access to create a new base

## Step 1: Create a New Base

1. Go to [Airtable](https://airtable.com)
2. Click "Add a base" → "Start from scratch"
3. Name it "ProofChain"

## Step 2: Create Tables

Create the following tables with their respective fields:

### Table 1: Developers
- `name` - Single line text
- `walletAddress` - Single line text (Primary field)
- `githubRepoLink` - URL
- `email` - Email
- `totalAuditsRequested` - Number
- `totalSpent` - Currency (USD)
- `createdAt` - Created time

### Table 2: Auditors
- `name` - Single line text
- `walletAddress` - Single line text (Primary field)
- `expertise` - Multiple select (add options: Solidity, Rust, Move, Security, DeFi, NFT, DAO)
- `rating` - Number (0-5, with 1 decimal)
- `totalAuditsCompleted` - Number
- `totalEarned` - Currency (USD)
- `createdAt` - Created time

### Table 3: AuditRequests
- `projectName` - Single line text (Primary field)
- `projectDescription` - Long text
- `githubUrl` - URL
- `repoHash` - Single line text
- `complexity` - Single select (options: Quick, Standard, Deep)
- `estimatedDuration` - Number
- `proposedPrice` - Currency (USD)
- `auditorCount` - Number
- `developerWallet` - Single line text
- `developerId` - Link to another record (link to Developers table)
- `status` - Single select (options: Available, In Progress, Completed, Cancelled)
- `requestNftId` - Single line text
- `requestNftAddress` - Single line text
- `tags` - Multiple select
- `ipfsCodeHash` - Single line text
- `createdAt` - Created time
- `updatedAt` - Last modified time

### Table 4: Audit Owners
- `auditRequestId` - Link to another record (link to AuditRequests table)
- `auditorWallet` - Single line text
- `auditorId` - Link to another record (link to Auditors table)
- `auditorName` - Single line text
- `acceptedPrice` - Currency (USD)
- `startDate` - Date
- `estimatedCompletionDate` - Date
- `ownerNftId` - Single line text
- `ownerNftAddress` - Single line text
- `status` - Single select (options: Accepted, In Progress, Completed)
- `createdAt` - Created time

### Table 5: AuditResults
- `auditRequestId` - Link to another record (link to AuditRequests table)
- `auditOwnerId` - Link to another record (link to Audit Owners table)
- `ipfsHash` - Single line text
- `evidenceFileHashes` - Long text
- `findingsCount` - Number
- `vulnerabilitiesCount` - Number
- `severityBreakdown` - Long text (will store JSON)
- `completionDate` - Date
- `resultNftId` - Single line text
- `resultNftAddress` - Single line text
- `status` - Single select (options: Submitted, Verified, Disputed)
- `reportFileUrl` - URL
- `createdAt` - Created time

### Table 6: Findings
- `auditRequestId` - Link to another record (link to AuditRequests table)
- `title` - Single line text
- `description` - Long text
- `severity` - Single select (options: Critical, High, Medium, Low, Informational)
- `contractFile` - Single line text
- `lineNumber` - Number
- `ipfsHash` - Single line text
- `createdAt` - Created time

### Table 7: Transactions
- `txId` - Single line text (Primary field)
- `requestId` - Link to another record (link to AuditRequests table)
- `developerId` - Link to another record (link to Developers table)
- `auditorId` - Link to another record (link to Auditors table)
- `amount` - Currency (USD)
- `tokenType` - Single select (options: FT, NFT)
- `txHash` - Single line text
- `status` - Single select (options: Pending, Completed, Failed)
- `createdAt` - Created time

## Step 3: Get Your API Credentials

1. Click on your profile icon in the top right
2. Go to "Account" → "API"
3. Generate a personal access token
4. Copy the token (starts with "pat...")
5. Go to your ProofChain base
6. Click "Help" → "API documentation"
7. Find your Base ID (starts with "app...")

## Step 4: Configure Environment Variables

In your v0 project settings, set the `air_table` environment variable to your Base ID:

\`\`\`
air_table=appXXXXXXXXXXXXXX
\`\`\`

Note: The current implementation uses the same variable for both the Base ID and API key. You may need to update the code to use separate variables if needed.

## Step 5: Test the Connection

1. Go to your ProofChain dashboard
2. If configured correctly, you should see data loading
3. Check the browser console for any "[v0]" debug messages

## Troubleshooting

- **404 errors**: Check that your Base ID is correct
- **401 errors**: Check that your API token is valid
- **Empty data**: Make sure you have at least one record in the AuditRequests table
- **Field errors**: Ensure all field names match exactly (case-sensitive)

## Sample Data

To test the system, add a sample record to the AuditRequests table:

- projectName: "Test Contract"
- projectDescription: "A test smart contract for auditing"
- githubUrl: "https://github.com/test/repo"
- repoHash: "abc123def456"
- complexity: "Quick"
- estimatedDuration: 7
- proposedPrice: 50
- auditorCount: 1
- developerWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
- status: "Available"
- tags: ["test", "solidity"]
- createdAt: (current date)
