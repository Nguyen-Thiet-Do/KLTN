import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:book_tech/features/auth/presentations/pages/sign_up.dart';
import 'package:book_tech/features/auth/presentations/pages/sign_in.dart';
import 'package:book_tech/features/auth/presentations/pages/home_page.dart';
import 'package:book_tech/core/theme/theme.dart';
import 'package:book_tech/core/theme/app_palette.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_bloc.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_event.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_state.dart';
import 'package:book_tech/features/auth/data/datasources/local_storage_data_source.dart';
import 'package:book_tech/features/auth/data/datasources/authentication_remote_data_source.dart';
import 'package:book_tech/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:book_tech/features/auth/presentations/pages/main_home_page.dart';
import 'package:dio/dio.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Khởi tạo các dependencies
  final dio = Dio()
    ..options = BaseOptions(
      baseUrl: 'https://kltn-2025-ehsx.onrender.com/api',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    )
    ..interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
      ),
    );

  final remoteDataSource = AuthenticationRemoteDataSourceImpl();
  final localStorageDataSource = LocalStorageDataSourceImpl();
  final authRepository = AuthenticationRepositoryImpl(
    remoteDataSource: remoteDataSource,
    localStorageDataSource: localStorageDataSource,
  );

  runApp(MyApp(authRepository: authRepository));
}

class MyApp extends StatelessWidget {
  final AuthenticationRepositoryImpl authRepository;

  const MyApp({super.key, required this.authRepository});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          AuthBloc(authRepository: authRepository)
            ..add(const AuthCheckLoginStatus()), // Check ngay khi app start
      child: MaterialApp(
        title: 'Book Tech',
        theme: AppTheme.darkThemeMode,
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        // Log state changes
        print('🔄 Auth state changed: ${state.runtimeType}');

        if (state is AuthAuthenticated) {
          // Navigate to home page when authenticated
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const HomePage()),
          );
        }
      },
      child: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          print('🔄 Building AuthWrapper with state: ${state.runtimeType}');

          if (state is AuthLoading) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }

          // Chỉ trả về SignInPage nếu chưa authenticated
          if (state is! AuthAuthenticated) {
            return const SignInPage();
          }

          // Trả về loading trong khi chuyển trang
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        },
      ),
    );
  }
}
