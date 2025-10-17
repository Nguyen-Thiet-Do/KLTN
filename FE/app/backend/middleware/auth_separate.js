const AuthModel = require('../models/AuthModels');

// Middleware xác thực JWT cho hệ thống với bảng riêng biệt
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực. Vui lòng đăng nhập.'
      });
    }

    const token = authHeader.substring(7); // Bỏ 'Bearer ' prefix

    // Verify token
    const decoded = AuthModel.verifyToken(token);

    // Lấy thông tin user từ database để đảm bảo user vẫn tồn tại và active
    const user = await AuthModel.getUserById(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ. Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.'
      });
    }

    // Thêm thông tin user vào request object
    req.user = {
      id: user.account_id,
      username: user.username,
      email: user.email,
      role: user.role_name,
      fullName: user.full_name,
      userCode: user.user_code,
      permissions: JSON.parse(user.permissions || '[]')
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.message === 'Token không hợp lệ') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server trong quá trình xác thực'
    });
  }
};

// Middleware xác thực tùy chọn - không fail nếu không có token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = AuthModel.verifyToken(token);

    const user = await AuthModel.getUserById(decoded.id);

    if (user && user.is_active) {
      req.user = {
        id: user.account_id,
        username: user.username,
        email: user.email,
        role: user.role_name,
        fullName: user.full_name,
        userCode: user.user_code,
        permissions: JSON.parse(user.permissions || '[]')
      };
    }

    next();
  } catch (error) {
    // Tiếp tục mà không có user nếu token không hợp lệ
    next();
  }
};

// Middleware kiểm tra role cụ thể
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Cần đăng nhập để truy cập'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Cần vai trò ${roles.join(' hoặc ')} để truy cập`
      });
    }

    next();
  };
};

// Middleware kiểm tra quyền cụ thể
const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Cần đăng nhập để truy cập'
      });
    }

    try {
      const hasPermission = await AuthModel.checkPermission(req.user.id, permission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Không có quyền ${permission}`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra quyền'
      });
    }
  };
};

// Middleware kiểm tra user chỉ được truy cập tài nguyên của chính mình
const requireSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Cần đăng nhập để truy cập'
    });
  }

  const targetUserId = req.params.userId || req.params.id;
  const isAdmin = req.user.permissions.includes('system_admin') ||
    req.user.permissions.includes('full_access');
  const isSelf = req.user.id === targetUserId;

  if (!isSelf && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ được truy cập thông tin của chính mình'
    });
  }

  next();
};

// Middleware rate limiting cho login
const loginRateLimit = {};
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 phút

const rateLimitLogin = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!loginRateLimit[ip]) {
    loginRateLimit[ip] = { attempts: 0, lockUntil: 0 };
  }

  const userLimit = loginRateLimit[ip];

  // Kiểm tra có bị khóa không
  if (userLimit.lockUntil > now) {
    const remainingTime = Math.ceil((userLimit.lockUntil - now) / 1000 / 60);
    return res.status(429).json({
      success: false,
      message: `IP đã bị khóa do đăng nhập sai quá nhiều lần. Thử lại sau ${remainingTime} phút.`
    });
  }

  // Reset nếu đã hết thời gian khóa
  if (userLimit.lockUntil <= now) {
    userLimit.attempts = 0;
    userLimit.lockUntil = 0;
  }

  next();
};

// Middleware để tăng số lần thử đăng nhập sai
const incrementLoginAttempts = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    const ip = req.ip || req.connection.remoteAddress;

    try {
      const response = JSON.parse(data);

      // Nếu đăng nhập thất bại
      if (!response.success && res.statusCode === 401) {
        if (!loginRateLimit[ip]) {
          loginRateLimit[ip] = { attempts: 0, lockUntil: 0 };
        }

        loginRateLimit[ip].attempts++;

        // Khóa IP nếu vượt quá số lần cho phép
        if (loginRateLimit[ip].attempts >= MAX_LOGIN_ATTEMPTS) {
          loginRateLimit[ip].lockUntil = Date.now() + LOCKOUT_TIME;
        }
      }
      // Nếu đăng nhập thành công, reset attempts
      else if (response.success && response.token) {
        if (loginRateLimit[ip]) {
          loginRateLimit[ip].attempts = 0;
          loginRateLimit[ip].lockUntil = 0;
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  auth,
  optionalAuth,
  requireRole,
  requirePermission,
  requireSelfOrAdmin,
  rateLimitLogin,
  incrementLoginAttempts
};
