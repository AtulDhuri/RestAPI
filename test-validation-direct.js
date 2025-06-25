const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

app.post('/test', [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits')
    .matches(/^[0-9]+$/).withMessage('Mobile number can only contain digits')
    .custom((value) => {
      if (value && !value.startsWith('6') && !value.startsWith('7') && !value.startsWith('8') && !value.startsWith('9')) {
        throw new Error('Mobile number must start with 6, 7, 8, or 9');
      }
      return true;
    }),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .isLength({ max: 100 }).withMessage('Email address cannot exceed 100 characters'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.json({ success: true });
  }
]);

app.listen(4000, () => {
  console.log('Minimal validation test server running on port 4000');
}); 