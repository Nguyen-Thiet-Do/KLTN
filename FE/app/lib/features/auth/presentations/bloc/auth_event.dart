import 'package:equatable/equatable.dart';
import '../../domain/entities/account_entity.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthLoginRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class AuthRegisterRequested extends AuthEvent {
  final Map<String, dynamic> registerData;

  const AuthRegisterRequested({required this.registerData});

  @override
  List<Object?> get props => [registerData];
}

class AuthLogoutRequested extends AuthEvent {
  const AuthLogoutRequested();
}

class AuthTokenRefreshRequested extends AuthEvent {
  const AuthTokenRefreshRequested();
}

class AuthCheckLoginStatus extends AuthEvent {
  const AuthCheckLoginStatus();
}

class AuthClearError extends AuthEvent {
  const AuthClearError();
}
