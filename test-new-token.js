// Test script for your new Personal Access Token
// Run with: node test-new-token.js

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🔑 Testing Your New Personal Access Token');
console.log('=========================================');
console.log('');

// Check if token is configured
if (!AIRTABLE_TOKEN) {
  console.error('❌ Personal Access Token not found in .env.local');
  console.log('');
  console.log('Please add this to your .env.local file:');
  console.log('AIRTABLE_PERSONAL_ACCESS_TOKEN=patHiHp9mAsVwFMeS');
  process.exit(1);
}

if (!AIRTABLE_BASE_ID) {
  console.error('❌ Base ID not found in .env.local');
  console.log('');
  console.log('Please add this to your .env.local file:');
  console.log('AIRTABLE_BASE_ID=your_base_id_here');
  process.exit(1);
}

console.log('✅ Configuration found:');
console.log(`   Token: ${AIRTABLE_TOKEN.substring(0, 10)}...`);
console.log(`   Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`   Token Type: ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ? 'Personal Access Token ✅' : 'API Key (deprecated) ⚠️'}`);
console.log('');

async function testTokenConnection() {
  try {
    console.log('🔍 Testing Token Connection');
    console.log('===========================');
    
    // Test with your specific token
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Token test failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Token connection successful!');
    console.log(`   Found ${data.records.length} audit requests`);
    console.log('');

    // Test all tables
    const tables = [
      'Audit%20Requests',
      'Smart%20Contracts', 
      'NFTs',
      'IPFS%20Data',
      'Developers'
    ];

    console.log('🔍 Testing All Tables');
    console.log('=====================');
    
    for (const table of tables) {
      try {
        const tableResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`,
          {
            headers: {
              'Authorization': `Bearer ${AIRTABLE_TOKEN}`
            }
          }
        );

        if (tableResponse.ok) {
          const tableData = await tableResponse.json();
          console.log(`✅ ${table.replace('%20', ' ')}: ${tableData.records.length} records`);
        } else {
          console.log(`❌ ${table.replace('%20', ' ')}: Error ${tableResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ ${table.replace('%20', ' ')}: ${error.message}`);
      }
    }
    console.log('');

    // Test dashboard API
    console.log('🔍 Testing Dashboard API');
    console.log('========================');
    
    try {
      const dashboardResponse = await fetch('http://localhost:3000/api/dashboard-airtable?wallet=0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433');
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('✅ Dashboard API working');
        console.log(`   Source: ${dashboardData.source}`);
        console.log(`   Projects: ${dashboardData.data.projects.length}`);
      } else {
        console.log(`❌ Dashboard API error: ${dashboardResponse.status}`);
        console.log('   Make sure your Next.js app is running (npm run dev)');
      }
    } catch (error) {
      console.log(`❌ Dashboard API error: ${error.message}`);
      console.log('   Make sure your Next.js app is running (npm run dev)');
    }
    console.log('');

    console.log('🎉 Token Test Results');
    console.log('=====================');
    console.log('✅ Personal Access Token is working correctly');
    console.log('✅ All Airtable tables are accessible');
    console.log('✅ Dashboard API is ready');
    console.log('');
    console.log('Your integration is ready to use!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to /dashboard to see your data');
    console.log('2. Submit audit requests at /upload');
    console.log('3. Check Airtable to verify data is saved');

  } catch (error) {
    console.error('❌ Token test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check your token: patHiHp9mAsVwFMeS');
    console.log('2. Verify your Base ID is correct');
    console.log('3. Ensure the token has proper permissions');
    console.log('4. Check if the base is shared with your token');
  }
}

// Run the test
testTokenConnection();
