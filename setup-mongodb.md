# MongoDB Setup Guide

## 🚀 Quick Setup with MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

### Step 6: Update Your .env File
Replace the MONGODB_URI in your `.env` file:

```env
# Replace username, password, and cluster details
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/property_enquiry_db?retryWrites=true&w=majority
```

### Step 7: Test Connection
```bash
npm run dev
```

## 🔧 Alternative: Local MongoDB Installation

### For Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

### For macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### For Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 🧪 Test Your Connection

After setting up MongoDB, test the connection:

```bash
# Start the server
npm run dev

# In another terminal, test the API
node test-api.js
```

## 📝 Troubleshooting

### Common Issues:

1. **Connection Refused**: MongoDB not running
   - Start MongoDB service
   - Check if port 27017 is available

2. **Authentication Failed**: Wrong credentials
   - Double-check username/password in connection string
   - Ensure database user has proper permissions

3. **Network Access Denied**: IP not whitelisted
   - Add your IP to MongoDB Atlas Network Access
   - Or use "Allow Access from Anywhere" for development

4. **Timeout**: Slow connection
   - Check your internet connection
   - Try a different region in Atlas

## 💡 Pro Tips

- **For Development**: Use MongoDB Atlas free tier
- **For Production**: Use MongoDB Atlas paid tier or self-hosted
- **Security**: Never commit credentials to version control
- **Backup**: MongoDB Atlas provides automatic backups
- **Monitoring**: Use Atlas dashboard to monitor your database

## 🆘 Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community: https://community.mongodb.com/
- Stack Overflow: Search for "MongoDB Atlas connection" 