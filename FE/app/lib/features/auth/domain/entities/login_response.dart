import 'package:equatable/equatable.dart';
import 'account_entity.dart';

class LoginResponse {
  final bool success;
  final String message;
  final Account? data;

  LoginResponse({required this.success, required this.message, this.data});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is LoginResponse &&
        other.success == success &&
        other.message == message &&
        other.data == data;
  }

  @override
  int get hashCode => success.hashCode ^ message.hashCode ^ data.hashCode;
}
