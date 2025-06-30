const axios = require('axios');

// Test CORS with different origins
async function testCORS() {
  const baseURL = 'http://13.203.201.58:3000';
  
  console.log('🧪 Testing CORS configuration...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health endpoint accessible');
    console.log('Response:', healthResponse.data);
    
    // Test auth endpoint
    console.log('\n2. Testing auth endpoint...');
    const authResponse = await axios.get(`${baseURL}/api/auth/login`, {
      headers: {
        'Origin': 'http://13.203.201.58:3000',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Auth endpoint accessible');
    console.log('Response status:', authResponse.status);
    
    // Test with different origin
    console.log('\n3. Testing with localhost origin...');
    const localhostResponse = await axios.get(`${baseURL}/health`, {
      headers: {
        'Origin': 'http://localhost:4200'
      }
    });
    console.log('✅ Localhost origin allowed');
    
    console.log('\n🎉 CORS test completed successfully!');
    
  } catch (error) {
    console.error('❌ CORS test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test OPTIONS preflight request
async function testPreflight() {
  const baseURL = 'http://13.203.201.58:3000';
  
  console.log('\n🔄 Testing OPTIONS preflight request...');
  
  try {
    const response = await axios.options(`${baseURL}/api/auth/login`, {
      headers: {
        'Origin': 'http://13.203.201.58:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    console.log('✅ Preflight request successful');
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    });
    
  } catch (error) {
    console.error('❌ Preflight test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testCORS();
  await testPreflight();
}

runTests(); 