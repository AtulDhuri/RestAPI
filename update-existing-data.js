const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');

async function updateExistingCustomers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property_enquiry_db';
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');
    console.log('🔍 Finding customers without income/budget fields...');
    
    // Find customers that don't have income or budget fields
    const customersToUpdate = await Customer.find({
      $or: [
        { income: { $exists: false } },
        { budget: { $exists: false } }
      ]
    });
    
    console.log(`📊 Found ${customersToUpdate.length} customers to update`);
    
    if (customersToUpdate.length === 0) {
      console.log('✅ All customers already have income and budget fields!');
      return;
    }
    
    // Update each customer with default values
    for (const customer of customersToUpdate) {
      const updateData = {
        income: customer.income || 50000, // Default income
        budget: customer.budget || 300000  // Default budget
      };
      
      await Customer.findByIdAndUpdate(customer._id, updateData);
      console.log(`✅ Updated customer: ${customer.fullName} - Income: $${updateData.income.toLocaleString()}, Budget: $${updateData.budget.toLocaleString()}`);
    }
    
    console.log('\n🎉 All existing customers updated successfully!');
    console.log('📊 You can now run: node get-customers.js to see the updated data');
    
  } catch (error) {
    console.error('❌ Error updating customers:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the update
updateExistingCustomers(); 