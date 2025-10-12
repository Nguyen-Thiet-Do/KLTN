// ==========================
// src/config/passport.js
// ==========================
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const Account = require("../model/Account");
const Reader = require("../model/Reader");
const Librarian = require("../model/Librarian");

// ======================================================
// 🧩 1️⃣ LOCAL STRATEGY
// ======================================================
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const account = await Account.scope("withSecrets").findOne({
          where: { email },
        });

        if (!account)
          return done(null, false, { message: "Email hoặc mật khẩu không đúng" });

        if (account.status === "locked")
          return done(null, false, { message: "Tài khoản đã bị khóa" });

        if (account.status !== "active")
          return done(null, false, { message: "Tài khoản chưa được kích hoạt" });

        const isValidPassword = await bcrypt.compare(password, account.passwordHash);
        if (!isValidPassword)
          return done(null, false, { message: "Email hoặc mật khẩu không đúng" });

        const data = account.toJSON();
        delete data.passwordHash;
        delete data.refresh_token;

        return done(null, data);
      } catch (error) {
        console.error("❌ Lỗi Local Strategy:", error);
        return done(error);
      }
    }
  )
);

// ======================================================
// 🧩 2️⃣ JWT STRATEGY
// ======================================================
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      if (!payload.accountId) {
        return done(null, false);
      }

      const account = await Account.findByPk(payload.accountId, {
        attributes: ["accountId", "roleId", "email", "status"],
      });

      if (!account) return done(null, false);
      if (account.status !== "active") return done(null, false);

      // ✅ KIỂM TRA LIBRARIAN/READER
      if (account.roleId === 2) {
        const librarian = await Librarian.findOne({ 
          where: { accountId: account.accountId }
        });
        
        if (!librarian) {
          console.error("❌ Không tìm thấy Librarian cho accountId:", account.accountId);
          return done(null, false);
        }
      } else if (account.roleId === 3) {
        const reader = await Reader.findOne({ 
          where: { accountId: account.accountId }
        });
        
        if (!reader) {
          console.error("❌ Không tìm thấy Reader cho accountId:", account.accountId);
          return done(null, false);
        }
      }

      return done(null, {
        accountId: account.accountId,
        roleId: account.roleId,
        email: account.email,
      });
    } catch (err) {
      console.error("❌ Lỗi JWT:", err.message);
      return done(err, false);
    }
  })
);

module.exports = passport;