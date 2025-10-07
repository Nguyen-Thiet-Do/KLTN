const passport = require('../config/passport');

// Middleware xác thực JWT
const requireAuth = passport.authenticate('jwt', { session: false });

// Middleware kiểm tra role
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập'
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};