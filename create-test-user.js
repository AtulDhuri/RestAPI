const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://surveyPopup:surveyPopup%40123@cluster0.mongodb.net/surveyPopup?retryWrites=true&w=majority';

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ username: 'testuser' });
    
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Username: testuser');
      console.log('Email: testuser@example.com');
      console.log('Mobile: 9876543210');
      console.log('Password: testpass123');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    
    const testUser = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      mobile: '9876543210',
      password: hashedPassword,
      role: 'admin'
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('Username: testuser');
    console.log('Email: testuser@example.com');
    console.log('Mobile: 9876543210');
    console.log('Password: testpass123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
createTestUser().catch(console.error); 