// Test script to verify deployment error handling
const { createAuditRequestContracts } = require('./lib/real-thirdweb-service.ts');

async function testDeployment() {
  console.log('🧪 Testing deployment error handling...');
  
  const testData = {
    projectName: 'TestProject',
    githubUrl: 'https://github.com/test/repo',
    repoHash: 'test-hash',
    complexity: 'Medium',
    estimatedDuration: 5,
    proposedPrice: 100,
    auditorCount: 2,
    developerWallet: '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433',
    tags: ['test', 'deployment'],
    description: 'Test project for deployment verification'
  };
  
  try {
    const result = await createAuditRequestContracts(testData);
    console.log('✅ Test completed successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Note: This is just a reference script
// The actual testing should be done through the web interface
console.log('📝 To test the fix:');
console.log('1. Go to http://localhost:3002/upload');
console.log('2. Fill out the audit form');
console.log('3. Click "Submit for Audit"');
console.log('4. Check console logs for error handling');
