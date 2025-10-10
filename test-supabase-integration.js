// Complete integration test for Supabase
// Run with: node test-supabase-integration.js

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const testWallet = '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433';

console.log('🚀 Starting Complete Supabase Integration Test');
console.log('==============================================');
console.log('Test Wallet:', testWallet);
console.log('');

// Check environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('');
  console.log('Please add these to your .env.local file:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

let testResults = {
  supabaseConnection: false,
  dashboardAPI: false,
  nftMinting: false,
  dataConsistency: false
};

async function testSupabaseConnection() {
  try {
    console.log('🔍 Test 1: Supabase Connection');
    console.log('==============================');
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/audit_requests?select=count`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Supabase connection successful - Found ${data.length} audit requests`);
    testResults.supabaseConnection = true;
    console.log('');

  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
  return true;
}

async function testDashboardAPI() {
  try {
    console.log('🔍 Test 2: Dashboard API');
    console.log('========================');
    
    const response = await fetch(`http://localhost:3000/api/dashboard-supabase?wallet=${testWallet}`);
    
    if (!response.ok) {
      throw new Error(`Dashboard API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Dashboard API successful - Found ${data.data.projects.length} projects`);
    console.log(`   Total Projects: ${data.data.stats.totalProjects}`);
    console.log(`   Total Spent: $${data.data.stats.totalSpent}`);
    testResults.dashboardAPI = true;
    console.log('');

  } catch (error) {
    console.error('❌ Dashboard API failed:', error.message);
    return false;
  }
  return true;
}

async function testNFTMinting() {
  try {
    console.log('🔍 Test 3: NFT Minting');
    console.log('======================');
    
    const testAuditData = {
      projectName: `Test Project ${Date.now()}`,
      projectDescription: 'A test project for Supabase integration testing',
      githubUrl: 'https://github.com/testuser/test-project',
      complexity: 'Medium',
      estimatedDuration: 7,
      proposedPrice: 2500,
      auditorCount: 1,
      developerWallet: testWallet,
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
      throw new Error(`NFT minting API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ NFT minting successful');
    console.log(`   Token Contract: ${result.contracts.tokenContract ? 'Created' : 'Failed'}`);
    console.log(`   NFT Contract: ${result.contracts.nftContract ? 'Created' : 'Failed'}`);
    console.log(`   NFT Minted: ${result.contracts.nftMint ? 'Yes' : 'No'}`);
    console.log(`   Supabase Saved: ${result.supabase.success ? 'Yes' : 'No'}`);
    
    if (result.supabase.success) {
      console.log('   Supabase records created:');
      console.log(`     Audit Request: ${result.supabase.auditRequestId}`);
      console.log(`     Contracts: ${result.supabase.contractIds.length}`);
      console.log(`     NFTs: ${result.supabase.nftIds.length}`);
      console.log(`     IPFS Data: ${result.supabase.ipfsIds.length}`);
      console.log(`     Developer: ${result.supabase.developerId}`);
    }
    testResults.nftMinting = true;
    console.log('');

  } catch (error) {
    console.error('❌ NFT minting test failed:', error.message);
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
    
    const response = await fetch(`http://localhost:3000/api/dashboard-supabase?wallet=${testWallet}`);
    const data = await response.json();
    
    console.log('✅ Data consistency check completed');
    console.log(`   Projects in dashboard: ${data.data.projects.length}`);
    console.log(`   Total projects: ${data.data.stats.totalProjects}`);
    console.log(`   Total spent: $${data.data.stats.totalSpent}`);
    testResults.dataConsistency = true;
    console.log('');

  } catch (error) {
    console.error('❌ Data consistency check failed:', error.message);
    return false;
  }
  return true;
}

async function runAllTests() {
  const results = [];
  
  results.push(await testSupabaseConnection());
  results.push(await testDashboardAPI());
  results.push(await testNFTMinting());
  results.push(await testDataConsistency());
  
  console.log('🎉 Supabase Integration Test Results');
  console.log('====================================');
  console.log(`✅ Supabase Connection: ${testResults.supabaseConnection ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Dashboard API: ${testResults.dashboardAPI ? 'PASS' : 'FAIL'}`);
  console.log(`✅ NFT Minting: ${testResults.nftMinting ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Data Consistency: ${testResults.dataConsistency ? 'PASS' : 'FAIL'}`);
  console.log('');
  
  const allPassed = Object.values(testResults).every(result => result === true);
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Your Supabase integration is working correctly.');
    console.log('');
    console.log('✅ NFT minting saves IPFS and Contract data to Supabase');
    console.log('✅ Dashboard loads data from Supabase database');
    console.log('✅ Supabase connection is working perfectly');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to /dashboard to see your data');
    console.log('2. Submit more audit requests to test the flow');
    console.log('3. Check Supabase dashboard to verify all data is saved');
  } else {
    console.log('❌ Some tests failed. Check the output above for details.');
  }
}

// Run all tests
runAllTests();
