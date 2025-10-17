# Hướng dẫn cài đặt MySQL Database cho BookTech

## 📋 Yêu cầu hệ thống

- MySQL Server 8.0 hoặc cao hơn
- MySQL Workbench (khuyến nghị) hoặc command line
- Quyền tạo database và user

## 🚀 Cách cài đặt

### Bước 1: Kết nối MySQL
```bash
# Sử dụng command line
mysql -u root -p

# Hoặc sử dụng MySQL Workbench
# Host: localhost
# Port: 3306
# Username: root
```

### Bước 2: Chạy script tạo database
```sql
-- Chạy file booktech_mysql.sql
source /path/to/booktech_mysql.sql;

-- Hoặc copy-paste nội dung file vào MySQL Workbench
```

### Bước 3: Tạo user cho ứng dụng (khuyến nghị)
```sql
-- Tạo user riêng cho ứng dụng
CREATE USER 'booktech_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Cấp quyền cho database
GRANT ALL PRIVILEGES ON booktech_db.* TO 'booktech_user'@'localhost';

-- Áp dụng thay đổi
FLUSH PRIVILEGES;
```

### Bước 4: Kiểm tra cài đặt
```sql
-- Chuyển sang database
USE booktech_db;

-- Kiểm tra các bảng đã tạo
SHOW TABLES;

-- Kiểm tra dữ liệu mẫu
SELECT * FROM categories;
SELECT * FROM books LIMIT 5;
SELECT * FROM users WHERE role = 'admin';
```

## 📊 Cấu trúc Database

### Bảng chính:
- **users** - Quản lý người dùng
- **categories** - Danh mục sách
- **books** - Thông tin sách
- **user_favorites** - Sách yêu thích
- **book_reviews** - Đánh giá sách
- **reading_progress** - Tiến độ đọc
- **user_favorite_categories** - Danh mục yêu thích của user
- **book_loans** - Quản lý mượn sách (tùy chọn)

### Views:
- **popular_books** - Sách phổ biến
- **user_statistics** - Thống kê người dùng

### Stored Procedures:
- **GetRecommendedBooks** - Lấy sách gợi ý
- **GetDashboardStats** - Thống kê tổng quan

## 🔧 Cấu hình cho Backend Node.js

Cập nhật file `.env` trong backend:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=booktech_db
DB_USER=booktech_user
DB_PASSWORD=your_secure_password

# Connection Pool
DB_CONNECTION_LIMIT=10
DB_ACQUIRE_TIMEOUT=60000
DB_TIMEOUT=60000
```

## 📝 Dữ liệu mẫu có sẵn

### Admin User:
- **Email**: admin@booktech.com
- **Password**: admin123
- **Role**: admin

### Categories:
- Programming
- Mobile Development
- Software Engineering
- Data Science
- Web Development
- DevOps
- Artificial Intelligence
- Cybersecurity
- Database
- Other

### Sample Books:
- Clean Code - Robert C. Martin
- Flutter in Action - Eric Windmill
- Design Patterns - Gang of Four
- The Pragmatic Programmer - David Thomas
- Effective Dart - Dart Team

## 🔍 Queries hữu ích

### Lấy sách theo category:
```sql
SELECT b.*, c.name as category_name 
FROM books b 
JOIN categories c ON b.category_id = c.id 
WHERE c.name = 'Programming' AND b.is_active = TRUE;
```

### Lấy sách yêu thích của user:
```sql
SELECT b.*, uf.added_at
FROM books b
JOIN user_favorites uf ON b.id = uf.book_id
WHERE uf.user_id = 'user_id_here'
ORDER BY uf.added_at DESC;
```

### Thống kê sách phổ biến:
```sql
SELECT 
    b.title,
    b.author,
    b.rating,
    b.rating_count,
    COUNT(uf.id) as favorite_count
FROM books b
LEFT JOIN user_favorites uf ON b.id = uf.book_id
WHERE b.is_active = TRUE
GROUP BY b.id
ORDER BY b.rating DESC, favorite_count DESC
LIMIT 10;
```

## 🛠️ Maintenance

### Backup database:
```bash
mysqldump -u booktech_user -p booktech_db > booktech_backup.sql
```

### Restore database:
```bash
mysql -u booktech_user -p booktech_db < booktech_backup.sql
```

### Optimize tables:
```sql
OPTIMIZE TABLE books, users, user_favorites, book_reviews;
```

## 🚨 Lưu ý quan trọng

1. **Bảo mật**: Thay đổi mật khẩu mặc định của admin user
2. **Backup**: Thiết lập backup tự động cho production
3. **Indexes**: Database đã có indexes tối ưu, không cần thêm
4. **Triggers**: Có triggers tự động cập nhật thống kê
5. **Constraints**: Có các ràng buộc đảm bảo tính toàn vẹn dữ liệu

## 📞 Troubleshooting

### Lỗi kết nối:
```sql
-- Kiểm tra user và quyền
SELECT user, host FROM mysql.user WHERE user = 'booktech_user';
SHOW GRANTS FOR 'booktech_user'@'localhost';
```

### Lỗi charset:
```sql
-- Kiểm tra charset
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

### Performance issues:
```sql
-- Kiểm tra slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```
