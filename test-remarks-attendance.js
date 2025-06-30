const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test credentials
const TEST_CREDENTIALS = {
  username: 'testuser',
  password: 'testpass123'
};

let authToken = null;

// Test data with remarks and attendedBy fields
const testCustomerData = {
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main Street, City, State 12345',
  age: 30,
  mobile: '9876543210',
  email: 'john.doe@example.com',
  incomeSource: 'salary',
  income: 50000,
  budget: 500000,
  reference: 'website',
  propertyInterests: {
    'studio-apt': false,
    '1-bhk': true,
    '2-bhk': false,
    '3-bhk': false,
    'jodi-flat': false
  },
  remarks: [
    {
      remark: 'Customer visited for the first time and showed interest in 1 BHK apartments. Discussed budget and location preferences.',
      rating: 8,
      attendedBy: 'Sarah Johnson',
      visitDate: new Date().toISOString()
    },
    {
      remark: 'Follow-up visit to show property samples. Customer was satisfied with the options presented.',
      rating: 9,
      attendedBy: 'Mike Wilson',
      visitDate: new Date().toISOString()
    }
  ]
};

async function authenticate() {
  try {
    console.log('🔐 Authenticating...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, TEST_CREDENTIALS, {
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

async function testCustomerCreation() {
  if (!authToken) {
    console.log('❌ No authentication token available');
    return null;
  }

  try {
    console.log('Testing customer creation with remarks and attendedBy fields...');
    
    const response = await axios.post(`${API_BASE_URL}/customer`, testCustomerData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Customer created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data._id;
  } catch (error) {
    console.error('❌ Error creating customer:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

async function testCustomerRetrieval(customerId) {
  if (!customerId || !authToken) return;
  
  try {
    console.log('\nTesting customer retrieval...');
    
    // Add a small delay to ensure the customer is saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await axios.get(`${API_BASE_URL}/customer/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Customer retrieved successfully!');
    
    // Verify remarks and attendedBy fields
    const customer = response.data.data;
    if (customer.remarks && customer.remarks.length > 0) {
      console.log('\n✅ Remarks and attendance records:');
      customer.remarks.forEach((record, index) => {
        console.log(`  Record ${index + 1}:`);
        console.log(`    Remark: ${record.remark}`);
        console.log(`    Rating: ${record.rating}/10`);
        console.log(`    Attended by: ${record.attendedBy}`);
        console.log(`    Visit date: ${record.visitDate}`);
      });
      
      if (customer.clientRating) {
        console.log(`\n✅ Client Rating: ${customer.clientRating}/5`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error retrieving customer:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testValidationErrors() {
  if (!authToken) {
    console.log('❌ No authentication token available for validation tests');
    return;
  }

  console.log('\nTesting validation errors...');
  
  // Test with missing remarks
  const invalidData1 = { ...testCustomerData };
  delete invalidData1.remarks;
  
  try {
    await axios.post(`${API_BASE_URL}/customer`, invalidData1, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Should have failed - missing remarks');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected - missing remarks');
    }
  }
  
  // Test with empty remarks array
  const invalidData2 = { ...testCustomerData, remarks: [] };
  
  try {
    await axios.post(`${API_BASE_URL}/customer`, invalidData2, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Should have failed - empty remarks array');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected - empty remarks array');
    }
  }
  
  // Test with missing rating
  const invalidData3 = { ...testCustomerData };
  delete invalidData3.remarks[0].rating;
  
  try {
    await axios.post(`${API_BASE_URL}/customer`, invalidData3, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Should have failed - missing rating');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected - missing rating');
    }
  }
  
  // Test with missing attendedBy
  const invalidData4 = { ...testCustomerData };
  invalidData4.remarks[0].attendedBy = '';
  
  try {
    await axios.post(`${API_BASE_URL}/customer`, invalidData4, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Should have failed - missing attendedBy');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected - missing attendedBy');
    }
  }
  
  // Test with invalid rating
  const invalidData5 = { ...testCustomerData };
  invalidData5.remarks[0].rating = 11;
  
  try {
    await axios.post(`${API_BASE_URL}/customer`, invalidData5, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Should have failed - rating out of range');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected - rating out of range');
    }
  }
  
  // Test with short remark
  const invalidData6 = { ...testCustomerData };
  invalidData6.remarks[0].remark = 'Short';
  
  try {
    await axios.post(`${API_BASE_URL}/customer`, invalidData6, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Should have failed - remark too short');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected - remark too short');
    }
  }
}

async function runTests() {
  console.log('🚀 Starting tests for remarks and attendedBy fields...\n');
  
  // First authenticate
  const authSuccess = await authenticate();
  if (!authSuccess) {
    console.log('❌ Authentication failed. Please ensure:');
    console.log('1. The server is running');
    console.log('2. A test user exists (run: node create-test-user.js)');
    console.log('3. The test credentials are correct');
    return;
  }
  
  const customerId = await testCustomerCreation();
  await testCustomerRetrieval(customerId);
  await testValidationErrors();
  
  console.log('\n✨ Tests completed!');
}

// Run tests
runTests().catch(console.error); 