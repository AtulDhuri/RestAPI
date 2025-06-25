const axios = require('axios');

async function testCustomerValidation() {
  console.log('🧪 Testing Customer Validation (Simple)...\n');

  const testCases = [
    {
      name: "Valid customer data",
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
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}. Testing: ${testCase.name}`);
    console.log(`   Mobile: ${testCase.data.mobile}`);
    console.log(`   Email: ${testCase.data.email}`);
    
    try {
      const response = await axios.post('http://localhost:3000/api/customer', testCase.data, {
        headers: {
          'Content-Type': 'application/json'
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

  console.log('🎉 Customer validation testing completed!');
}

testCustomerValidation(); 