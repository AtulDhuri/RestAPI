const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Login and get JWT token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create payloads
    const accessTokenPayload = { id: user._id, username: user.username, role: user.role };
    const refreshTokenPayload = { id: user._id };

    // Create Access Token
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });

    // Create Refresh Token
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });

    // Store refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ success: true, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/refresh
// @desc    Get a new access token using a refresh token
// @access  Public
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessTokenPayload = { id: user._id, username: user.username, role: user.role };
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });

    return res.json({ success: true, accessToken });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid refresh token', error: error.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout and clear the refresh token
// @access  Private
router.post('/logout', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router; 