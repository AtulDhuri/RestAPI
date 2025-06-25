const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test credentials
const TEST_CREDENTIALS = {
  username: 'testuser',
  password: 'TestPass123'
};

let authToken = null;

// Test cases for mobile and email validation
const testCases = [
  {
    name: "Valid mobile and email",
    data: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main Street, City, State 12345",
      age: 30,
      mobile: "9876543210",
      email: "john.doe@example.com",
      incomeSource: "salary",
      income: 60000,
      budget: 800000,
      reference: "website",
      propertyInterests: {
        "studio-apt": false,
        "1-bhk": true,
        "2-bhk": false,
        "3-bhk": false,
        "jodi-flat": false
      },
      remarks: [
        {
          remark: "Customer interested in 1 BHK properties. Good budget range.",
          attendedBy: "Mike Wilson"
        }
      ]
    },
    expectedSuccess: true
  },
  {
    name: "Invalid mobile - less than 10 digits",
    data: {
      firstName: "Jane",
      lastName: "Smith",
      address: "456 Elm Street, City, State 54321",
      age: 25,
      mobile: "123456789",
      email: "jane.smith@example.com",
      incomeSource: "business",
      income: 75000,
      budget: 500000,
      reference: "friend",
      referencePerson: "John Doe",
      propertyInterests: {
        "studio-apt": true,
        "1-bhk": false,
        "2-bhk": false,
        "3-bhk": false,
        "jodi-flat": false
      },
      remarks: [
        {
          remark: "Customer showed interest in studio apartments.",
          attendedBy: "Sarah Johnson"
        }
      ]
    },
    expectedSuccess: false
  },
  {
    name: "Invalid mobile - starts with 5",
    data: {
      firstName: "Bob",
      lastName: "Johnson",
      address: "789 Oak Street, City, State 67890",
      age: 35,
      mobile: "5123456789",
      email: "bob.johnson@example.com",
      incomeSource: "freelance",
      income: 45000,
      budget: 600000,
      reference: "advertisement",
      propertyInterests: {
        "studio-apt": false,
        "1-bhk": false,
        "2-bhk": true,
        "3-bhk": false,
        "jodi-flat": false
      },
      remarks: [
        {
          remark: "Customer interested in 2 BHK properties.",
          attendedBy: "David Brown"
        }
      ]
    },
    expectedSuccess: false
  },
  {
    name: "Invalid email format",
    data: {
      firstName: "Alice",
      lastName: "Brown",
      address: "321 Pine Street, City, State 13579",
      age: 28,
      mobile: "8765432109",
      email: "invalid-email-format",
      incomeSource: "investment",
      income: 100000,
      budget: 1200000,
      reference: "agent",
      referencePerson: "Tom Wilson",
      propertyInterests: {
        "studio-apt": false,
        "1-bhk": false,
        "2-bhk": false,
        "3-bhk": true,
        "jodi-flat": false
      },
      remarks: [
        {
          remark: "Customer interested in 3 BHK properties. High budget customer.",
          attendedBy: "Lisa Davis"
        }
      ]
    },
    expectedSuccess: false
  },
  {
    name: "Missing mobile field",
    data: {
      firstName: "Charlie",
      lastName: "Wilson",
      address: "654 Maple Street, City, State 24680",
      age: 32,
      email: "charlie.wilson@example.com",
      incomeSource: "pension",
      income: 35000,
      budget: 400000,
      reference: "social_media",
      propertyInterests: {
        "studio-apt": true,
        "1-bhk": false,
        "2-bhk": false,
        "3-bhk": false,
        "jodi-flat": false
      },
      remarks: [
        {
          remark: "Customer interested in studio apartments. Budget conscious.",
          attendedBy: "Emma Taylor"
        }
      ]
    },
    expectedSuccess: false
  },
  {
    name: "Missing email field",
    data: {
      firstName: "Diana",
      lastName: "Taylor",
      address: "987 Cedar Street, City, State 86420",
      age: 29,
      mobile: "7654321098",
      incomeSource: "other",
      income: 55000,
      budget: 700000,
      reference: "other",
      propertyInterests: {
        "studio-apt": false,
        "1-bhk": false,
        "2-bhk": false,
        "3-bhk": false,
        "jodi-flat": true
      },
      remarks: [
        {
          remark: "Customer interested in jodi flats. Unique requirement.",
          attendedBy: "Frank Miller"
        }
      ]
    },
    expectedSuccess: false
  }
];

async function authenticate() {
  try {
    console.log('🔐 Authenticating...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, TEST_CREDENTIALS, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      console.log('✅ Authentication successful');
      return true;
    } else {
      console.log('❌ Authentication failed - no token received');
      return false;
    }
  } catch (error) {
    console.error('❌ Authentication error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testMobileEmailValidation() {
  console.log('🧪 Testing Mobile and Email Validation...\n');

  // First authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  console.log('');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}. Testing: ${testCase.name}`);
    console.log(`   Mobile: ${testCase.data.mobile || 'MISSING'}`);
    console.log(`   Email: ${testCase.data.email || 'MISSING'}`);
    
    try {
      const response = await axios.post(`${BASE_URL}/customer`, testCase.data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (testCase.expectedSuccess) {
        console.log('   ✅ SUCCESS (Expected)');
        console.log(`   Customer ID: ${response.data.data._id}`);
      } else {
        console.log('   ❌ UNEXPECTED SUCCESS (Should have failed)');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data.errors;
        const mobileErrors = validationErrors.filter(err => err.field === 'mobile');
        const emailErrors = validationErrors.filter(err => err.field === 'email');
        
        if (testCase.expectedSuccess) {
          console.log('   ❌ UNEXPECTED FAILURE (Should have succeeded)');
        } else {
          console.log('   ✅ FAILED (Expected)');
        }
        
        if (mobileErrors.length > 0) {
          console.log(`   Mobile Error: ${mobileErrors[0].message}`);
        }
        if (emailErrors.length > 0) {
          console.log(`   Email Error: ${emailErrors[0].message}`);
        }
      } else {
        console.log('   ❌ Unexpected error:', error.message);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
        }
      }
    }
    
    console.log('');
  }

  console.log('🎉 Mobile and Email validation testing completed!');
}

// Run the test
testMobileEmailValidation(); 