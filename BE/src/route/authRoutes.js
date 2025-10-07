const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', (req, res) => {
  res.json({
    message: 'Auth route is working!',
    status: 'success',
    code: 200,
    data: null
  });
});
// router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);


// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.get('/profile', requireAuth, authController.getProfile);

// Example: Admin only route
router.get('/admin', requireAuth, requireRole([3]), (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user: req.user
  });
});

module.exports = router;