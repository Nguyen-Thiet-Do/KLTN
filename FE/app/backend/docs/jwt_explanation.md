# JWT (JSON Web Token) trong BookTech

## 🔐 JWT là gì?

JWT là một chuẩn mở (RFC 7519) để truyền thông tin an toàn giữa các bên dưới dạng JSON object. JWT được ký số để xác thực tính toàn vẹn.

## 📋 Cấu trúc JWT

JWT gồm 3 phần cách nhau bởi dấu chấm (.):

```
header.payload.signature
```

### 1. Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload (Claims)
```json
{
  "id": "user_id_123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1635724800,
  "exp": 1636329600
}
```

### 3. Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## 🔧 Cách JWT hoạt động trong BookTech

### Quá trình đăng nhập:
1. User gửi email/password
2. Server xác thực thông tin
3. Server tạo JWT token chứa user info
4. Client lưu token (localStorage/secure storage)
5. Client gửi token trong header cho các request tiếp theo

### Ví dụ token trong BookTech:
```javascript
// Tạo token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

## 🛡️ Bảo mật JWT

### Lưu trữ an toàn:
- **Web**: HttpOnly cookies (khuyến nghị) hoặc localStorage
- **Mobile**: Secure storage (Keychain/Keystore)
- **Không bao giờ** lưu trong localStorage nếu có XSS risk

### Thời gian hết hạn:
- **Access Token**: 15 phút - 1 giờ
- **Refresh Token**: 7-30 ngày
- **Remember Me**: 90 ngày

### Best Practices:
- Sử dụng strong secret key
- Implement token refresh mechanism
- Blacklist tokens khi logout
- Validate token ở mọi protected route
