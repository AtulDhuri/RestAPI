const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data with null values in property interests
const testCustomerWithNulls = {
  firstName: 'Jane',
  lastName: 'Smith',
  address: '456 Oak Avenue, City, State 12345',
  age: 28,
  incomeSource: 'business',
  income: 75000,
  budget: 800000,
  reference: 'social_media',
  propertyInterests: {
    'studio-apt': true,
    '1-bhk': null,
    '2-bhk': null,
    '3-bhk': null,
    'jodi-flat': null
  }
};

// Test data with mixed null and boolean values
const testCustomerMixed = {
  firstName: 'Mike',
  lastName: 'Johnson',
  address: '789 Pine Street, City, State 12345',
  age: 35,
  incomeSource: 'salary',
  income: 60000,
  budget: 600000,
  reference: 'friend',
  referencePerson: 'John Doe',
  propertyInterests: {
    'studio-apt': null,
    '1-bhk': false,
    '2-bhk': true,
    '3-bhk': null,
    'jodi-flat': false
  }
};

async function testNullPropertyInterests() {
  try {
    console.log('Testing property interests with null values...\n');

    // Test 1: Create customer with null values
    console.log('1. Creating customer with null values in property interests...');
    const createResponse1 = await axios.post(`${API_BASE_URL}/customer`, testCustomerWithNulls);
    console.log('✅ Customer created successfully');
    console.log('Customer ID:', createResponse1.data.data._id);
    console.log('Property Interests:', createResponse1.data.data.propertyInterests);
    console.log('Selected Interests:', createResponse1.data.data.selectedInterests);
    console.log('');

    // Test 2: Create customer with mixed null and boolean values
    console.log('2. Creating customer with mixed null and boolean values...');
    const createResponse2 = await axios.post(`${API_BASE_URL}/customer`, testCustomerMixed);
    console.log('✅ Customer created successfully');
    console.log('Customer ID:', createResponse2.data.data._id);
    console.log('Property Interests:', createResponse2.data.data.propertyInterests);
    console.log('Selected Interests:', createResponse2.data.data.selectedInterests);
    console.log('');

    // Test 3: Update property interests with null values
    console.log('3. Updating property interests with null values...');
    const updateData = {
      propertyInterests: {
        'studio-apt': null,
        '1-bhk': true,
        '2-bhk': null,
        '3-bhk': true,
        'jodi-flat': null
      }
    };
    const updateResponse = await axios.put(`${API_BASE_URL}/customer/${createResponse1.data.data._id}`, updateData);
    console.log('✅ Property interests updated successfully');
    console.log('Updated Property Interests:', updateResponse.data.data.propertyInterests);
    console.log('Updated Selected Interests:', updateResponse.data.data.selectedInterests);
    console.log('');

    // Test 4: Test validation - all null values (should fail)
    console.log('4. Testing validation - all null values (should fail)...');
    try {
      const invalidData = {
        ...testCustomerWithNulls,
        propertyInterests: {
          'studio-apt': null,
          '1-bhk': null,
          '2-bhk': null,
          '3-bhk': null,
          'jodi-flat': null
        }
      };
      await axios.post(`${API_BASE_URL}/customer`, invalidData);
      console.log('❌ Validation should have failed');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly rejected all null values');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 5: Test validation - undefined values
    console.log('5. Testing validation - undefined values...');
    try {
      const invalidData = {
        ...testCustomerWithNulls,
        propertyInterests: {
          'studio-apt': undefined,
          '1-bhk': true,
          '2-bhk': undefined,
          '3-bhk': undefined,
          'jodi-flat': undefined
        }
      };
      const response = await axios.post(`${API_BASE_URL}/customer`, invalidData);
      console.log('✅ Customer created with undefined values (converted to false)');
      console.log('Property Interests:', response.data.data.propertyInterests);
      console.log('Selected Interests:', response.data.data.selectedInterests);
    } catch (error) {
      console.log('❌ Unexpected error:', error.message);
      if (error.response) {
        console.log('Response data:', error.response.data);
      }
    }
    console.log('');

    console.log('🎉 All null property interests tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testNullPropertyInterests(); 