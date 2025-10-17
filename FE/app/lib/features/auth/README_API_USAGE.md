# Hướng dẫn sử dụng API Authentication

## Tổng quan
Đã implement đầy đủ hệ thống authentication với API endpoint: `https://kltn-2025-ehsx.onrender.com/api/auth/login`

## Cấu trúc files đã tạo

### 1. Data Sources
- `authentication_remote_data_source.dart`: Xử lý các API calls
- `local_storage_data_source.dart`: Lưu trữ token và user data local

### 2. Repository
- `auth_repository_impl.dart`: Implementation của AuthenticationRepository

### 3. Service
- `auth_service.dart`: Service class để dễ dàng sử dụng trong UI

### 4. Examples & Test
- `auth_example.dart`: Code examples để test API
- `auth_test_widget.dart`: Widget UI để test API

## Cách sử dụng

### 1. Sử dụng AuthService (Khuyến nghị)

```dart
import 'package:book_tech/features/auth/data/services/auth_service.dart';

// Khởi tạo service
final authService = AuthService();
authService.initialize();

// Đăng nhập
try {
  final response = await authService.login('email@example.com', 'password');
  if (response.success) {
    print('Đăng nhập thành công!');
    print('User: ${response.data?.email}');
  }
} catch (e) {
  print('Lỗi: $e');
}

// Đăng ký
try {
  final response = await authService.register(
    'email@example.com',
    '0123456789',
    'password'
  );
  if (response.success) {
    print('Đăng ký thành công!');
  }
} catch (e) {
  print('Lỗi: $e');
}

// Kiểm tra trạng thái đăng nhập
final isLoggedIn = await authService.isLoggedIn();

// Lấy thông tin user hiện tại
final currentUser = await authService.getCurrentUser();

// Đăng xuất
await authService.logout();
```

### 2. Test API qua UI

Để test API, bạn có thể navigate đến route `/auth_test`:

```dart
Navigator.pushNamed(context, '/auth_test');
```

Widget này sẽ cho phép bạn:
- Test đăng nhập với email/password
- Test đăng ký với email/phone/password
- Xem trạng thái đăng nhập
- Đăng xuất

### 3. Sử dụng trong existing pages

Để tích hợp vào các page hiện tại (SignInPage, SignUpPage), bạn có thể:

```dart
// Trong SignInPage
final authService = AuthService();
authService.initialize();

// Khi user nhấn nút đăng nhập
void _handleLogin() async {
  final response = await authService.login(
    _emailController.text,
    _passwordController.text,
  );
  
  if (response.success) {
    // Chuyển đến home page
    Navigator.pushReplacementNamed(context, '/home_page');
  } else {
    // Hiển thị lỗi
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(response.message)),
    );
  }
}
```

## API Endpoints được sử dụng

1. **POST** `/api/auth/login`
   - Body: `{"email": "string", "password": "string"}`
   - Response: `{"success": bool, "message": "string", "data": AccountModel}`

2. **POST** `/api/auth/register`
   - Body: `{"email": "string", "phoneNumber": "string", "password": "string"}`
   - Response: `{"success": bool, "message": "string", "data": AccountModel}`

3. **POST** `/api/auth/refresh` (optional)
   - Headers: `Authorization: Bearer <refresh_token>`
   - Response: `{"success": bool, "message": "string", "data": AccountModel}`

4. **POST** `/api/auth/logout` (optional)
   - Headers: `Authorization: Bearer <access_token>`

## Lưu ý quan trọng

1. **Token Management**: Hệ thống tự động lưu và quản lý access token, refresh token
2. **Local Storage**: Dữ liệu user và token được lưu local bằng SharedPreferences
3. **Error Handling**: Tất cả API calls đều có error handling
4. **Auto Logout**: Nếu refresh token thất bại, user sẽ tự động logout

## Testing

Để test API:
1. Chạy app: `flutter run`
2. Navigate đến `/auth_test` route
3. Nhập thông tin test và thử các chức năng
4. Hoặc sử dụng `AuthExample.runAllExamples()` trong code

## Dependencies cần thiết

Đảm bảo các dependencies này đã có trong `pubspec.yaml`:
```yaml
dependencies:
  http: ^1.1.0
  shared_preferences: ^2.2.2
  equatable: ^2.0.5
```
