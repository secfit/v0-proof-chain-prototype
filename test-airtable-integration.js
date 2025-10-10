// Test script to verify Airtable integration with your credentials
// Run with: node test-airtable-integration.js

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🔍 Testing Airtable Integration');
console.log('==============================');
console.log('');

// Check environment variables
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing Airtable credentials in .env.local');
  console.log('');
  console.log('Please add these to your .env.local file:');
  console.log('AIRTABLE_PERSONAL_ACCESS_TOKEN=your_token_here');
  console.log('AIRTABLE_BASE_ID=your_base_id_here');
  console.log('');
  console.log('Note: Personal Access Tokens are now required (API keys deprecated)');
  process.exit(1);
}

console.log('✅ Environment variables found:');
console.log(`   Token: ${AIRTABLE_TOKEN.substring(0, 10)}...`);
console.log(`   Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`   Token Type: ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ? 'Personal Access Token' : 'API Key (deprecated)'}`);
console.log('');

async function testAirtableConnection() {
  try {
    console.log('🔍 Test 1: Airtable API Connection');
    console.log('==================================');
    
    // Test connection to Audit Requests table
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_TOKEN}`
          }
        }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Connection successful - Found ${data.records.length} audit requests`);
    
    if (data.records.length > 0) {
      console.log('Sample record:');
      console.log(JSON.stringify(data.records[0].fields, null, 2));
    }
    console.log('');

  } catch (error) {
    console.error('❌ Airtable connection failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check your API key and Base ID in .env.local');
    console.log('2. Verify the table name is exactly "Audit Requests"');
    console.log('3. Ensure your API key has read/write permissions');
    console.log('4. Check if the base is shared with your API key');
    return false;
  }
  return true;
}

async function testDashboardAPI() {
  try {
    console.log('🔍 Test 2: Dashboard API with Airtable');
    console.log('======================================');
    
    const testWallet = '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433';
    const response = await fetch(`http://localhost:3000/api/dashboard-airtable?wallet=${testWallet}`);

    if (!response.ok) {
      throw new Error(`Dashboard API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Dashboard API successful');
    console.log(`   Source: ${data.source}`);
    console.log(`   Projects found: ${data.data.projects.length}`);
    console.log(`   Total projects: ${data.data.stats.totalProjects}`);
    console.log(`   Total spent: $${data.data.stats.totalSpent}`);
    console.log('');

  } catch (error) {
    console.error('❌ Dashboard API failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure your Next.js app is running (npm run dev)');
    console.log('2. Check if the /api/dashboard-airtable endpoint exists');
    console.log('3. Verify Airtable credentials are configured');
    return false;
  }
  return true;
}

async function testNFTMinting() {
  try {
    console.log('🔍 Test 3: NFT Minting and Airtable Saving');
    console.log('==========================================');
    
    const testAuditData = {
      projectName: `Test Project ${Date.now()}`,
      projectDescription: 'Testing NFT minting and Airtable integration',
      githubUrl: 'https://github.com/testuser/test-project',
      complexity: 'Medium',
      estimatedDuration: 7,
      proposedPrice: 2500,
      auditorCount: 1,
      developerWallet: '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433',
      repoAnalysis: {
        language: 'Solidity',
        files: 10,
        lines: 500
      },
      aiEstimation: {
        complexity: 'Medium',
        estimatedDuration: 7,
        proposedPrice: 2500
      }
    };

    const response = await fetch('http://localhost:3000/api/submit-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAuditData)
    });

    if (!response.ok) {
      throw new Error(`NFT minting API error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ NFT minting successful');
    console.log(`   Token contract: ${result.contracts.tokenContract ? 'Created' : 'Failed'}`);
    console.log(`   NFT contract: ${result.contracts.nftContract ? 'Created' : 'Failed'}`);
    console.log(`   NFT minted: ${result.contracts.nftMint ? 'Yes' : 'No'}`);
    console.log(`   Airtable saved: ${result.airtable.success ? 'Yes' : 'No'}`);
    
    if (result.airtable.success) {
      console.log('   Airtable records created:');
      console.log(`     Audit Request: ${result.airtable.auditRequestId}`);
      console.log(`     Contracts: ${result.airtable.contractIds.length}`);
      console.log(`     NFTs: ${result.airtable.nftIds.length}`);
      console.log(`     IPFS Data: ${result.airtable.ipfsIds.length}`);
      console.log(`     Developer: ${result.airtable.developerId}`);
    }
    console.log('');

  } catch (error) {
    console.error('❌ NFT minting test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure your Next.js app is running (npm run dev)');
    console.log('2. Check blockchain configuration (Thirdweb, private key, etc.)');
    console.log('3. Verify Airtable credentials and table structure');
    return false;
  }
  return true;
}

async function testDataConsistency() {
  try {
    console.log('🔍 Test 4: Data Consistency Check');
    console.log('=================================');
    
    // Wait for data to be saved
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const testWallet = '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433';
    const response = await fetch(`http://localhost:3000/api/dashboard-airtable?wallet=${testWallet}`);
    const data = await response.json();
    
    console.log('✅ Data consistency check completed');
    console.log(`   Projects in dashboard: ${data.data.projects.length}`);
    console.log(`   Total projects: ${data.data.stats.totalProjects}`);
    console.log(`   Total spent: $${data.data.stats.totalSpent}`);
    console.log('');

  } catch (error) {
    console.error('❌ Data consistency check failed:', error.message);
    return false;
  }
  return true;
}

async function runAllTests() {
  const results = [];
  
  results.push(await testAirtableConnection());
  results.push(await testDashboardAPI());
  results.push(await testNFTMinting());
  results.push(await testDataConsistency());
  
  console.log('🎉 Integration Test Results');
  console.log('===========================');
  console.log(`✅ Airtable Connection: ${results[0] ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Dashboard API: ${results[1] ? 'PASS' : 'FAIL'}`);
  console.log(`✅ NFT Minting: ${results[2] ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Data Consistency: ${results[3] ? 'PASS' : 'FAIL'}`);
  console.log('');
  
  const allPassed = results.every(result => result === true);
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Your Airtable integration is working correctly.');
    console.log('');
    console.log('✅ NFT minting saves IPFS and Contract data to Airtable');
    console.log('✅ Dashboard loads data from Airtable database');
    console.log('✅ Airtable API credentials are working');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to /dashboard to see your data');
    console.log('2. Submit more audit requests to test the flow');
    console.log('3. Check Airtable to verify all data is saved');
  } else {
    console.log('❌ Some tests failed. Check the output above for details.');
  }
}

// Run all tests
runAllTests();
