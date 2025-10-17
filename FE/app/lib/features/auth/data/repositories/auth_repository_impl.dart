import '../../domain/entities/account_entity.dart';
import '../../domain/entities/login_response.dart';
import '../../domain/entities/register_response.dart';
import '../../domain/repositories/auth_repository.dart';
import '../models/account_model.dart';
import '../models/login_response_model.dart';
import '../models/register_response_model.dart';
import '../datasources/authentication_remote_data_source.dart';
import '../datasources/local_storage_data_source.dart';

class AuthenticationRepositoryImpl implements AuthenticationRepository {
  final AuthenticationRemoteDataSource remoteDataSource;
  final LocalStorageDataSource localStorageDataSource;

  AuthenticationRepositoryImpl({
    required this.remoteDataSource,
    required this.localStorageDataSource,
  });

  @override
  Future<LoginResponse> login(String email, String password) async {
    try {
      print('🔐 Starting login process for: $email');

      // Validation cơ bản
      if (email.isEmpty || password.isEmpty) {
        throw Exception('Email và password không được để trống');
      }

      final LoginResponseModel response = await remoteDataSource.login(
        email,

        password,
      );

      if (response.success && response.data != null) {
        // Kiểm tra token trước khi lưu
        if (response.data!.accessToken == null ||
            response.data!.refreshToken == null) {
          throw Exception('Token không hợp lệ từ server');
        }

        // LƯU TOKEN VÀ ACCOUNT DATA
        await Future.wait([
          localStorageDataSource.saveTokens(
            response.data!.accessToken!, // Thêm ! vì đã check null ở trên
            response.data!.refreshToken!, // Thêm ! vì đã check null ở trên
          ),
          localStorageDataSource.saveAccount(response.data!),
        ]);

        print(
          ' Login successful, tokens and account saved for: ${response.data!.email}',
        );
        print(' User role: ${response.data!.roleId}');
      } else {
        print(' Login failed: ${response.message}');
        // Không clear data ở đây vì có thể user chỉ nhập sai password
      }

      return response.toEntity(); // ✅ Trả về Entity thay vì Model
    } catch (e) {
      print('Login error: $e');

      // Phân loại lỗi để xử lý phù hợp
      if (e.toString().contains('Network') || e.toString().contains('mạng')) {
        throw Exception('Lỗi kết nối mạng. Vui lòng kiểm tra internet');
      } else if (e.toString().contains('Format')) {
        throw Exception('Lỗi xử lý dữ liệu từ server');
      } else {
        throw Exception(
          'Đăng nhập thất bại: ${e.toString().replaceFirst('Exception: ', '')}',
        );
      }
    }
  }

  @override
  Future<RegisterResponse> register(Map<String, dynamic> data) async {
    try {
      print('📝 Starting registration process for: ${data['email']}');

      // Validation dữ liệu đăng ký
      if (data['email'] == null || data['password'] == null) {
        throw Exception('Email và password là bắt buộc');
      }

      if ((data['password'] as String).length < 6) {
        throw Exception('Mật khẩu phải có ít nhất 6 ký tự');
      }

      final RegisterResponseModel response = await remoteDataSource.register(
        data,
      );

      if (response.success && response.data != null) {
        print('✅ Registration successful for: ${data['email']}');

        // Tùy chọn: Auto-login sau khi register thành công
        // await _autoLoginAfterRegister(data['email'], data['password']);
      } else {
        print(' Registration failed: ${response.message}');
      }

      return response.toEntity(); // ✅ Trả về Entity thay vì Model
    } catch (e) {
      print(' Registration error: $e');

      // Xử lý lỗi cụ thể cho đăng ký
      final errorMessage = e.toString();
      if (errorMessage.contains('Email already exists') ||
          errorMessage.contains('Email đã tồn tại')) {
        throw Exception('Email đã được sử dụng');
      } else if (errorMessage.contains('Network')) {
        throw Exception('Lỗi kết nối mạng. Vui lòng kiểm tra internet');
      } else {
        throw Exception(
          'Đăng ký thất bại: ${errorMessage.replaceFirst('Exception: ', '')}',
        );
      }
    }
  }

  @override
  Future<void> logout() async {
    try {
      print(' Starting logout process...');

      // Lấy access token trước khi clear data
      final accessToken = await localStorageDataSource.getAccessToken();

      // Gọi API logout nếu có token (không bắt buộc thành công)
      if (accessToken != null && accessToken.isNotEmpty) {
        try {
          await remoteDataSource.logout(accessToken);
          print(' Logout API call successful');
        } catch (e) {
          print(' Logout API call failed but continuing: $e');
          // Vẫn tiếp tục clear local data dù API call thất bại
        }
      }

      // Luôn clear local data
      await localStorageDataSource.clearAllData();
      print('Logout completed successfully');
    } catch (e) {
      print(' Logout error: $e');
      // Vẫn clear local data ngay cả khi có lỗi
      await localStorageDataSource.clearAllData();
      throw Exception('Đăng xuất hoàn tất nhưng có lỗi xảy ra');
    }
  }

  @override
  Future<bool> isLoggedIn() async {
    try {
      final isLoggedIn = await localStorageDataSource.isLoggedIn();
      print('🔍 Login status check: $isLoggedIn');

      if (isLoggedIn) {
        // Kiểm tra thêm xem token có hết hạn không (nếu cần)
        // final isTokenValid = await _checkTokenValidity();
        // return isTokenValid;
      }

      return isLoggedIn;
    } catch (e) {
      print(' Error checking login status: $e');
      // Khi có lỗi kiểm tra, coi như chưa đăng nhập để bảo mật
      return false;
    }
  }

  @override
  Future<Account?> getCurrentUser() async {
    try {
      final AccountModel? accountModel = await localStorageDataSource
          .getAccount();

      if (accountModel != null) {
        final account = accountModel.toEntity();
        print(
          ' Current user loaded: ${account.email} (Role: ${account.roleId})',
        );
        return account; // ✅ Trả về Account Entity
      } else {
        print(' No current user found');
        return null;
      }
    } catch (e) {
      print(' Error getting current user: $e');
      return null;
    }
  }

  @override
  Future<LoginResponse?> refreshToken() async {
    try {
      final refreshToken = await localStorageDataSource.getRefreshToken();
      if (refreshToken == null) {
        print('❌ No refresh token available for refresh');
        return null;
      }

      print('🔄 Starting token refresh process...');

      final LoginResponseModel response = await remoteDataSource.refreshToken(
        refreshToken,
      );

      if (response.success && response.data != null) {
        // Kiểm tra token trước khi lưu
        if (response.data!.accessToken == null ||
            response.data!.refreshToken == null) {
          throw Exception('Token không hợp lệ từ server');
        }

        await localStorageDataSource.saveTokens(
          response.data!.accessToken!,
          response.data!.refreshToken!,
        );

        print('✅ Token refresh successful');
        return response.toEntity();
      } else {
        print('❌ Token refresh failed: ${response.message}');
        await localStorageDataSource.clearAllData();
        return null;
      }
    } catch (e) {
      print('💥 Token refresh error: $e');

      if (e.toString().contains('401') || e.toString().contains('invalid')) {
        print('🚨 Refresh token invalid, clearing local data...');
        await localStorageDataSource.clearAllData();
      }

      return null;
    }
  }

  @override
  Future<String?> getAccessToken() async {
    try {
      final token = await localStorageDataSource.getAccessToken();
      return token;
    } catch (e) {
      print('💥 Error getting access token: $e');
      return null;
    }
  }

  // Helper method: Auto-login sau khi register (tùy chọn)
  Future<void> _autoLoginAfterRegister(String email, String password) async {
    try {
      print('🔄 Attempting auto-login after registration...');
      await login(email, password);
      print('✅ Auto-login successful after registration');
    } catch (e) {
      print('⚠️ Auto-login failed after registration: $e');
      // Không throw error vì register đã thành công
    }
  }

  // Helper method: Kiểm tra token validity (nếu cần triển khai)
  Future<bool> _checkTokenValidity() async {
    try {
      final token = await localStorageDataSource.getAccessToken();
      if (token == null) return false;

      // Có thể thêm logic kiểm tra JWT expiration ở đây
      // Sử dụng package: jwt_decoder
      return true;
    } catch (e) {
      return false;
    }
  }

  //Helper method: Update user profile (nếu cần)
  Future<void> updateUserProfile(Account updatedAccount) async {
    try {
      // Convert entity to model
      final accountModel = AccountModel(
        accountId: updatedAccount.accountId,
        email: updatedAccount.email,
        phoneNumber: updatedAccount.phoneNumber,
        roleId: updatedAccount.roleId,
        accessToken: updatedAccount.accessToken ?? '',
        refreshToken: updatedAccount.refreshToken ?? '',
      );

      await localStorageDataSource.saveAccount(accountModel);
      print(' User profile updated successfully');
    } catch (e) {
      print(' Error updating user profile: $e');
      throw Exception('Failed to update user profile');
    }
  }
}
