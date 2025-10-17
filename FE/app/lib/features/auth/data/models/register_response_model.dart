import 'package:equatable/equatable.dart';
import '../../domain/entities/register_response.dart';
import 'account_model.dart';

class RegisterResponseModel extends Equatable {
  final bool success;
  final String message;
  final AccountModel? data;

  const RegisterResponseModel({
    required this.success,
    required this.message,
    this.data,
  });

  factory RegisterResponseModel.fromJson(Map<String, dynamic> json) {
    return RegisterResponseModel(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? AccountModel.fromJson(json['data']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {'success': success, 'message': message, 'data': data?.toJson()};
  }

  RegisterResponse toEntity() {
    return RegisterResponse(
      success: success,
      message: message,
      data: data?.toEntity(),
    );
  }

  @override
  List<Object?> get props => [success, message, data];
}
