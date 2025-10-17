import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/account_model.dart';

abstract class LocalStorageDataSource {
  Future<void> saveTokens(String accessToken, String refreshToken);
  Future<String?> getAccessToken();
  Future<String?> getRefreshToken();
  Future<void> saveAccount(AccountModel account);
  Future<AccountModel?> getAccount();
  Future<bool> isLoggedIn();
  Future<void> clearAllData();
  Future<void> updateAccessToken(String newAccessToken);
}

class LocalStorageDataSourceImpl implements LocalStorageDataSource {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _accountKey = 'account_data';
  static const String _isLoggedInKey = 'is_logged_in';

  @override
  Future<void> saveTokens(String accessToken, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await Future.wait([
      prefs.setString(_accessTokenKey, accessToken),
      prefs.setString(_refreshTokenKey, refreshToken),
      prefs.setBool(_isLoggedInKey, true),
    ]);
    print('💾 Tokens saved to local storage');
  }

  @override
  Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_accessTokenKey);
    print(
      '🔑 Access token: ${token != null ? '***${token.substring(token.length - 6)}' : 'null'}',
    );
    return token;
  }

  @override
  Future<String?> getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_refreshTokenKey);
    print(
      '🔄 Refresh token: ${token != null ? '***${token.substring(token.length - 6)}' : 'null'}',
    );
    return token;
  }

  @override
  Future<void> saveAccount(AccountModel account) async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final accountJson = json.encode(account.toJson());
      await prefs.setString(_accountKey, accountJson);
      print('👤 Account data saved: ${account.email}');
    } catch (e) {
      print('❌ Error saving account: $e');
      throw Exception('Failed to save account data');
    }
  }

  @override
  Future<AccountModel?> getAccount() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final accountJson = prefs.getString(_accountKey);

      if (accountJson != null) {
        final Map<String, dynamic> accountData = json.decode(accountJson);
        final account = AccountModel.fromJson(accountData);
        print('👤 Account data loaded: ${account.email}');
        return account;
      }

      print('👤 No account data found');
      return null;
    } catch (e) {
      print('❌ Error loading account: $e');
      return null;
    }
  }

  @override
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final accessToken = await getAccessToken();
    final isLoggedInFlag = prefs.getBool(_isLoggedInKey) ?? false;
    final result =
        accessToken != null && accessToken.isNotEmpty && isLoggedInFlag;
    print('🔐 Is logged in: $result');
    return result;
  }

  @override
  Future<void> clearAllData() async {
    final prefs = await SharedPreferences.getInstance();
    await Future.wait([
      prefs.remove(_accessTokenKey),
      prefs.remove(_refreshTokenKey),
      prefs.remove(_accountKey),
      prefs.remove(_isLoggedInKey),
    ]);
    print('🗑️ All local data cleared');
  }

  @override
  Future<void> updateAccessToken(String newAccessToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_accessTokenKey, newAccessToken);
    print('🔄 Access token updated');
  }

  // Helper method để kiểm tra token expiration (nếu cần)
  Future<bool> isTokenExpired() async {
    final token = await getAccessToken();
    if (token == null) return true;

    try {
      // Giải mã JWT để kiểm tra expiration (cần package: jwt_decoder)
      final parts = token.split('.');
      if (parts.length != 3) return true;

      final payload = json.decode(utf8.decode(base64Url.decode(parts[1])));
      final exp = payload['exp'] as int?;

      if (exp == null) return true;

      final expirationTime = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
      return DateTime.now().isAfter(expirationTime);
    } catch (e) {
      print('❌ Error checking token expiration: $e');
      return true;
    }
  }
}
