const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/customer';

async function testFetchByMobileAndAddRemark() {
  // 1. Fetch customer by mobile
  const mobile = '9876543210'; // Use a valid mobile from your DB
  console.log(`\n🔎 Fetching customer by mobile: ${mobile}`);
  try {
    const fetchRes = await axios.get(`${BASE_URL}/mobile/${mobile}`);
    console.log('✅ Customer fetched:', fetchRes.data.data);
    const customerId = fetchRes.data.data._id;

    // 2. Add a remark to this customer
    const remarkPayload = {
      remark: 'Follow-up call made. Customer is interested in 2 BHK. Scheduled site visit.',
      attendedBy: 'Agent Smith',
      visitDate: new Date().toISOString()
    };
    console.log(`\n📝 Adding remark to customer ID: ${customerId}`);
    const patchRes = await axios.patch(`${BASE_URL}/${customerId}/remarks`, remarkPayload);
    console.log('✅ Remark added. Updated customer remarks:', patchRes.data.data.remarks);
  } catch (error) {
    if (error.response) {
      console.log('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.log('❌ Request Error:', error.message);
    }
  }
}

testFetchByMobileAndAddRemark(); 