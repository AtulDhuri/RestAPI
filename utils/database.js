const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/property_enquiry_db';
   // const mongoURI = 'mongodb://Sanjeev:Sanjeev2626@cluster0.ukc6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`📍 URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started: net start MongoDB');
    console.log('3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('4. Update MONGODB_URI in your .env file');
    console.log('\n📝 For quick testing, you can use MongoDB Atlas free tier:');
    console.log('   - Sign up at: https://www.mongodb.com/atlas');
    console.log('   - Create a free cluster');
    console.log('   - Get connection string and update .env file');
    console.log('\n💡 Example .env configuration:');
    console.log('   MONGODB_URI=mongodb+srv://Nitin:Nitin%402626@cluster0.ukc6a.mongodb.net/property_enquiry_db?retryWrites=true&w=majority');
    
    process.exit(1);
  }
};

module.exports = connectDB; 