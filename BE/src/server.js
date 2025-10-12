require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const passport = require('./config/passport');
const authRoutes = require('./route/authRoutes');
const routeApi = require('./route/api');
const librarianRoutes = require("./route/librarianRoutes");


const app = express();
const port = process.env.PORT || 8080;

// ============= CORS CONFIGURATION =============
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const configViewEngine = require('./config/viewEngine');
configViewEngine(app);

// ============= MIDDLEWARE =============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Passport
app.use(passport.initialize());

// ============= ROUTES =============
// Auth routes (JWT authentication)
app.use('/api/auth', authRoutes);
app.use("/api/librarian", librarianRoutes);
app.use('/', routeApi);

// ============= HEALTH CHECK =============
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    port: port
  });
});

// ============= ERROR HANDLING =============
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} không tồn tại`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin không được phép'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error'
  });
});

// ============= START SERVER =============
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');
    console.log(`📊 Database: ${process.env.DB_NAME}`);

    // Start server
    app.listen(port, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`🚀 Server đang chạy tại port ${port}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${port}`);
      console.log(`🔐 Auth API: http://localhost:${port}/api/auth`);
      console.log(`❤️  Health Check: http://localhost:${port}/health`);
      console.log('='.repeat(50));
    });

  } catch (error) {
    console.error('❌ Không thể kết nối database:', error.message);
    console.error('Chi tiết lỗi:', error);
    process.exit(1);
  }
};

// ============= GRACEFUL SHUTDOWN =============
const shutdown = async (signal) => {
  console.log(`\n🛑 Nhận tín hiệu ${signal}, đang tắt server...`);

  try {
    await sequelize.close();
    console.log('✅ Đã đóng kết nối database');
    console.log('👋 Server đã tắt an toàn');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi đóng kết nối:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection tại:', promise);
  console.error('❌ Lý do:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Khởi động server
startServer();