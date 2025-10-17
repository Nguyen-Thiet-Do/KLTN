import 'package:dio/dio.dart';
import 'token_interceptor.dart';
import 'package:book_tech/features/auth/data/datasources/local_storage_data_source.dart';

class DioClient {
  static Dio createDio(LocalStorageDataSource localStorage) {
    final dio = Dio(
      BaseOptions(
        baseUrl: 'https://kltn-2025-ehsx.onrender.com/api',
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Thêm interceptors
    dio.interceptors.add(
      TokenInterceptor(localStorage: localStorage, dio: dio),
    );

    // Log interceptor (cho development)
    dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
        logPrint: (object) => print(object),
      ),
    );

    return dio;
  }
}
