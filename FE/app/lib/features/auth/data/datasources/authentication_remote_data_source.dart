import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:http/http.dart' as http;
import '../models/login_response_model.dart';
import '../models/register_response_model.dart';

abstract class AuthenticationRemoteDataSource {
  Future<LoginResponseModel> login(String email, String password);
  Future<RegisterResponseModel> register(Map<String, dynamic> accountData);
  Future<LoginResponseModel> refreshToken(String refreshToken);
  Future<void> logout(String accessToken);
}

class AuthenticationRemoteDataSourceImpl
    implements AuthenticationRemoteDataSource {
  static const String baseUrl = 'https://kltn-2025-ehsx.onrender.com/api';
  static const Duration timeoutDuration = Duration(
    seconds: 60,
  ); // Tăng thời gian timeout

  // Tạo instance của Dio với cấu hình
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: timeoutDuration,
      receiveTimeout: timeoutDuration,
      sendTimeout: timeoutDuration,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  @override
  Future<LoginResponseModel> login(String email, String password) async {
    try {
      print('🔐 Attempting login for: $email');
      print('🌐 Connecting to: $baseUrl/auth/login');

      // Sử dụng Dio thay vì http
      final response = await dio.post(
        '/auth/login',
        data: {'email': email.trim(), 'password': password},
      );

      print('📨 Response status: ${response.statusCode}');
      print('📦 Response data: ${response.data}');

      if (response.statusCode == 200) {
        try {
          return LoginResponseModel.fromJson(response.data);
        } catch (e) {
          print('❌ Error parsing response: $e');
          throw Exception('Lỗi xử lý dữ liệu đăng nhập');
        }
      } else {
        final message = response.data['message'] ?? 'Đăng nhập thất bại';
        throw Exception(message);
      }
    } on DioException catch (e) {
      print('❌ Network error: ${e.message}');
      switch (e.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          throw Exception(
            'Kết nối tới server quá lâu. Vui lòng kiểm tra mạng và thử lại.',
          );
        case DioExceptionType.badResponse:
          final message = e.response?.data?['message'] ?? 'Đăng nhập thất bại';
          throw Exception(message);
        default:
          throw Exception(
            'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
          );
      }
    } catch (e) {
      print('❌ Unexpected error: $e');
      throw Exception('Có lỗi xảy ra trong quá trình đăng nhập');
    }
  }

  @override
  Future<RegisterResponseModel> register(
    Map<String, dynamic> accountData,
  ) async {
    try {
      print('📝 Sending registration data: $accountData');

      final response = await dio.post('/auth/register', data: accountData);

      print('📨 Registration response status: ${response.statusCode}');
      print('📦 Registration response data: ${response.data}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return RegisterResponseModel.fromJson(response.data);
      } else {
        final message = response.data['message'] ?? 'Đăng ký thất bại';
        throw Exception(message);
      }
    } on DioException catch (e) {
      print('❌ Network error during registration: ${e.message}');
      switch (e.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          throw Exception(
            'Kết nối tới server quá lâu. Vui lòng kiểm tra mạng và thử lại.',
          );
        case DioExceptionType.badResponse:
          final message = e.response?.data?['message'] ?? 'Đăng ký thất bại';
          throw Exception(message);
        default:
          throw Exception(
            'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
          );
      }
    } catch (e) {
      print('❌ Unexpected error during registration: $e');
      throw Exception('Có lỗi xảy ra trong quá trình đăng ký');
    }
  }

  @override
  Future<LoginResponseModel> refreshToken(String refreshToken) async {
    try {
      print('🔄 Refreshing token');

      final response = await dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      print('📨 Token refresh response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        return LoginResponseModel.fromJson(response.data);
      } else {
        throw Exception('Không thể làm mới token');
      }
    } on DioException catch (e) {
      print('❌ Token refresh error: ${e.message}');
      throw Exception('Lỗi làm mới token: ${e.message}');
    }
  }

  @override
  Future<void> logout(String accessToken) async {
    try {
      print('🚪 Logging out');

      await dio.post(
        '/auth/logout',
        options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
      );

      print('✅ Logout successful');
    } on DioException catch (e) {
      print('❌ Logout error: ${e.message}');
      throw Exception('Lỗi đăng xuất: ${e.message}');
    }
  }
}
