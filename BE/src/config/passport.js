const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const Account = require('../model/Account');

// Local Strategy for login
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    // Find user with secrets (passwordHash)
    const account = await Account.scope('withSecrets').findOne({
      where: { email }
    });

    if (!account) {
      return done(null, false, { message: 'Email hoặc mật khẩu không đúng' });
    }

    // Check account status
    if (account.status === 'locked') {
      return done(null, false, { message: 'Tài khoản đã bị khóa' });
    }

    if (account.status === 'inactive') {
      return done(null, false, { message: 'Tài khoản chưa được kích hoạt' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, account.passwordHash);
    
    if (!isValidPassword) {
      return done(null, false, { message: 'Email hoặc mật khẩu không đúng' });
    }

    // Return account without sensitive data
    const accountData = account.toJSON();
    delete accountData.passwordHash;
    delete accountData.refresh_token;

    return done(null, accountData);
  } catch (error) {
    return done(error);
  }
}));

// JWT Strategy for protected routes
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const account = await Account.findByPk(payload.accountId);

    if (!account) {
      return done(null, false);
    }

    if (account.status !== 'active') {
      return done(null, false);
    }

    return done(null, account);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;