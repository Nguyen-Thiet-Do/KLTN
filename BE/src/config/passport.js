const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const Account = require('../model/Account');

// ============= Local Strategy cho Login =============
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Tìm user theo email
        const account = await Account.findOne({ where: { email } });

        if (!account) {
          return done(null, false, { message: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra status
        if (account.status !== 'active') {
          return done(null, false, { message: 'Tài khoản đã bị khóa' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          password, 
          account.passwordHash.toString()
        );

        if (!isPasswordValid) {
          return done(null, false, { message: 'Email hoặc mật khẩu không đúng' });
        }

        return done(null, account);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// ============= JWT Strategy cho Authentication =============
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const account = await Account.findOne({
          where: { accountId: payload.accountId }
        });

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
    }
  )
);

module.exports = passport;