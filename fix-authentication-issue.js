// Diagnostic script to fix Airtable authentication issues
// Run with: node fix-authentication-issue.js

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🔧 Fixing Airtable Authentication Issue');
console.log('======================================');
console.log('');

// Check environment variables
console.log('🔍 Step 1: Checking Environment Variables');
console.log('==========================================');

if (!AIRTABLE_TOKEN) {
  console.error('❌ No token found in environment variables');
  console.log('');
  console.log('Please add this to your .env.local file:');
  console.log('AIRTABLE_PERSONAL_ACCESS_TOKEN=patHiHp9mAsVwFMeS');
  process.exit(1);
}

if (!AIRTABLE_BASE_ID) {
  console.error('❌ No Base ID found in environment variables');
  console.log('');
  console.log('Please add this to your .env.local file:');
  console.log('AIRTABLE_BASE_ID=your_base_id_here');
  process.exit(1);
}

console.log('✅ Environment variables found:');
console.log(`   Token: ${AIRTABLE_TOKEN}`);
console.log(`   Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`   Token Type: ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ? 'Personal Access Token' : 'API Key'}`);
console.log('');

// Check token format
console.log('🔍 Step 2: Checking Token Format');
console.log('=================================');

if (AIRTABLE_TOKEN.startsWith('pat')) {
  console.log('✅ Token format looks correct (starts with "pat")');
} else if (AIRTABLE_TOKEN.startsWith('key')) {
  console.log('⚠️ Token format looks like old API key (starts with "key")');
  console.log('   This might be the issue - you need a Personal Access Token');
} else {
  console.log('❌ Token format is unexpected');
  console.log(`   Token starts with: "${AIRTABLE_TOKEN.substring(0, 3)}"`);
  console.log('   Personal Access Tokens should start with "pat"');
}
console.log('');

// Test different authentication methods
console.log('🔍 Step 3: Testing Authentication Methods');
console.log('=========================================');

async function testAuthentication() {
  const testUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests`;
  
  // Test 1: Standard Bearer token
  console.log('Test 1: Standard Bearer token');
  try {
    const response1 = await fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response1.status}`);
    if (response1.ok) {
      const data = await response1.json();
      console.log(`   ✅ Success! Found ${data.records.length} records`);
      return true;
    } else {
      const errorText = await response1.text();
      console.log(`   ❌ Failed: ${errorText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // Test 2: Try without Bearer prefix
  console.log('Test 2: Token without Bearer prefix');
  try {
    const response2 = await fetch(testUrl, {
      headers: {
        'Authorization': AIRTABLE_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response2.status}`);
    if (response2.ok) {
      const data = await response2.json();
      console.log(`   ✅ Success! Found ${data.records.length} records`);
      return true;
    } else {
      const errorText = await response2.text();
      console.log(`   ❌ Failed: ${errorText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // Test 3: Try with different header format
  console.log('Test 3: Alternative header format');
  try {
    const response3 = await fetch(testUrl, {
      headers: {
        'Authorization': `Token ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response3.status}`);
    if (response3.ok) {
      const data = await response3.json();
      console.log(`   ✅ Success! Found ${data.records.length} records`);
      return true;
    } else {
      const errorText = await response3.text();
      console.log(`   ❌ Failed: ${errorText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  return false;
}

async function main() {
  const authSuccess = await testAuthentication();
  
  console.log('');
  console.log('🔍 Step 4: Troubleshooting Recommendations');
  console.log('==========================================');
  
  if (authSuccess) {
    console.log('✅ Authentication is working!');
    console.log('   The issue might be in your application code.');
    console.log('   Check if the environment variables are loaded correctly.');
  } else {
    console.log('❌ Authentication failed. Here are the possible solutions:');
    console.log('');
    console.log('1. 🔑 Check Token Permissions:');
    console.log('   - Go to https://airtable.com/create/tokens');
    console.log('   - Verify your token has these scopes:');
    console.log('     * data.records:read');
    console.log('     * data.records:write');
    console.log('     * schema.bases:read');
    console.log('');
    console.log('2. 🏠 Check Base Access:');
    console.log('   - Make sure your token has access to the base');
    console.log('   - Verify the Base ID is correct');
    console.log('   - Check if the base is shared with your token');
    console.log('');
    console.log('3. 🔄 Regenerate Token:');
    console.log('   - Delete the current token');
    console.log('   - Create a new Personal Access Token');
    console.log('   - Make sure it starts with "pat"');
    console.log('');
    console.log('4. 📝 Update Environment Variables:');
    console.log('   - Restart your application after updating .env.local');
    console.log('   - Make sure there are no extra spaces or quotes');
    console.log('');
    console.log('5. 🧪 Test with curl:');
    console.log(`   curl -H "Authorization: Bearer ${AIRTABLE_TOKEN}" \\`);
    console.log(`        "https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit%20Requests"`);
  }
  
  console.log('');
  console.log('🔧 Quick Fix Steps:');
  console.log('===================');
  console.log('1. Verify your token: patHiHp9mAsVwFMeS');
  console.log('2. Check token permissions in Airtable');
  console.log('3. Restart your application');
  console.log('4. Test with: node test-new-token.js');
}

main();
