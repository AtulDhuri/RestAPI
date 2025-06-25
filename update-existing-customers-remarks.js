const mongoose = require('mongoose');
const Customer = require('./models/Customer');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://surveyPopup:surveyPopup%40123@cluster0.mongodb.net/surveyPopup?retryWrites=true&w=majority';

async function updateExistingCustomers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find all customers that don't have remarks field or have empty remarks
    const customersToUpdate = await Customer.find({
      $or: [
        { remarks: { $exists: false } },
        { remarks: { $size: 0 } },
        { remarks: null }
      ]
    });

    console.log(`Found ${customersToUpdate.length} customers to update`);

    if (customersToUpdate.length === 0) {
      console.log('No customers need updating');
      return;
    }

    // Default remarks and attendedBy for existing customers
    const defaultRemarks = [
      {
        remark: 'Customer enquiry received through the system. Initial contact established.',
        attendedBy: 'System Admin',
        visitDate: new Date()
      }
    ];

    // Update each customer
    let updatedCount = 0;
    for (const customer of customersToUpdate) {
      try {
        await Customer.findByIdAndUpdate(
          customer._id,
          {
            $set: {
              remarks: defaultRemarks,
              updatedAt: new Date()
            }
          },
          { new: true, runValidators: true }
        );
        updatedCount++;
        console.log(`✅ Updated customer: ${customer.firstName} ${customer.lastName}`);
      } catch (error) {
        console.error(`❌ Error updating customer ${customer.firstName} ${customer.lastName}:`, error.message);
      }
    }

    console.log(`\n✨ Successfully updated ${updatedCount} out of ${customersToUpdate.length} customers`);

    // Verify the updates
    const updatedCustomers = await Customer.find({ remarks: { $exists: true, $ne: [] } });
    console.log(`\n📊 Total customers with remarks: ${updatedCustomers.length}`);

    // Show sample of updated customer
    if (updatedCustomers.length > 0) {
      const sampleCustomer = updatedCustomers[0];
      console.log('\n📋 Sample updated customer:');
      console.log(`Name: ${sampleCustomer.firstName} ${sampleCustomer.lastName}`);
      console.log(`Remarks count: ${sampleCustomer.remarks.length}`);
      if (sampleCustomer.remarks.length > 0) {
        console.log(`First remark: ${sampleCustomer.remarks[0].remark}`);
        console.log(`Attended by: ${sampleCustomer.remarks[0].attendedBy}`);
        console.log(`Visit date: ${sampleCustomer.remarks[0].visitDate}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the update
updateExistingCustomers().catch(console.error); 