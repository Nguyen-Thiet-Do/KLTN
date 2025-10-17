# Hướng dẫn Authentication cho BookTech

## 🔐 Tổng quan hệ thống

BookTech sử dụng JWT (JSON Web Token) để xác thực người dùng với cấu trúc database riêng biệt cho từng loại người dùng.

## 📊 Cấu trúc Database

### Bảng chính:
- **`roles`** - Định nghĩa vai trò và quyền hạn
- **`accounts`** - Tài khoản đăng nhập chung
- **`doc_gia`** - Thông tin chi tiết độc giả
- **`thu_thu`** - Thông tin chi tiết thủ thư

### Roles có sẵn:
1. **`doc_gia`** - Độc giả thư viện
2. **`thu_thu`** - Thủ thư
3. **`quan_ly`** - Quản lý thư viện  
4. **`admin`** - Quản trị hệ thống

## 🚀 Quy trình đăng nhập

### 1. Client gửi thông tin đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "docgia01",
  "password": "123456"
}
```

### 2. Server xử lý:
1. Kiểm tra tài khoản có bị khóa không
2. Tìm user trong bảng `accounts`
3. Verify password với bcrypt
4. Lấy thông tin đầy đủ từ view `user_login_info`
5. Tạo JWT token chứa thông tin user
6. Cập nhật `last_login` và reset `login_attempts`

### 3. Response thành công:
```json
{
  "success": true,
  "user": {
    "account_id": "uuid",
    "username": "docgia01",
    "email": "docgia01@booktech.com",
    "role_name": "doc_gia",
    "full_name": "Trần Thị Đọc",
    "user_code": "DG001",
    "permissions": ["read_books", "borrow_books", "review_books"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Đăng nhập thành công"
}
```

## 🔑 JWT Token Structure

### Payload chứa:
```json
{
  "id": "account_id",
  "username": "docgia01",
  "email": "docgia01@booktech.com", 
  "role": "doc_gia",
  "fullName": "Trần Thị Đọc",
  "userCode": "DG001",
  "permissions": ["read_books", "borrow_books"],
  "iat": 1635724800,
  "exp": 1636329600
}
```

## 🛡️ Middleware Authentication

### 1. Basic Auth Middleware
```javascript
const { auth } = require('../middleware/auth_separate');

// Sử dụng trong routes
router.get('/protected', auth, (req, res) => {
  // req.user chứa thông tin user đã decode từ JWT
  res.json({ user: req.user });
});
```

### 2. Role-based Authorization
```javascript
const { requireRole } = require('../middleware/auth_separate');

// Chỉ thủ thư mới truy cập được
router.get('/librarian-only', auth, requireRole('thu_thu', 'quan_ly'), (req, res) => {
  res.json({ message: 'Chỉ thủ thư mới thấy được' });
});
```

### 3. Permission-based Authorization
```javascript
const { requirePermission } = require('../middleware/auth_separate');

// Cần quyền cụ thể
router.post('/manage-books', auth, requirePermission('manage_books'), (req, res) => {
  res.json({ message: 'Có quyền quản lý sách' });
});
```

## 📱 Frontend Integration

### 1. Lưu token sau khi login
```dart
// Flutter - Lưu token vào secure storage
await storage.write(key: 'auth_token', value: token);
```

### 2. Gửi token trong API calls
```dart
// Flutter - Thêm token vào header
final response = await http.get(
  Uri.parse('$baseUrl/api/books'),
  headers: {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  },
);
```

### 3. Handle token expiry
```dart
// Flutter - Kiểm tra response 401 và redirect login
if (response.statusCode == 401) {
  // Token hết hạn, redirect về login
  Navigator.pushReplacementNamed(context, '/login');
}
```

## 🔒 Security Features

### 1. Account Lockout
- Sau 5 lần đăng nhập sai → khóa tài khoản 15 phút
- Rate limiting theo IP address
- Auto unlock sau thời gian quy định

### 2. Password Security
- Bcrypt với salt rounds = 12
- Minimum 6 characters
- Password reset với token có thời hạn

### 3. Token Security
- JWT expires in 7 days (configurable)
- Strong secret key
- Token blacklist khi logout (optional)

## 📋 API Endpoints

### Authentication
```http
POST   /api/auth/login              # Đăng nhập
POST   /api/auth/register           # Đăng ký (chỉ doc_gia, thu_thu)
GET    /api/auth/me                 # Thông tin user hiện tại
PUT    /api/auth/profile            # Cập nhật profile
POST   /api/auth/change-password    # Đổi mật khẩu
POST   /api/auth/logout             # Đăng xuất
GET    /api/auth/check-permission/:permission  # Kiểm tra quyền
```

### Role Management (Admin only)
```http
GET    /api/auth/roles              # Danh sách roles
```

## 🧪 Testing Authentication

### 1. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "docgia01",
    "password": "123456"
  }'
```

### 2. Test Protected Route
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Test Permission
```bash
curl -X GET http://localhost:3000/api/auth/check-permission/manage_books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚨 Error Handling

### Common Error Responses:
```json
// 401 - Unauthorized
{
  "success": false,
  "message": "Token đã hết hạn. Vui lòng đăng nhập lại."
}

// 403 - Forbidden  
{
  "success": false,
  "message": "Không có quyền manage_books"
}

// 429 - Too Many Requests
{
  "success": false,
  "message": "IP đã bị khóa do đăng nhập sai quá nhiều lần. Thử lại sau 15 phút."
}
```

## 🔧 Configuration

### Environment Variables:
```env
# JWT Configuration
JWT_SECRET=your_super_secret_key_here_at_least_32_characters
JWT_EXPIRES_IN=7d

# Database
DB_HOST=localhost
DB_USER=booktech_user
DB_PASSWORD=your_password
DB_NAME=booktech_db

# Security
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME_MINUTES=15
```

## 📝 Best Practices

1. **Token Storage**: Sử dụng secure storage trên mobile
2. **HTTPS**: Luôn sử dụng HTTPS trong production
3. **Token Refresh**: Implement refresh token cho UX tốt hơn
4. **Logging**: Log tất cả authentication events
5. **Monitoring**: Monitor failed login attempts
6. **Backup**: Regular backup database với encrypted passwords

---

**Lưu ý**: Đây là hệ thống authentication hoàn chỉnh với security tốt cho ứng dụng quản lý thư viện.
