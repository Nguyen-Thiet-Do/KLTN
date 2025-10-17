import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/auth_repository.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/account_entity.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_event.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthenticationRepository _authRepository;
  DateTime? _lastLoginAttempt;

  AuthBloc({required AuthenticationRepository authRepository})
    : _authRepository = authRepository,
      super(const AuthInitial()) {
    on<AuthLoginRequested>(_onLoginRequested);
    on<AuthRegisterRequested>(_onRegisterRequested);
    on<AuthLogoutRequested>(_onLogoutRequested);
    on<AuthTokenRefreshRequested>(_onTokenRefreshRequested);
    on<AuthCheckLoginStatus>(_onCheckLoginStatus);
    on<AuthClearError>(_onClearError);
  }

  Future<void> _onLoginRequested(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      //Validation form
      final validationError = _validateLoginForm(event.email, event.password);
      if (validationError != null) {
        emit(AuthError(message: validationError));
        return;
      }

      emit(const AuthLoading());

      final response = await _authRepository.login(
        event.email.trim(),
        event.password,
      );

      if (response.success && response.data != null) {
        emit(AuthLoginSuccess(account: response.data!));
        emit(AuthAuthenticated(account: response.data!));
      } else {
        emit(AuthError(message: response.message));
      }
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onRegisterRequested(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading());

      final response = await _authRepository.register(event.registerData);

      if (response.success && response.data != null) {
        emit(AuthRegisterSuccess(account: response.data!));
        emit(AuthAuthenticated(account: response.data!));
      } else {
        emit(AuthError(message: response.message));
      }
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading());

      await _authRepository.logout();

      emit(const AuthLogoutSuccess());
      emit(const AuthUnauthenticated());
    } catch (e) {
      // Ngay cả khi logout thất bại, vẫn chuyển về unauthenticated
      emit(const AuthLogoutSuccess());
      emit(const AuthUnauthenticated());
    }
  }

  Future<void> _onTokenRefreshRequested(
    AuthTokenRefreshRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      // Không emit loading để tránh flicker UI
      final response = await _authRepository.refreshToken();

      if (response != null && response.success && response.data != null) {
        emit(AuthAuthenticated(account: response.data!));
      } else {
        emit(const AuthUnauthenticated());
      }
    } catch (e) {
      emit(const AuthUnauthenticated());
    }
  }

  Future<void> _onCheckLoginStatus(
    AuthCheckLoginStatus event,
    Emitter<AuthState> emit,
  ) async {
    try {
      // Không emit loading state ở đây
      final isLoggedIn = await _authRepository.isLoggedIn();

      if (isLoggedIn) {
        final account = await _authRepository.getCurrentUser();
        if (account != null) {
          emit(AuthAuthenticated(account: account));
        } else {
          emit(const AuthUnauthenticated());
        }
      } else {
        emit(const AuthUnauthenticated());
      }
    } catch (e) {
      emit(const AuthUnauthenticated());
    }
  }

  void _onClearError(AuthClearError event, Emitter<AuthState> emit) {
    if (state is AuthError) {
      //  Quay lại state trước đó khi clear error
      final previousState = (state as AuthError).previousState;
      if (previousState != null) {
        emit(previousState);
      } else {
        emit(const AuthUnauthenticated());
      }
    }
  }
}

String? _validateLoginForm(String email, String password) {
  if (email.isEmpty || password.isEmpty) {
    return 'Vui lòng nhập đầy đủ email và mật khẩu';
  }

  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email)) {
    return 'Email không hợp lệ';
  }

  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return null;
}
