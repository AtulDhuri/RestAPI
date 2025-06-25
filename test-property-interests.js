const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data with new property interests structure
const testCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main Street, City, State 12345',
  age: 30,
  incomeSource: 'salary',
  income: 50000,
  budget: 500000,
  reference: 'website',
  propertyInterests: {
    'studio-apt': true,
    '1-bhk': false,
    '2-bhk': true,
    '3-bhk': false,
    'jodi-flat': false
  }
};

async function testPropertyInterests() {
  try {
    console.log('Testing new property interests structure...\n');

    // Test 1: Create customer with new property interests
    console.log('1. Creating customer with new property interests...');
    const createResponse = await axios.post(`${API_BASE_URL}/customer`, testCustomer);
    console.log('✅ Customer created successfully');
    console.log('Customer ID:', createResponse.data.data._id);
    console.log('Property Interests:', createResponse.data.data.propertyInterests);
    console.log('Selected Interests:', createResponse.data.data.selectedInterests);
    console.log('');

    // Test 2: Get the created customer
    console.log('2. Fetching created customer...');
    const getResponse = await axios.get(`${API_BASE_URL}/customer/${createResponse.data.data._id}`);
    console.log('✅ Customer fetched successfully');
    console.log('Property Interests:', getResponse.data.data.propertyInterests);
    console.log('Selected Interests:', getResponse.data.data.selectedInterests);
    console.log('');

    // Test 3: Update property interests
    console.log('3. Updating property interests...');
    const updateData = {
      propertyInterests: {
        'studio-apt': false,
        '1-bhk': true,
        '2-bhk': false,
        '3-bhk': true,
        'jodi-flat': true
      }
    };
    const updateResponse = await axios.put(`${API_BASE_URL}/customer/${createResponse.data.data._id}`, updateData);
    console.log('✅ Property interests updated successfully');
    console.log('Updated Property Interests:', updateResponse.data.data.propertyInterests);
    console.log('Updated Selected Interests:', updateResponse.data.data.selectedInterests);
    console.log('');

    // Test 4: Test validation - no property interests selected
    console.log('4. Testing validation - no property interests selected...');
    try {
      const invalidData = {
        ...testCustomer,
        propertyInterests: {
          'studio-apt': false,
          '1-bhk': false,
          '2-bhk': false,
          '3-bhk': false,
          'jodi-flat': false
        }
      };
      await axios.post(`${API_BASE_URL}/customer`, invalidData);
      console.log('❌ Validation should have failed');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly rejected empty property interests');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 5: Test validation - invalid property interest value
    console.log('5. Testing validation - invalid property interest value...');
    try {
      const invalidData = {
        ...testCustomer,
        propertyInterests: {
          'studio-apt': 'invalid',
          '1-bhk': false,
          '2-bhk': false,
          '3-bhk': false,
          'jodi-flat': false
        }
      };
      await axios.post(`${API_BASE_URL}/customer`, invalidData);
      console.log('❌ Validation should have failed');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly rejected invalid property interest value');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All property interests tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testPropertyInterests(); 