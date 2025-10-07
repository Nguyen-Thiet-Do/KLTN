require('dotenv').config() 
const express = require('express')
const sequelize = require('./config/database') 
const routeApi = require('./route/api')

const app = express()
const port = process.env.PORT || 8081

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', routeApi)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Test kết nối database và khởi động server
const startServer = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');
    
    // Start server
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server đang chạy tại port ${port}`);
    });
    
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Đang tắt server...');
  await sequelize.close();
  console.log('✅ Đã đóng kết nối database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Đang tắt server...');
  await sequelize.close();
  console.log('✅ Đã đóng kết nối database');
  process.exit(0);
});

// Khởi động server
startServer();