# BookTech Backend API

Backend API cho hệ thống quản lý thư viện BookTech được xây dựng bằng Node.js, Express và MongoDB.

## 🚀 Tính năng

- **Authentication & Authorization**: JWT-based auth với role-based access control
- **Book Management**: CRUD operations cho sách với tìm kiếm, phân loại, đánh giá
- **User Management**: Quản lý người dùng với profile, thống kê đọc sách
- **Favorites & Reviews**: Hệ thống yêu thích và đánh giá sách
- **Reading Progress**: Theo dõi tiến độ đọc sách của người dùng
- **Search & Filter**: Tìm kiếm nâng cao với nhiều tiêu chí
- **Statistics**: Thống kê chi tiết cho admin và user

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm hoặc yarn

## 🛠️ Cài đặt

1. **Clone repository và di chuyển vào thư mục backend**
```bash
cd backend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Tạo file environment**
```bash
cp .env.example .env
```

4. **Cấu hình environment variables trong file .env**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/booktech
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

5. **Khởi động MongoDB**
```bash
# Nếu sử dụng MongoDB local
mongod

# Hoặc sử dụng Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

6. **Chạy server**
```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Book Endpoints

#### Get All Books
```http
GET /api/books?page=1&limit=10&category=Programming&search=flutter
```

#### Get Book by ID
```http
GET /api/books/:id
```

#### Create Book (Auth required)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "description": "A handbook of agile software craftsmanship",
  "category": "Programming",
  "pages": 464,
  "isbn": "978-0132350884",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Search Books
```http
GET /api/books/search?q=flutter&page=1&limit=10
```

#### Toggle Favorite
```http
POST /api/books/:id/favorite
Authorization: Bearer <token>
```

#### Add Review
```http
POST /api/books/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent book!"
}
```

### User Endpoints

#### Get User Books
```http
GET /api/users/:id/books?type=favorites&page=1&limit=10
Authorization: Bearer <token>
```

## 🗂️ Cấu trúc dự án

```
backend/
├── models/           # MongoDB models
│   ├── Book.js
│   └── User.js
├── routes/           # API routes
│   ├── auth.js
│   ├── books.js
│   └── users.js
├── middleware/       # Custom middleware
│   └── auth.js
├── uploads/          # File uploads
├── .env.example      # Environment variables template
├── server.js         # Main server file
├── package.json      # Dependencies
└── README.md
```

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication. Sau khi login thành công, client sẽ nhận được token và cần gửi token này trong header cho các request cần authentication:

```http
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **user**: Người dùng thông thường - có thể xem, yêu thích, đánh giá sách
- **librarian**: Thủ thư - có thể quản lý sách
- **admin**: Quản trị viên - có thể quản lý tất cả

## 📊 Response Format

Tất cả API responses đều có format chuẩn:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // Chỉ có khi cần thiết
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Chi tiết lỗi validation
}
```

## 🔍 Query Parameters

### Pagination
- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 10, max: 100)

### Sorting
- `sortBy`: Field để sort (title, author, rating, createdAt, pages)
- `sortOrder`: asc hoặc desc (default: desc)

### Filtering
- `category`: Lọc theo category
- `search`: Tìm kiếm trong title, author, description

## 🧪 Testing

```bash
# Chạy tests
npm test

# Test với coverage
npm run test:coverage
```

## 🚀 Deployment

### Sử dụng PM2
```bash
# Cài đặt PM2
npm install -g pm2

# Start application
pm2 start server.js --name booktech-api

# Monitor
pm2 monit
```

### Environment Variables cho Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-production-secret
```

## 📝 API Testing với Postman

1. Import collection từ file `postman_collection.json`
2. Set environment variables:
   - `base_url`: http://localhost:3000/api
   - `token`: JWT token sau khi login

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Nếu có vấn đề gì, hãy tạo issue trên GitHub hoặc liên hệ team phát triển.

---

**BookTech Team** 📚✨
