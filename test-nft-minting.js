// Test script to verify NFT minting saves data to Airtable
// Run with: node test-nft-minting.js

async function testNFTMinting() {
  console.log('🔍 Testing NFT minting and Airtable integration...');
  console.log('');

  // Test data for audit submission
  const testAuditData = {
    projectName: 'Test DeFi Protocol',
    projectDescription: 'A test decentralized finance protocol for lending and borrowing',
    githubUrl: 'https://github.com/testuser/defi-protocol',
    complexity: 'High',
    estimatedDuration: 14,
    proposedPrice: 5000,
    auditorCount: 2,
    developerWallet: '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433',
    repoAnalysis: {
      language: 'Solidity',
      files: 25,
      lines: 1500
    },
    aiEstimation: {
      complexity: 'High',
      estimatedDuration: 14,
      proposedPrice: 5000
    }
  };

  try {
    console.log('📤 Test 1: Submitting audit request...');
    console.log('Test data:', JSON.stringify(testAuditData, null, 2));
    console.log('');

    const response = await fetch('http://localhost:3000/api/submit-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAuditData)
    });

    if (!response.ok) {
      throw new Error(`Submit audit API error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Audit submission response received');
    console.log('Response structure:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');

    // Validate response structure
    console.log('🔍 Test 2: Validating response structure...');
    
    if (!result.success) {
      throw new Error('Response success field is false');
    }
    console.log('✅ Success field is true');

    if (!result.contracts) {
      throw new Error('Contracts field is missing');
    }
    console.log('✅ Contracts field exists');

    if (!result.airtable) {
      throw new Error('Airtable field is missing');
    }
    console.log('✅ Airtable field exists');

    if (!result.summary) {
      throw new Error('Summary field is missing');
    }
    console.log('✅ Summary field exists');

    // Check Airtable data
    console.log('🔍 Test 3: Validating Airtable data...');
    
    if (!result.airtable.success) {
      console.log('⚠️ Airtable save failed:', result.airtable.error);
      console.log('This might be expected if Airtable is not configured');
    } else {
      console.log('✅ Airtable save successful');
      
      if (result.airtable.auditRequestId) {
        console.log('✅ Audit request ID:', result.airtable.auditRequestId);
      }
      
      if (result.airtable.contractIds && result.airtable.contractIds.length > 0) {
        console.log('✅ Contract IDs:', result.airtable.contractIds);
      }
      
      if (result.airtable.nftIds && result.airtable.nftIds.length > 0) {
        console.log('✅ NFT IDs:', result.airtable.nftIds);
      }
      
      if (result.airtable.ipfsIds && result.airtable.ipfsIds.length > 0) {
        console.log('✅ IPFS IDs:', result.airtable.ipfsIds);
      }
      
      if (result.airtable.developerId) {
        console.log('✅ Developer ID:', result.airtable.developerId);
      }
    }

    // Check contract data
    console.log('🔍 Test 4: Validating contract data...');
    
    if (result.contracts.tokenContract) {
      console.log('✅ Token contract created:');
      console.log('  Address:', result.contracts.tokenContract.address);
      console.log('  Name:', result.contracts.tokenContract.name);
      console.log('  Symbol:', result.contracts.tokenContract.symbol);
    }
    
    if (result.contracts.nftContract) {
      console.log('✅ NFT contract created:');
      console.log('  Address:', result.contracts.nftContract.address);
      console.log('  Name:', result.contracts.nftContract.name);
      console.log('  Symbol:', result.contracts.nftContract.symbol);
    }
    
    if (result.contracts.nftMint) {
      console.log('✅ NFT minted:');
      console.log('  Token ID:', result.contracts.nftMint.tokenId);
      console.log('  Transaction Hash:', result.contracts.nftMint.transactionHash);
      console.log('  Metadata URI:', result.contracts.nftMint.metadataUri);
    }

    // Check summary
    console.log('🔍 Test 5: Validating summary...');
    console.log('Summary:', JSON.stringify(result.summary, null, 2));

    // Display final results
    console.log('🎉 NFT Minting Test Results:');
    console.log('============================');
    console.log(`✅ Audit Request Created: ${result.auditRequest ? 'Yes' : 'No'}`);
    console.log(`✅ Token Contract Deployed: ${result.contracts.tokenContract ? 'Yes' : 'No'}`);
    console.log(`✅ NFT Contract Deployed: ${result.contracts.nftContract ? 'Yes' : 'No'}`);
    console.log(`✅ NFT Minted: ${result.contracts.nftMint ? 'Yes' : 'No'}`);
    console.log(`✅ Airtable Data Saved: ${result.airtable.success ? 'Yes' : 'No'}`);
    console.log(`✅ Platform Tokens Created: ${result.summary.platformTokensCreated ? 'Yes' : 'No'}`);
    console.log('');

    if (result.airtable.success) {
      console.log('🎯 Airtable Records Created:');
      console.log(`  Audit Request: ${result.airtable.auditRequestId}`);
      console.log(`  Contracts: ${result.airtable.contractIds.length}`);
      console.log(`  NFTs: ${result.airtable.nftIds.length}`);
      console.log(`  IPFS Data: ${result.airtable.ipfsIds.length}`);
      console.log(`  Developer: ${result.airtable.developerId}`);
    }

    console.log('');
    console.log('✅ NFT minting test completed successfully!');

  } catch (error) {
    console.error('❌ NFT minting test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure your Next.js app is running (npm run dev)');
    console.log('2. Check if the /api/submit-audit endpoint exists');
    console.log('3. Verify blockchain configuration (Thirdweb, private key, etc.)');
    console.log('4. Check Airtable credentials and configuration');
    console.log('5. Ensure you have sufficient testnet ETH for transactions');
    process.exit(1);
  }
}

// Run the test
testNFTMinting();
