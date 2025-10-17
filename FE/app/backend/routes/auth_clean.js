const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthModel = require('../models/AuthModels_new');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

// =============================================
// POST /api/auth/login - Đăng nhập
// =============================================
router.post('/login', [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await AuthModel.login(email, password);
    
    res.json(result);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Đăng nhập thất bại'
    });
  }
});

// =============================================
// POST /api/auth/register - Đăng ký tài khoản
// =============================================
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role')
    .isIn(['reader', 'librarian'])
    .withMessage('Vai trò không hợp lệ'),
  body('profileData.fullName')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Họ tên phải từ 2-255 ký tự')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, phoneNumber, password, role, profileData } = req.body;
    
    const userData = {
      email,
      phoneNumber,
      password,
      role,
      profileData
    };
    
    const result = await AuthModel.register(userData);
    
    res.status(201).json(result);
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Đăng ký thất bại'
    });
  }
});

// =============================================
// GET /api/auth/me - Lấy thông tin người dùng hiện tại
// =============================================
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    const token = authHeader.substring(7);
    const decoded = AuthModel.verifyToken(token);
    
    const user = await AuthModel.getUserById(decoded.accountId);
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
});

// =============================================
// POST /api/auth/change-password - Đổi mật khẩu
// =============================================
router.post('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
], handleValidationErrors, async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    const token = authHeader.substring(7);
    const decoded = AuthModel.verifyToken(token);
    
    const { currentPassword, newPassword } = req.body;
    
    const result = await AuthModel.changePassword(decoded.accountId, currentPassword, newPassword);
    
    res.json(result);
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Đổi mật khẩu thất bại'
    });
  }
});

// =============================================
// GET /api/auth/roles - Lấy danh sách roles
// =============================================
router.get('/roles', async (req, res) => {
  try {
    const roles = await AuthModel.getAllRoles();
    
    res.json({
      success: true,
      roles: roles
    });
    
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách vai trò'
    });
  }
});

// =============================================
// POST /api/auth/logout - Đăng xuất
// =============================================
router.post('/logout', (req, res) => {
  // Với JWT, logout chỉ cần client xóa token
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
});

module.exports = router;
