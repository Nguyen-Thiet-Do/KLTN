import 'account_entity.dart';

class RegisterResponse {
  final bool success;
  final String message;
  final Account? data;

  RegisterResponse({required this.success, required this.message, this.data});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is RegisterResponse &&
        other.success == success &&
        other.message == message &&
        other.data == data;
  }

  @override
  int get hashCode => success.hashCode ^ message.hashCode ^ data.hashCode;
}
