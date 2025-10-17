const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3004; // Port mới

// Middleware
app.use(cors());
app.use(express.json());

// Import auth routes
const authRoutes = require('./routes/auth_clean');

// Routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'BookTech Authentication API Server',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/auth/login': 'Đăng nhập',
      'POST /api/auth/register': 'Đăng ký tài khoản',
      'GET /api/auth/me': 'Thông tin user hiện tại',
      'POST /api/auth/change-password': 'Đổi mật khẩu',
      'GET /api/auth/roles': 'Danh sách roles',
      'POST /api/auth/logout': 'Đăng xuất'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Authentication API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const mysql = require('mysql2/promise');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    const requiredTables = ['roles', 'accounts', 'readers', 'librarians'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    // Check sample data
    let counts = {};
    for (const table of requiredTables) {
      if (tableNames.includes(table)) {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        counts[table] = result[0].count;
      }
    }
    
    await connection.end();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      tables: tableNames,
      requiredTables: requiredTables,
      missingTables: missingTables,
      counts: counts,
      isReady: missingTables.length === 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BookTech Auth API Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /api/auth/login - Đăng nhập`);
  console.log(`   POST /api/auth/register - Đăng ký`);
  console.log(`   GET  /api/auth/me - Thông tin user`);
  console.log(`   POST /api/auth/change-password - Đổi mật khẩu`);
  console.log(`   GET  /api/auth/roles - Danh sách roles`);
  console.log(`   GET  /api/test-db - Test database`);
});
