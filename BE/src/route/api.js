const express = require('express')
const routeApi = express.Router()
const testController = require('../controller/test');

// Root route - API Documentation với EJS
routeApi.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const apiDocs = {
    title: 'Library Management System API',
    version: '1.0.0',
    description: 'API Documentation cho hệ thống quản lý thư viện',
    developer: 'Độ Hiệp Hiếu',
    baseUrl: baseUrl,
    serverTime: new Date().toLocaleString('vi-VN'),
    endpoints: [
      {
        group: 'Authentication',
        icon: '🔐',
        routes: [
          {
            method: 'GET',
            path: '/api/auth',
            description: 'Kiểm tra trạng thái auth route',
            auth: false
          },
          {
            method: 'POST',
            path: '/api/auth/register',
            description: 'Đăng ký tài khoản độc giả mới',
            auth: false,
            body: {
              email: 'string (required)',
              password: 'string (required, min 6 chars)',
              fullName: 'string (required)',
              phoneNumber: 'string (optional, 10-11 digits)',
              dateOfBirth: 'date (optional)',
              gender: 'number (optional, 0=Female, 1=Male)',
              cccd: 'string (optional, 9-12 digits)',
              address: 'string (optional)',
              note: 'string (optional)'
            }
          },
          {
            method: 'POST',
            path: '/api/auth/login',
            description: 'Đăng nhập vào hệ thống',
            auth: false,
            body: {
              email: 'string (required)',
              password: 'string (required)'
            }
          },
          {
            method: 'POST',
            path: '/api/auth/refresh-token',
            description: 'Làm mới access token',
            auth: false,
            body: {
              refreshToken: 'string (required)'
            }
          },
          {
            method: 'POST',
            path: '/api/auth/logout',
            description: 'Đăng xuất khỏi hệ thống',
            auth: true
          },
          {
            method: 'GET',
            path: '/api/auth/profile',
            description: 'Lấy thông tin profile người dùng',
            auth: true
          },
          {
            method: 'GET',
            path: '/api/auth/admin',
            description: 'Route dành cho admin (ví dụ)',
            auth: true,
            role: 'Admin (roleId = 1)'
          }
        ]
      },
      {
        group: 'Users ( đang phát triển )',
        icon: '👥',
        routes: [
          {
            method: 'GET',
            path: '/api/users',
            description: 'Lấy danh sách người dùng (Admin only)',
            auth: true,
            role: 'Admin (roleId = 1)',
            query: {
              page: 'number (optional, default=1)',
              limit: 'number (optional, default=10)',
              search: 'string (optional, tìm kiếm theo tên hoặc email)'
            }
          },
        ]
      },
      {
        group: 'Test',
        icon: '🧪',
        routes: [
          {
            method: 'GET',
            path: '/tests',
            description: 'Lấy danh sách test',
            auth: false
          }
        ]
      },
      {
        group: 'System',
        icon: '⚙️',
        routes: [
          {
            method: 'GET',
            path: '/health',
            description: 'Kiểm tra trạng thái server',
            auth: false
          }
        ]
      }
    ]
  };

  res.render('api-docs', apiDocs);
});

routeApi.get('/tests', testController.getAll);

module.exports = routeApi;