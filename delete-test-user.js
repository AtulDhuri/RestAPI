const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// MongoDB connection string - now from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

async function deleteTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Delete test user
    const result = await User.deleteOne({ username: 'testuser' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Test user deleted successfully');
    } else {
      console.log('ℹ️  Test user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
deleteTestUser().catch(console.error); 