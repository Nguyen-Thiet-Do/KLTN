import 'package:flutter/material.dart';

class AuthField extends StatelessWidget {
  final String hintText;
  final bool obsecureText;
  final TextEditingController controller;
  final String? errorText;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;
  const AuthField({
    super.key,
    required this.hintText,
    required this.controller,
    this.obsecureText = false,
    this.errorText,
    this.onChanged,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      onChanged: onChanged,
      style: const TextStyle(color: Colors.white),
      validator:
          validator ??
          (value) {
            // Sử dụng validator được truyền vào hoặc validator mặc định
            if (value == null || value.isEmpty) {
              return '$hintText is required';
            }
            return null;
          },
      obscureText: obsecureText,
      decoration: InputDecoration(
        hintText: hintText,
        errorText: errorText,
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Colors.grey,
            width: 1.0,
          ), // khi chưa focus
          borderRadius: BorderRadius.circular(12),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: const Color.fromARGB(255, 40, 34, 217),
            width: 2.0,
          ), // khi focus
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
