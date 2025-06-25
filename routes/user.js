const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validation');

// @route   POST /api/user
// @desc    Create a new user
// @access  Public (should be protected in production)
router.post('/', validateUserRegistration, handleValidationErrors, createUser);

module.exports = router; 