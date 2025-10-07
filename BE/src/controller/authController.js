const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const Account = require('../model/Account');

class AuthController {
  // ============= LOGIN =============
  login(req, res, next) {
    passport.authenticate('local', { session: false }, async (err, account, info) => {
      try {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Lỗi server'
          });
        }

        if (!account) {
          return res.status(401).json({
            success: false,
            message: info?.message || 'Email hoặc mật khẩu không đúng'
          });
        }

        // Tạo JWT tokens
        const accessToken = jwt.sign(
          {
            accountId: account.accountId,
            email: account.email,
            roleId: account.roleId
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        const refreshToken = jwt.sign(
          {
            accountId: account.accountId
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
        );

        // Lưu refresh token vào database
        await account.update({
          refresh_token: refreshToken,
          updated_at: new Date()
        });

        return res.status(200).json({
          success: true,
          message: 'Đăng nhập thành công',
          data: {
            accountId: account.accountId,
            email: account.email,
            phoneNumber: account.phoneNumber,
            roleId: account.roleId,
            accessToken,
            refreshToken
          }
        });

      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
          success: false,
          message: 'Lỗi server'
        });
      }
    })(req, res, next);
  }

  // ============= REFRESH TOKEN =============
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token là bắt buộc'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Tìm account và kiểm tra refresh token
      const account = await Account.findOne({
        where: {
          accountId: decoded.accountId,
          refresh_token: refreshToken
        }
      });

      if (!account) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token không hợp lệ'
        });
      }

      if (account.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản đã bị khóa'
        });
      }

      // Tạo access token mới
      const newAccessToken = jwt.sign(
        {
          accountId: account.accountId,
          email: account.email,
          roleId: account.roleId
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Làm mới token thành công',
        data: {
          accessToken: newAccessToken
        }
      });

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token đã hết hạn'
        });
      }

      console.error('Refresh token error:', error);
      return res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ'
      });
    }
  }

  // ============= LOGOUT =============
  async logout(req, res) {
    try {
      const { accountId } = req.user;

      // Xóa refresh token trong database
      await Account.update(
        { refresh_token: null },
        { where: { accountId } }
      );

      return res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công'
      });

    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // ============= GET PROFILE =============
  async getProfile(req, res) {
    try {
      const { accountId, email, phoneNumber, roleId, status } = req.user;

      return res.status(200).json({
        success: true,
        data: {
          accountId,
          email,
          phoneNumber,
          roleId,
          status
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

 
}

module.exports = new AuthController();