const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function getCustomers() {
  try {
    console.log('🔍 Fetching all customers from database...\n');
    
    const response = await axios.get(`${BASE_URL}/customer`);
    
    console.log('✅ Customers found:', response.data.data.length);
    console.log('📊 All customers:');
    
    response.data.data.forEach((customer, index) => {
      console.log(`\n${index + 1}. ${customer.fullName}`);
      console.log(`   ID: ${customer._id}`);
      console.log(`   Age: ${customer.age}`);
      console.log(`   Income: $${customer.income?.toLocaleString() || 'N/A'}`);
      console.log(`   Budget: $${customer.budget?.toLocaleString() || 'N/A'}`);
      console.log(`   Status: ${customer.status}`);
      console.log(`   Submitted: ${customer.submittedAt}`);
    });
    
  } catch (error) {
    console.error('❌ Error fetching customers:', error.response?.data || error.message);
  }
}

getCustomers(); 