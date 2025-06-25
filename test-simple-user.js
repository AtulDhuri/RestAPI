const axios = require('axios');

async function testSimpleUserRegistration() {
  console.log('🧪 Testing Simple User Registration with Invalid Data...\n');

  const testData = {
    username: "testuser456",
    email: "invalid-email-format", // Invalid email
    mobile: "123456789", // Invalid mobile (less than 10 digits)
    password: "weak", // Weak password
    role: "invalid_role" // Invalid role
  };

  console.log('📤 Sending invalid data:', JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const response = await axios.post('http://localhost:3000/api/user', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ UNEXPECTED SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('✅ EXPECTED ERROR!');
    console.log('Error message:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received. Request details:', error.request);
    }
  }
}

testSimpleUserRegistration(); 