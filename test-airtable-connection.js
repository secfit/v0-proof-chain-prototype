// Test script to verify Airtable connection and data
// Run with: node test-airtable-connection.js

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing Airtable credentials in .env.local');
  console.log('Please add:');
  console.log('AIRTABLE_API_KEY=your_api_key_here');
  console.log('AIRTABLE_BASE_ID=your_base_id_here');
  process.exit(1);
}

async function testAirtableConnection() {
  console.log('🔍 Testing Airtable connection...');
  console.log('API Key:', AIRTABLE_API_KEY.substring(0, 10) + '...');
  console.log('Base ID:', AIRTABLE_BASE_ID);
  console.log('');

  try {
    // Test 1: Get Audit Requests
    console.log('📋 Test 1: Fetching Audit Requests...');
    const auditRequestsResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!auditRequestsResponse.ok) {
      throw new Error(`Audit Requests API error: ${auditRequestsResponse.status}`);
    }

    const auditRequests = await auditRequestsResponse.json();
    console.log(`✅ Found ${auditRequests.records.length} audit requests`);
    
    if (auditRequests.records.length > 0) {
      console.log('Sample audit request:');
      console.log(JSON.stringify(auditRequests.records[0].fields, null, 2));
    }
    console.log('');

    // Test 2: Get Smart Contracts
    console.log('🔗 Test 2: Fetching Smart Contracts...');
    const contractsResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Smart%20Contracts`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!contractsResponse.ok) {
      throw new Error(`Smart Contracts API error: ${contractsResponse.status}`);
    }

    const contracts = await contractsResponse.json();
    console.log(`✅ Found ${contracts.records.length} smart contracts`);
    console.log('');

    // Test 3: Get NFTs
    console.log('🖼️ Test 3: Fetching NFTs...');
    const nftsResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/NFTs`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!nftsResponse.ok) {
      throw new Error(`NFTs API error: ${nftsResponse.status}`);
    }

    const nfts = await nftsResponse.json();
    console.log(`✅ Found ${nfts.records.length} NFTs`);
    console.log('');

    // Test 4: Get IPFS Data
    console.log('📁 Test 4: Fetching IPFS Data...');
    const ipfsResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/IPFS%20Data`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!ipfsResponse.ok) {
      throw new Error(`IPFS Data API error: ${ipfsResponse.status}`);
    }

    const ipfsData = await ipfsResponse.json();
    console.log(`✅ Found ${ipfsData.records.length} IPFS records`);
    console.log('');

    // Test 5: Get Developers
    console.log('👨‍💻 Test 5: Fetching Developers...');
    const developersResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Developers`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!developersResponse.ok) {
      throw new Error(`Developers API error: ${developersResponse.status}`);
    }

    const developers = await developersResponse.json();
    console.log(`✅ Found ${developers.records.length} developers`);
    console.log('');

    // Test 6: Filter by Developer Wallet
    console.log('🔍 Test 6: Filtering by Developer Wallet...');
    const testWallet = '0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433';
    const filteredResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests?filterByFormula={Developer%20Wallet}='${testWallet}'`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!filteredResponse.ok) {
      throw new Error(`Filtered API error: ${filteredResponse.status}`);
    }

    const filteredData = await filteredResponse.json();
    console.log(`✅ Found ${filteredData.records.length} audit requests for wallet ${testWallet}`);
    
    if (filteredData.records.length > 0) {
      console.log('Sample filtered audit request:');
      console.log(JSON.stringify(filteredData.records[0].fields, null, 2));
    }
    console.log('');

    // Summary
    console.log('🎉 Airtable Connection Test Results:');
    console.log('=====================================');
    console.log(`📋 Audit Requests: ${auditRequests.records.length}`);
    console.log(`🔗 Smart Contracts: ${contracts.records.length}`);
    console.log(`🖼️ NFTs: ${nfts.records.length}`);
    console.log(`📁 IPFS Data: ${ipfsData.records.length}`);
    console.log(`👨‍💻 Developers: ${developers.records.length}`);
    console.log(`🔍 Filtered Results: ${filteredData.records.length}`);
    console.log('');
    console.log('✅ All tests passed! Airtable integration is working correctly.');

  } catch (error) {
    console.error('❌ Airtable connection test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check your API key and Base ID in .env.local');
    console.log('2. Verify table names match exactly (including spaces)');
    console.log('3. Ensure API key has correct permissions');
    console.log('4. Check if base is shared with your API key');
    process.exit(1);
  }
}

// Run the test
testAirtableConnection();
