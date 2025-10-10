// Quick fix for Airtable authentication issue
// Run with: node quick-fix-auth.js

require('dotenv').config({ path: '.env.local' });

console.log('🔧 Quick Fix for Airtable Authentication');
console.log('========================================');
console.log('');

// Check current configuration
const token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

console.log('Current configuration:');
console.log(`Token: ${token ? token.substring(0, 10) + '...' : 'NOT FOUND'}`);
console.log(`Base ID: ${baseId || 'NOT FOUND'}`);
console.log('');

if (!token || !baseId) {
  console.error('❌ Missing configuration!');
  console.log('');
  console.log('Please add these to your .env.local file:');
  console.log('AIRTABLE_PERSONAL_ACCESS_TOKEN=patHiHp9mAsVwFMeS');
  console.log('AIRTABLE_BASE_ID=your_base_id_here');
  console.log('');
  console.log('Then restart your application with: npm run dev');
  process.exit(1);
}

// Test the token
async function testToken() {
  console.log('Testing your token...');
  
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/Audit%20Requests`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Token is working!');
      console.log(`Found ${data.records.length} audit requests`);
      console.log('');
      console.log('The issue might be in your application code.');
      console.log('Try restarting your Next.js app: npm run dev');
    } else {
      console.log(`❌ Token test failed: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error: ${errorText}`);
      console.log('');
      console.log('Possible solutions:');
      console.log('1. Check if your token has proper permissions');
      console.log('2. Verify your Base ID is correct');
      console.log('3. Make sure the base is shared with your token');
      console.log('4. Try creating a new Personal Access Token');
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
  }
}

testToken();
