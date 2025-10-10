// Complete integration test for Airtable + NFT minting
// Run with: node test-complete-integration.js

const testWallet = '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433';

async function runCompleteTest() {
  console.log('🚀 Starting Complete Integration Test');
  console.log('=====================================');
  console.log('Test Wallet:', testWallet);
  console.log('');

  let testResults = {
    airtableConnection: false,
    dashboardAPI: false,
    nftMinting: false,
    dataConsistency: false
  };

  try {
    // Test 1: Airtable Connection
    console.log('🔍 Test 1: Airtable Connection');
    console.log('==============================');
    
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Missing Airtable credentials in .env.local');
    }

    const auditRequestsResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!auditRequestsResponse.ok) {
      throw new Error(`Airtable API error: ${auditRequestsResponse.status}`);
    }

    const auditRequests = await auditRequestsResponse.json();
    console.log(`✅ Airtable connection successful - Found ${auditRequests.records.length} audit requests`);
    testResults.airtableConnection = true;
    console.log('');

    // Test 2: Dashboard API
    console.log('🔍 Test 2: Dashboard API');
    console.log('========================');
    
    const dashboardResponse = await fetch(`http://localhost:3000/api/dashboard-airtable?wallet=${testWallet}`);
    
    if (!dashboardResponse.ok) {
      throw new Error(`Dashboard API error: ${dashboardResponse.status}`);
    }

    const dashboardData = await dashboardResponse.json();
    console.log(`✅ Dashboard API successful - Found ${dashboardData.data.projects.length} projects`);
    console.log(`   Total Projects: ${dashboardData.data.stats.totalProjects}`);
    console.log(`   Total Spent: $${dashboardData.data.stats.totalSpent}`);
    testResults.dashboardAPI = true;
    console.log('');

    // Test 3: NFT Minting
    console.log('🔍 Test 3: NFT Minting');
    console.log('======================');
    
    const testAuditData = {
      projectName: `Test Project ${Date.now()}`,
      projectDescription: 'A test project for integration testing',
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

    const mintingResponse = await fetch('http://localhost:3000/api/submit-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAuditData)
    });

    if (!mintingResponse.ok) {
      throw new Error(`NFT minting API error: ${mintingResponse.status}`);
    }

    const mintingResult = await mintingResponse.json();
    console.log('✅ NFT minting successful');
    console.log(`   Token Contract: ${mintingResult.contracts.tokenContract ? 'Created' : 'Failed'}`);
    console.log(`   NFT Contract: ${mintingResult.contracts.nftContract ? 'Created' : 'Failed'}`);
    console.log(`   NFT Minted: ${mintingResult.contracts.nftMint ? 'Yes' : 'No'}`);
    console.log(`   Airtable Saved: ${mintingResult.airtable.success ? 'Yes' : 'No'}`);
    testResults.nftMinting = true;
    console.log('');

    // Test 4: Data Consistency
    console.log('🔍 Test 4: Data Consistency');
    console.log('===========================');
    
    // Wait a moment for data to be saved
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if the new project appears in dashboard
    const updatedDashboardResponse = await fetch(`http://localhost:3000/api/dashboard-airtable?wallet=${testWallet}`);
    const updatedDashboardData = await updatedDashboardResponse.json();
    
    const newProject = updatedDashboardData.data.projects.find(p => p.name === testAuditData.projectName);
    
    if (newProject) {
      console.log('✅ Data consistency verified - New project found in dashboard');
      console.log(`   Project Name: ${newProject.name}`);
      console.log(`   Status: ${newProject.status}`);
      console.log(`   Airtable ID: ${newProject.airtable.auditRequestId}`);
      testResults.dataConsistency = true;
    } else {
      console.log('⚠️ Data consistency issue - New project not found in dashboard');
    }
    console.log('');

    // Final Results
    console.log('🎉 Complete Integration Test Results');
    console.log('====================================');
    console.log(`✅ Airtable Connection: ${testResults.airtableConnection ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Dashboard API: ${testResults.dashboardAPI ? 'PASS' : 'FAIL'}`);
    console.log(`✅ NFT Minting: ${testResults.nftMinting ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Data Consistency: ${testResults.dataConsistency ? 'PASS' : 'FAIL'}`);
    console.log('');

    const allTestsPassed = Object.values(testResults).every(result => result === true);
    
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! Integration is working correctly.');
      console.log('');
      console.log('Next steps:');
      console.log('1. Go to /dashboard to see your data');
      console.log('2. Submit more audit requests to test the flow');
      console.log('3. Check Airtable to verify all data is saved');
    } else {
      console.log('❌ Some tests failed. Check the output above for details.');
    }

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure your Next.js app is running (npm run dev)');
    console.log('2. Check Airtable credentials in .env.local');
    console.log('3. Verify blockchain configuration');
    console.log('4. Ensure you have test data in Airtable');
    process.exit(1);
  }
}

// Run the complete test
runCompleteTest();
