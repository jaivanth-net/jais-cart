import express from 'express';
import { DataStore } from '../dataStore.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user in database
router.post('/signup', async (req, res) => {
  try {
    const { username, phoneOrEmail, password } = req.body;

    if (!username || !phoneOrEmail || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields (username, phone/email, password).' 
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters long.'
      });
    }

    const result = await DataStore.signup({ username, phoneOrEmail, password });
    return res.status(201).json({
      success: true,
      message: 'Sign up successful! Account created.',
      token: result.token,
      user: result.user
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Signup failed.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user credentials
router.post('/login', async (req, res) => {
  try {
    const { phoneOrEmailOrUsername, password } = req.body;

    if (!phoneOrEmailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Username/Phone and Password.'
      });
    }

    const result = await DataStore.login({ phoneOrEmailOrUsername, password });
    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome to JAI\'s Cart.',
      token: result.token,
      user: result.user
    });

  } catch (err) {
    const status = err.message === 'ACCOUNT_NOT_FOUND' ? 404 : 401;
    return res.status(status).json({
      success: false,
      code: err.message,
      message: err.customMessage || 'Login failed.'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user info
router.get('/me', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;
