const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

const testCustomer = {
  firstName: "Jane",
  lastName: "Smith",
  address: "456 Elm Street, City, State 54321",
  age: 28,
  mobile: "9876543210",
  email: "jane.smith@example.com",
  incomeSource: "business",
  income: 75000,
  budget: 500000,
  reference: "friend",
  referencePerson: "John Doe",
  propertyInterests: {
    "studio-apt": true,
    "1-bhk": false,
    "2-bhk": true,
    "3-bhk": false,
    "jodi-flat": false
  },
  remarks: [
    {
      remark: "Customer showed interest in 2 BHK properties. Budget seems reasonable for the area.",
      rating: 7,
      attendedBy: "Sarah Johnson",
      visitDate: new Date().toISOString()
    }
  ]
};

async function testCustomerAPI() {
  console.log('🧪 Testing Customer API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Create Customer
    console.log('2. Testing Create Customer...');
    console.log('📤 Sending data:', JSON.stringify(testCustomer, null, 2));
    console.log('');
    
    const createResponse = await axios.post(`${BASE_URL}/customer`, testCustomer);
    console.log('✅ Customer Created Successfully!');
    console.log('📊 Response:', JSON.stringify(createResponse.data, null, 2));
    console.log('');

    // Test 3: Verify Customer was created
    console.log('3. Customer ID:', createResponse.data.data._id);
    console.log('   Full Name:', createResponse.data.data.fullName);
    console.log('   Status:', createResponse.data.data.status);
    console.log('   Income:', createResponse.data.data.income);
    console.log('   Budget:', createResponse.data.data.budget);
    console.log('   Submitted At:', createResponse.data.data.submittedAt);
    console.log('');

    console.log('🎉 Customer API test passed successfully!');
    console.log('\n📊 Check your MongoDB Atlas dashboard:');
    console.log('   Database: property_enquiry_db');
    console.log('   Collection: customers');

  } catch (error) {
    console.error('❌ Customer API test failed!');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.request) {
      console.error('No response received. Is the server running?');
    }
  }
}

// Run the test
testCustomerAPI(); 