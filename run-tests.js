// Run all integration tests
// Run with: node run-tests.js

const { exec } = require('child_process');
const path = require('path');

console.log('🧪 Running All Integration Tests');
console.log('================================');
console.log('');

// Test files to run
const tests = [
  {
    name: 'Airtable Connection Test',
    file: 'test-airtable-connection.js',
    description: 'Tests direct Airtable API connection'
  },
  {
    name: 'Dashboard API Test',
    file: 'test-dashboard-api.js',
    description: 'Tests dashboard API with Airtable data'
  },
  {
    name: 'NFT Minting Test',
    file: 'test-nft-minting.js',
    description: 'Tests NFT minting and Airtable integration'
  },
  {
    name: 'Complete Integration Test',
    file: 'test-complete-integration.js',
    description: 'Tests the complete flow end-to-end'
  }
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Running: ${test.name}`);
    console.log(`📝 Description: ${test.description}`);
    console.log('');

    const child = exec(`node ${test.file}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ ${test.name} failed:`, error.message);
        console.log('');
        resolve(false);
        return;
      }

      if (stderr) {
        console.error('Error output:', stderr);
      }

      console.log(stdout);
      console.log(`✅ ${test.name} completed`);
      console.log('=====================================');
      console.log('');
      resolve(true);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      child.kill('SIGINT');
      process.exit(0);
    });
  });
}

async function runAllTests() {
  const results = [];

  for (const test of tests) {
    const success = await runTest(test);
    results.push({ name: test.name, success });
  }

  // Summary
  console.log('📊 Test Results Summary');
  console.log('========================');
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  });

  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;

  console.log('');
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your integration is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the output above for details.');
  }
}

// Run all tests
runAllTests();
