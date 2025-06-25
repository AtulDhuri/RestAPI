const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    index: true,
    unique: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email address cannot exceed 100 characters'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    minlength: [10, 'Mobile number must be exactly 10 digits'],
    maxlength: [10, 'Mobile number must be exactly 10 digits'],
    match: [/^[0-9]+$/, 'Mobile number can only contain digits'],
    validate: {
      validator: function(value) {
        return /^[6-9]/.test(value);
      },
      message: 'Mobile number must start with 6, 7, 8, or 9'
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'user', 'salesperson'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 