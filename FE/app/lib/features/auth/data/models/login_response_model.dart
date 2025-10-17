import 'package:equatable/equatable.dart';
import '../../domain/entities/login_response.dart';
import 'account_model.dart';

class LoginResponseModel extends Equatable {
  final bool success;
  final String message;
  final AccountModel? data;

  const LoginResponseModel({
    required this.success,
    required this.message,
    this.data,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? AccountModel.fromJson(json['data']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {'success': success, 'message': message, 'data': data?.toJson()};
  }

  LoginResponse toEntity() {
    return LoginResponse(
      success: success,
      message: message,
      data: data?.toEntity(),
    );
  }

  @override
  List<Object?> get props => [success, message, data];
}
