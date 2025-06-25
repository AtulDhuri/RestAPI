const { body, validationResult } = require('express-validator');

// Validation rules for enquiry form
const validateEnquiry = [
  // Personal Information
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),

  body('age')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),

  // Contact Information
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be exactly 10 digits')
    .matches(/^[0-9]+$/)
    .withMessage('Mobile number can only contain digits')
    .custom((value) => {
      if (value && !value.startsWith('6') && !value.startsWith('7') && !value.startsWith('8') && !value.startsWith('9')) {
        throw new Error('Mobile number must start with 6, 7, 8, or 9');
      }
      return true;
    }),

  body('email')
    .notEmpty().withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email address cannot exceed 100 characters'),

  // Financial Information
  body('incomeSource')
    .isIn(['salary', 'business', 'freelance', 'pension', 'investment', 'other'])
    .withMessage('Please select a valid income source'),

  body('income')
    .isFloat({ min: 0 })
    .withMessage('Income must be a positive number')
    .custom((value) => {
      if (value && value < 1000) {
        throw new Error('Income must be at least 1000');
      }
      return true;
    }),

  body('budget')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
    .custom((value) => {
      if (value && value < 50000) {
        throw new Error('Budget must be at least 50,000');
      }
      return true;
    }),

  // Reference Information
  body('reference')
    .isIn(['social_media', 'friend', 'advertisement', 'website', 'agent', 'other'])
    .withMessage('Please select a valid reference option'),

  body('referencePerson')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Reference person name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Reference person name can only contain letters and spaces')
    .custom((value, { req }) => {
      if ((req.body.reference === 'friend' || req.body.reference === 'agent') && !value) {
        throw new Error('Reference person name is required when reference is friend or agent');
      }
      return true;
    }),

  // Property Interests - Handle null values and convert to boolean
  body('propertyInterests')
    .isObject()
    .withMessage('Property interests must be an object')
    .custom((value) => {
      if (value) {
        // Convert null values to false
        const validInterests = ['studio-apt', '1-bhk', '2-bhk', '3-bhk', 'jodi-flat'];
        validInterests.forEach(interest => {
          if (value[interest] === null || value[interest] === undefined) {
            value[interest] = false;
          }
        });
      }
      return true;
    }),

  body('propertyInterests.studio-apt')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value !== 'boolean') {
        throw new Error('Studio Apt interest must be a boolean');
      }
      return true;
    }),

  body('propertyInterests.1-bhk')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value !== 'boolean') {
        throw new Error('1 BHK interest must be a boolean');
      }
      return true;
    }),

  body('propertyInterests.2-bhk')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value !== 'boolean') {
        throw new Error('2 BHK interest must be a boolean');
      }
      return true;
    }),

  body('propertyInterests.3-bhk')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value !== 'boolean') {
        throw new Error('3 BHK interest must be a boolean');
      }
      return true;
    }),

  body('propertyInterests.jodi-flat')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value !== 'boolean') {
        throw new Error('Jodi Flat interest must be a boolean');
      }
      return true;
    }),

  // Remarks and Attendance Information
  body('remarks')
    .isArray({ min: 1 })
    .withMessage('At least one remark and attendance record is required')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('At least one remark and attendance record is required');
      }
      return true;
    }),

  body('remarks.*.remark')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Remark must be between 10 and 1000 characters')
    .notEmpty()
    .withMessage('Remark is required'),

  body('remarks.*.attendedBy')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Attended by name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Attended by name can only contain letters and spaces')
    .notEmpty()
    .withMessage('Attended by is required'),

  body('remarks.*.visitDate')
    .optional()
    .isISO8601()
    .withMessage('Visit date must be a valid date'),

  // Custom validation for reference person
  body('referencePerson')
    .custom((value, { req }) => {
      if ((req.body.reference === 'friend' || req.body.reference === 'agent') && !value) {
        throw new Error('Reference person name is required when reference is friend or agent');
      }
      return true;
    }),

  // Custom validation for property interests
  body('propertyInterests')
    .custom((value) => {
      if (!value) return true;
      
      // Convert null values to false before checking
      const validInterests = ['studio-apt', '1-bhk', '2-bhk', '3-bhk', 'jodi-flat'];
      validInterests.forEach(interest => {
        if (value[interest] === null || value[interest] === undefined) {
          value[interest] = false;
        }
      });
      
      const interests = Object.values(value);
      if (!interests.some(interest => interest === true)) {
        throw new Error('At least one property type must be selected');
      }
      return true;
    })
];

// Validation rules for user registration
const validateUserRegistration = [
  // Username validation
  body('username')
    .notEmpty().withMessage('Username is required')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email address cannot exceed 100 characters'),

  // Mobile validation
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be exactly 10 digits')
    .matches(/^[0-9]+$/)
    .withMessage('Mobile number can only contain digits')
    .custom((value) => {
      if (value && !value.startsWith('6') && !value.startsWith('7') && !value.startsWith('8') && !value.startsWith('9')) {
        throw new Error('Mobile number must start with 6, 7, 8, or 9');
      }
      return true;
    }),

  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Role validation
  body('role')
    .isIn(['admin', 'user', 'salesperson'])
    .withMessage('Role must be either admin or user')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Debug log for validation errors
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  validateEnquiry,
  validateUserRegistration,
  handleValidationErrors
}; 