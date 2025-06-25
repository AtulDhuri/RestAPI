const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test user data
const testUserData = {
  username: 'testuser',
  email: 'testuser@example.com',
  mobile: '9876543210',
  password: 'TestPass123',
  role: 'admin'
};

async function createTestUser() {
  try {
    console.log('👤 Creating test user...');
    
    const response = await axios.post(`${API_BASE_URL}/user`, testUserData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ Test user created successfully!');
      console.log('Username: testuser');
      console.log('Email: testuser@example.com');
      console.log('Mobile: 9876543210');
      console.log('Password: TestPass123');
      console.log('Role: admin');
    } else {
      console.log('❌ Failed to create test user:', response.data.message);
    }
    
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✅ Test user already exists');
      console.log('Username: testuser');
      console.log('Email: testuser@example.com');
      console.log('Mobile: 9876543210');
      console.log('Password: TestPass123');
    } else {
      console.error('❌ Error creating test user:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
    }
  }
}

// Run the script
createTestUser().catch(console.error); 