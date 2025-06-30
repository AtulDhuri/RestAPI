const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [10, 'Address must be at least 10 characters'],
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [100, 'Age cannot exceed 100']
  },

  // Contact Information
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
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
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email address cannot exceed 100 characters'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },

  // Financial Information
  incomeSource: {
    type: String,
    required: [true, 'Income source is required'],
    enum: {
      values: ['salary', 'business', 'freelance', 'pension', 'investment', 'other'],
      message: 'Please select a valid income source'
    }
  },
  income: {
    type: Number,
    required: [true, 'Income is required'],
    min: [1000, 'Income must be at least 1000']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [50000, 'Budget must be at least 50,000']
  },

  // Reference Information
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    enum: {
      values: ['social_media', 'friend', 'advertisement', 'website', 'agent', 'other'],
      message: 'Please select a valid reference option'
    }
  },
  referencePerson: {
    type: String,
    trim: true,
    maxlength: [100, 'Reference person name cannot exceed 100 characters'],
    required: function() {
      return this.reference === 'friend' || this.reference === 'agent';
    },
    validate: {
      validator: function(value) {
        if (this.reference === 'friend' || this.reference === 'agent') {
          return value && value.length >= 2;
        }
        return true;
      },
      message: 'Reference person name must be at least 2 characters'
    }
  },

  // Property Interests
  propertyInterests: {
    'studio-apt': {
      type: Boolean,
      default: false
    },
    '1-bhk': {
      type: Boolean,
      default: false
    },
    '2-bhk': {
      type: Boolean,
      default: false
    },
    '3-bhk': {
      type: Boolean,
      default: false
    },
    'jodi-flat': {
      type: Boolean,
      default: false
    }
  },

  // Remarks and Attendance Information
  remarks: {
    type: [{
      remark: {
        type: String,
        required: [true, 'Remark is required'],
        trim: true,
        minlength: [10, 'Remark must be at least 10 characters'],
        maxlength: [1000, 'Remark cannot exceed 1000 characters']
      },
      rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot exceed 10']
      },
      attendedBy: {
        type: String,
        required: [true, 'Attended by is required'],
        trim: true,
        minlength: [2, 'Attended by name must be at least 2 characters'],
        maxlength: [100, 'Attended by name cannot exceed 100 characters']
      },
      visitDate: {
        type: Date,
        default: Date.now
      }
    }],
    required: [true, 'At least one remark and attendance record is required'],
    validate: {
      validator: function(remarks) {
        return remarks && remarks.length > 0;
      },
      message: 'At least one remark and attendance record is required'
    }
  },

  // Client Rating (calculated from remarks ratings)
  clientRating: {
    type: Number,
    min: [1, 'Client rating must be at least 1'],
    max: [10, 'Client rating cannot exceed 10']
  },

  // Metadata
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for property interests array
customerSchema.virtual('selectedInterests').get(function() {
  const interests = [];
  if (this.propertyInterests['studio-apt']) interests.push('studio-apt');
  if (this.propertyInterests['1-bhk']) interests.push('1-bhk');
  if (this.propertyInterests['2-bhk']) interests.push('2-bhk');
  if (this.propertyInterests['3-bhk']) interests.push('3-bhk');
  if (this.propertyInterests['jodi-flat']) interests.push('jodi-flat');
  return interests;
});

// Pre-save middleware to handle null values, calculate client rating, and update updatedAt
customerSchema.pre('save', function(next) {
  // Convert null values to false in propertyInterests
  if (this.propertyInterests) {
    const validInterests = ['studio-apt', '1-bhk', '2-bhk', '3-bhk', 'jodi-flat'];
    validInterests.forEach(interest => {
      if (this.propertyInterests[interest] === null || this.propertyInterests[interest] === undefined) {
        this.propertyInterests[interest] = false;
      }
    });
  }
  
  // Calculate client rating as average of all remark ratings (out of 10)
  if (this.remarks && this.remarks.length > 0) {
    const totalRating = this.remarks.reduce((sum, remark) => sum + remark.rating, 0);
    const averageRating = totalRating / this.remarks.length;
    this.clientRating = Math.round(averageRating); // Round to whole number (1-10 scale)
  }
  
  this.updatedAt = new Date();
  next();
});

// Pre-validate middleware to ensure at least one property interest is selected
customerSchema.pre('validate', function(next) {
  if (this.propertyInterests) {
    const interests = Object.values(this.propertyInterests);
    if (!interests.some(interest => interest === true)) {
      this.invalidate('propertyInterests', 'At least one property type must be selected');
    }
  }
  next();
});

// Index for better query performance
customerSchema.index({ status: 1, submittedAt: -1 });
customerSchema.index({ firstName: 1, lastName: 1 });
customerSchema.index({ reference: 1 });

module.exports = mongoose.model('Customer', customerSchema); 