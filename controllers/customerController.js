const Customer = require('../models/Customer');

// @desc    Create a new customer
// @route   POST /api/customer
// @access  Public
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
};

// @desc    Get all customers
// @route   GET /api/customer
// @access  Public
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
};

// Get all customers with status 'pending'
const getPendingCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ status: 'pending' }).sort({ submittedAt: -1 });
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending customers',
      error: error.message
    });
  }
};

// Fetch customer by mobile number
const getCustomerByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;
    const customer = await Customer.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer', error: error.message });
  }
};

// Add a remark and attendedBy to an existing customer
const addRemarkToCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark, attendedBy, visitDate } = req.body;
    if (!remark || !attendedBy) {
      return res.status(400).json({ success: false, message: 'Remark and attendedBy are required' });
    }
    const update = {
      $push: {
        remarks: {
          remark,
          attendedBy,
          visitDate: visitDate ? new Date(visitDate) : new Date()
        }
      }
    };
    const customer = await Customer.findByIdAndUpdate(id, update, { new: true });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, message: 'Remark added successfully', data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add remark', error: error.message });
  }
};

// @desc    Update customer (all fields except mobile and id)
// @route   PUT /api/customer/:id
// @access  Protected (or public, as per current setup)
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    // Exclude mobile and _id from update
    const { mobile, _id, ...updateFields } = req.body;
    const customer = await Customer.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getPendingCustomers,
  getCustomerByMobile,
  addRemarkToCustomer,
  updateCustomer
}; 