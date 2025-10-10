// Quick verification script for Airtable setup
// Run with: node verify-airtable-setup.js

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🔍 Verifying Airtable Setup');
console.log('===========================');
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

async function verifyTables() {
  const tables = [
    'Audit%20Requests',
    'Smart%20Contracts', 
    'NFTs',
    'IPFS%20Data',
    'Developers'
  ];

  console.log('🔍 Checking Airtable Tables');
  console.log('============================');

  for (const table of tables) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_TOKEN}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${table.replace('%20', ' ')}: ${data.records.length} records`);
      } else {
        console.log(`❌ ${table.replace('%20', ' ')}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${table.replace('%20', ' ')}: ${error.message}`);
    }
  }
  console.log('');
}

async function testAPIEndpoint() {
  console.log('🔍 Testing API Endpoint');
  console.log('========================');
  
  try {
    const response = await fetch('http://localhost:3000/api/dashboard-airtable?wallet=0x79769bdfC988EA6D0b7Abf9A6bFC6e830fAC3433');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Dashboard API working');
      console.log(`   Source: ${data.source}`);
      console.log(`   Projects: ${data.data.projects.length}`);
    } else {
      console.log(`❌ Dashboard API error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Dashboard API error: ${error.message}`);
    console.log('   Make sure your Next.js app is running (npm run dev)');
  }
  console.log('');
}

async function main() {
  await verifyTables();
  await testAPIEndpoint();
  
  console.log('🎯 Setup Verification Complete');
  console.log('==============================');
  console.log('');
  console.log('If all checks passed, your Airtable integration is ready!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run: node test-airtable-integration.js');
  console.log('2. Go to: http://localhost:3000/dashboard');
  console.log('3. Submit audit requests at: http://localhost:3000/upload');
}

main();
