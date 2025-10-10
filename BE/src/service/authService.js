const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { Account, Reader, Librarian } = require('../model/Index');

// Generate Access Token
const generateAccessToken = (account) => {
  return jwt.sign(
    {
      accountId: account.accountId,
      email: account.email,
      roleId: account.roleId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Generate Refresh Token
const generateRefreshToken = (account) => {
  return jwt.sign(
    {
      accountId: account.accountId,
      email: account.email
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

// Get full profile with related data
const getFullProfile = async (accountId, roleId) => {
  const account = await Account.findByPk(accountId);

  if (!account) {
    return null;
  }

  const accountData = account.toJSON();
  let profileData = null;
  let profileType = null;

  if (roleId === 3) {
    const reader = await Reader.findOne({
      where: { accountId }
    });

    if (reader) {
      profileData = reader.toJSON();
      profileType = 'reader';
    }
  } else if (roleId === 2) {
    const librarian = await Librarian.findOne({
      where: { accountId }
    });

    if (librarian) {
      profileData = librarian.toJSON();
      profileType = 'librarian';
    }
  }

  return {
    account: accountData,
    profile: profileData,
    profileType
  };
};

// Login Service
const loginService = async (account) => {
  const accessToken = generateAccessToken(account);
  const refreshToken = generateRefreshToken(account);

  await Account.scope('withSecrets').update(
    { refresh_token: refreshToken },
    { where: { accountId: account.accountId } }
  );

  const fullProfile = await getFullProfile(account.accountId, account.roleId);

  return {
    ...fullProfile,
    accessToken,
    refreshToken
  };
};

// Refresh Token Service
const refreshTokenService = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const account = await Account.scope('withSecrets').findOne({
    where: { accountId: decoded.accountId }
  });

  if (!account || account.refresh_token !== refreshToken) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  if (account.status !== 'active') {
    throw new Error('INACTIVE_ACCOUNT');
  }

  const newAccessToken = generateAccessToken(account);
  const newRefreshToken = generateRefreshToken(account);

  await Account.scope('withSecrets').update(
    { refresh_token: newRefreshToken },
    { where: { accountId: account.accountId } }
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

// Logout Service
const logoutService = async (accountId) => {
  await Account.scope('withSecrets').update(
    { refresh_token: null },
    { where: { accountId } }
  );
};

// Register Reader Service
const registerReaderService = async (userData) => {
  const {
    email,
    password,
    phoneNumber,
    fullName,
    dateOfBirth,
    gender,
    cccd,
    address,
    note
  } = userData;

  // Validate required fields
  if (!email || !password || !fullName) {
    throw new Error('MISSING_REQUIRED_FIELDS');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('INVALID_EMAIL');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new Error('WEAK_PASSWORD');
  }

  // Check if email exists
  const existingAccount = await Account.findOne({
    where: { email }
  });

  if (existingAccount) {
    throw new Error('EMAIL_EXISTS');
  }

  // Check if CCCD exists
  if (cccd) {
    const existingReader = await Reader.findOne({
      where: { cccd }
    });

    if (existingReader) {
      throw new Error('CCCD_EXISTS');
    }
  }

  const transaction = await sequelize.transaction();

  try {
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create Account
    const account = await Account.create({
      email,
      phoneNumber: phoneNumber || null,
      passwordHash,
      status: 'active',
      roleId: 3
    }, { transaction });

    // Create Reader profile
    const reader = await Reader.create({
      accountId: account.accountId,
      roleId: 3,
      fullName,
      dateOfBirth: dateOfBirth || null,
      gender: gender !== undefined ? gender : null,
      cccd: cccd || null,
      address: address || null,
      totalBorrow: 0,
      note: note || null
    }, { transaction });

    await transaction.commit();

    // Generate tokens
    const accessToken = generateAccessToken(account);
    const refreshToken = generateRefreshToken(account);

    await Account.scope('withSecrets').update(
      { refresh_token: refreshToken },
      { where: { accountId: account.accountId } }
    );

    return {
      account: {
        accountId: account.accountId,
        email: account.email,
        phoneNumber: account.phoneNumber,
        status: account.status,
        roleId: account.roleId
      },
      profile: {
        readerId: reader.readerId,
        fullName: reader.fullName,
        dateOfBirth: reader.dateOfBirth,
        gender: reader.gender,
        cccd: reader.cccd,
        address: reader.address,
        totalBorrow: reader.totalBorrow
      },
      profileType: 'reader',
      accessToken,
      refreshToken
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  loginService,
  refreshTokenService,
  logoutService,
  getFullProfile,
  registerReaderService
};