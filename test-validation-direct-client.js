const axios = require('axios');

async function test() {
  try {
    const response = await axios.post('http://localhost:4000/test', {
      mobile: '123456789', // invalid: less than 10 digits
      email: 'invalid-email' // invalid: not an email
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Validation errors:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

test(); 