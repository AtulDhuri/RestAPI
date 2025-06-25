const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, getCustomerByMobile, addRemarkToCustomer, updateCustomer } = require('../controllers/customerController');
const { validateEnquiry, handleValidationErrors } = require('../middleware/validation');
const { authenticateJWT } = require('../middleware/auth');

// Temporarily remove authentication for testing
router.get('/', authenticateJWT, getCustomers);

// Fetch customer by mobile
router.get('/mobile/:mobile', authenticateJWT, getCustomerByMobile);

// Add remark to existing customer
router.patch('/:id/remarks', authenticateJWT, addRemarkToCustomer);

// Update customer (all fields except mobile and id)
router.put('/:id', authenticateJWT, updateCustomer);

// POST /api/customer - explicitly use validation middleware
router.post('/', authenticateJWT, validateEnquiry, handleValidationErrors, createCustomer);

module.exports = router; 