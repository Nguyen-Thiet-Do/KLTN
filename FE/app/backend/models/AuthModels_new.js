const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'kltn.ctkuwmim8vvi.ap-southeast-2.rds.amazonaws.com',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_NAME || 'book_tech',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// =============================================
// AuthModel cho cấu trúc database mới
// =============================================

class AuthModel {

  // Đăng nhập với email và password
  static async login(email, password) {
    try {
      const connection = await pool.getConnection();

      // Lấy thông tin account với role
      const [accounts] = await connection.execute(`
        SELECT 
          a.accountId,
          a.email,
          a.phoneNumber,
          a.passwordHash,
          a.status,
          r.name as roleName,
          r.roleId
        FROM accounts a
        JOIN roles r ON a.roleId = r.roleId
        WHERE a.email = ? AND a.status = 'active'
      `, [email]);

      if (accounts.length === 0) {
        connection.release();
        throw new Error('Email không tồn tại hoặc tài khoản đã bị khóa');
      }

      const account = accounts[0];

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, account.passwordHash);

      if (!isPasswordValid) {
        connection.release();
        throw new Error('Mật khẩu không chính xác');
      }

      // Lấy thông tin chi tiết theo role
      let userInfo = {
        accountId: account.accountId,
        email: account.email,
        phoneNumber: account.phoneNumber,
        roleName: account.roleName,
        roleId: account.roleId
      };

      if (account.roleName === 'reader') {
        const [readers] = await connection.execute(`
          SELECT fullName, dateOfBirth, cccd, address, totalBorrow
          FROM readers WHERE accountId = ?
        `, [account.accountId]);

        if (readers.length > 0) {
          userInfo = { ...userInfo, ...readers[0] };
        }
      } else if (account.roleName === 'librarian') {
        const [librarians] = await connection.execute(`
          SELECT fullName, employeeCode, hireDate, cccd, diaChi, luongCb, hsLuong
          FROM librarians WHERE accountId = ?
        `, [account.accountId]);

        if (librarians.length > 0) {
          userInfo = { ...userInfo, ...librarians[0] };
        }
      }

      connection.release();

      // Tạo JWT token
      const token = jwt.sign(
        {
          accountId: userInfo.accountId,
          email: userInfo.email,
          roleName: userInfo.roleName,
          fullName: userInfo.fullName || userInfo.email
        },
        process.env.JWT_SECRET || 'booktech_secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        success: true,
        user: userInfo,
        token: token,
        message: 'Đăng nhập thành công'
      };

    } catch (error) {
      throw new Error(error.message || 'Lỗi đăng nhập');
    }
  }

  // Đăng ký tài khoản mới
  static async register(userData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { email, phoneNumber, password, role, profileData } = userData;

      // Kiểm tra email đã tồn tại chưa
      const [existingAccounts] = await connection.execute(`
        SELECT email FROM accounts WHERE email = ?
      `, [email]);

      if (existingAccounts.length > 0) {
        throw new Error('Email đã được sử dụng');
      }

      // Lấy roleId
      const [roles] = await connection.execute(`
        SELECT roleId FROM roles WHERE name = ?
      `, [role]);

      if (roles.length === 0) {
        throw new Error('Vai trò không hợp lệ');
      }

      const roleId = roles[0].roleId;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Tạo account
      const [accountResult] = await connection.execute(`
        INSERT INTO accounts (email, phoneNumber, passwordHash, roleId)
        VALUES (?, ?, ?, ?)
      `, [email, phoneNumber, passwordHash, roleId]);

      const accountId = accountResult.insertId;

      // Tạo profile tương ứng với role
      if (role === 'reader') {
        await connection.execute(`
          INSERT INTO readers (accountId, fullName, dateOfBirth, cccd, address)
          VALUES (?, ?, ?, ?, ?)
        `, [
          accountId,
          profileData.fullName || '',
          profileData.dateOfBirth || null,
          profileData.cccd || null,
          profileData.address || null
        ]);
      } else if (role === 'librarian') {
        await connection.execute(`
          INSERT INTO librarians (accountId, fullName, employeeCode, hireDate, cccd, diaChi, luongCb, hsLuong)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          accountId,
          profileData.fullName || '',
          profileData.employeeCode || `LIB${accountId}`,
          profileData.hireDate || new Date(),
          profileData.cccd || null,
          profileData.diaChi || null,
          profileData.luongCb || 0,
          profileData.hsLuong || 1.0
        ]);
      }

      await connection.commit();
      connection.release();

      return {
        success: true,
        message: 'Đăng ký tài khoản thành công',
        accountId: accountId
      };

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw new Error(error.message || 'Lỗi đăng ký tài khoản');
    }
  }

  // Lấy thông tin user theo ID
  static async getUserById(accountId) {
    try {
      const connection = await pool.getConnection();

      const [accounts] = await connection.execute(`
        SELECT 
          a.accountId,
          a.email,
          a.phoneNumber,
          a.status,
          r.name as roleName,
          r.roleId
        FROM accounts a
        JOIN roles r ON a.roleId = r.roleId
        WHERE a.accountId = ?
      `, [accountId]);

      if (accounts.length === 0) {
        connection.release();
        throw new Error('Người dùng không tồn tại');
      }

      const account = accounts[0];
      let userInfo = { ...account };

      // Lấy thông tin chi tiết theo role
      if (account.roleName === 'reader') {
        const [readers] = await connection.execute(`
          SELECT fullName, dateOfBirth, cccd, address, totalBorrow
          FROM readers WHERE accountId = ?
        `, [accountId]);

        if (readers.length > 0) {
          userInfo = { ...userInfo, ...readers[0] };
        }
      } else if (account.roleName === 'librarian') {
        const [librarians] = await connection.execute(`
          SELECT fullName, employeeCode, hireDate, cccd, diaChi, luongCb, hsLuong
          FROM librarians WHERE accountId = ?
        `, [accountId]);

        if (librarians.length > 0) {
          userInfo = { ...userInfo, ...librarians[0] };
        }
      }

      connection.release();
      return userInfo;

    } catch (error) {
      throw new Error(error.message || 'Lỗi lấy thông tin người dùng');
    }
  }

  // Cập nhật thông tin profile
  static async updateProfile(accountId, profileData) {
    try {
      const connection = await pool.getConnection();

      // Lấy role của user
      const [accounts] = await connection.execute(`
        SELECT r.name as roleName 
        FROM accounts a
        JOIN roles r ON a.roleId = r.roleId 
        WHERE a.accountId = ?
      `, [accountId]);

      if (accounts.length === 0) {
        connection.release();
        throw new Error('Người dùng không tồn tại');
      }

      const roleName = accounts[0].roleName;

      // Cập nhật thông tin theo role
      if (roleName === 'reader') {
        await connection.execute(`
          UPDATE readers SET 
            fullName = COALESCE(?, fullName),
            dateOfBirth = COALESCE(?, dateOfBirth),
            cccd = COALESCE(?, cccd),
            address = COALESCE(?, address)
          WHERE accountId = ?
        `, [
          profileData.fullName,
          profileData.dateOfBirth,
          profileData.cccd,
          profileData.address,
          accountId
        ]);
      } else if (roleName === 'librarian') {
        await connection.execute(`
          UPDATE librarians SET 
            fullName = COALESCE(?, fullName),
            cccd = COALESCE(?, cccd),
            diaChi = COALESCE(?, diaChi),
            luongCb = COALESCE(?, luongCb),
            hsLuong = COALESCE(?, hsLuong)
          WHERE accountId = ?
        `, [
          profileData.fullName,
          profileData.cccd,
          profileData.diaChi,
          profileData.luongCb,
          profileData.hsLuong,
          accountId
        ]);
      }

      connection.release();

      return {
        success: true,
        message: 'Cập nhật thông tin thành công'
      };

    } catch (error) {
      throw new Error(error.message || 'Lỗi cập nhật thông tin');
    }
  }

  // Đổi mật khẩu
  static async changePassword(accountId, currentPassword, newPassword) {
    try {
      const connection = await pool.getConnection();

      // Lấy mật khẩu hiện tại
      const [accounts] = await connection.execute(`
        SELECT passwordHash FROM accounts WHERE accountId = ? AND status = 'active'
      `, [accountId]);

      if (accounts.length === 0) {
        connection.release();
        throw new Error('Tài khoản không tồn tại');
      }

      // Kiểm tra mật khẩu hiện tại
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, accounts[0].passwordHash);

      if (!isCurrentPasswordValid) {
        connection.release();
        throw new Error('Mật khẩu hiện tại không chính xác');
      }

      // Hash mật khẩu mới
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Cập nhật mật khẩu
      await connection.execute(`
        UPDATE accounts SET passwordHash = ? WHERE accountId = ?
      `, [newPasswordHash, accountId]);

      connection.release();

      return {
        success: true,
        message: 'Đổi mật khẩu thành công'
      };

    } catch (error) {
      throw new Error(error.message || 'Lỗi đổi mật khẩu');
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'booktech_secret_key');
    } catch (error) {
      throw new Error('Token không hợp lệ');
    }
  }

  // Lấy danh sách roles
  static async getAllRoles() {
    try {
      const connection = await pool.getConnection();

      const [roles] = await connection.execute(`
        SELECT roleId, name FROM roles ORDER BY name
      `);

      connection.release();
      return roles;

    } catch (error) {
      return [];
    }
  }
}

module.exports = AuthModel;
