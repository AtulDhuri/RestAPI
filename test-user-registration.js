const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test cases for user registration validation
const testCases = [
  {
    name: "Valid user registration",
    data: {
      username: "john_doe",
      email: "john.doe@example.com",
      mobile: "9876543210",
      password: "TestPass123",
      role: "user"
    },
    expectedSuccess: true
  },
  {
    name: "Invalid mobile - less than 10 digits",
    data: {
      username: "jane_smith",
      email: "jane.smith@example.com",
      mobile: "123456789",
      password: "TestPass123",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Invalid mobile - starts with 5",
    data: {
      username: "bob_johnson",
      email: "bob.johnson@example.com",
      mobile: "5123456789",
      password: "TestPass123",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Invalid email format",
    data: {
      username: "alice_brown",
      email: "invalid-email-format",
      mobile: "8765432109",
      password: "TestPass123",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Missing mobile field",
    data: {
      username: "charlie_wilson",
      email: "charlie.wilson@example.com",
      password: "TestPass123",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Missing email field",
    data: {
      username: "diana_taylor",
      mobile: "7654321098",
      password: "TestPass123",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Weak password - no uppercase",
    data: {
      username: "frank_miller",
      email: "frank.miller@example.com",
      mobile: "6543210987",
      password: "testpass123",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Weak password - no numbers",
    data: {
      username: "grace_davis",
      email: "grace.davis@example.com",
      mobile: "5432109876",
      password: "TestPass",
      role: "user"
    },
    expectedSuccess: false
  },
  {
    name: "Invalid role",
    data: {
      username: "henry_clark",
      email: "henry.clark@example.com",
      mobile: "4321098765",
      password: "TestPass123",
      role: "moderator"
    },
    expectedSuccess: false
  }
];

async function testUserRegistration() {
  console.log('🧪 Testing User Registration with Mobile and Email Validation...\n');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}. Testing: ${testCase.name}`);
    console.log(`   Username: ${testCase.data.username}`);
    console.log(`   Email: ${testCase.data.email || 'MISSING'}`);
    console.log(`   Mobile: ${testCase.data.mobile || 'MISSING'}`);
    console.log(`   Password: ${testCase.data.password}`);
    console.log(`   Role: ${testCase.data.role}`);
    
    try {
      const response = await axios.post(`${BASE_URL}/user`, testCase.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (testCase.expectedSuccess) {
        console.log('   ✅ SUCCESS (Expected)');
        console.log(`   User ID: ${response.data.data.id}`);
      } else {
        console.log('   ❌ UNEXPECTED SUCCESS (Should have failed)');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data.errors;
        
        if (testCase.expectedSuccess) {
          console.log('   ❌ UNEXPECTED FAILURE (Should have succeeded)');
        } else {
          console.log('   ✅ FAILED (Expected)');
        }
        
        // Display validation errors
        validationErrors.forEach(err => {
          console.log(`   ${err.field} Error: ${err.message}`);
        });
      } else if (error.response && error.response.status === 409) {
        console.log('   ⚠️  CONFLICT (User already exists)');
      } else {
        console.log('   ❌ Unexpected error:', error.message);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
        }
      }
    }
    
    console.log('');
  }

  console.log('🎉 User registration validation testing completed!');
}

// Run the test
testUserRegistration(); 