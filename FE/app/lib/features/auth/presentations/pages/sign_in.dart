import 'package:book_tech/features/auth/presentations/pages/main_home_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:book_tech/core/theme/theme.dart';
import 'package:book_tech/core/theme/app_palette.dart';
import 'package:book_tech/features/auth/presentations/pages/home_page.dart';
import 'package:book_tech/features/auth/presentations/widgets/auth_field.dart';
import 'package:book_tech/features/auth/presentations/widgets/auth_gradient_button.dart';
import 'package:book_tech/features/auth/presentations/pages/sign_up.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_bloc.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_event.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_state.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          // Nếu đang loading từ sign in action
          if (state is AuthLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          // Form đăng nhập bình thường
          return Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Sign In',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 60,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 30),
                  _buildEmailField(),
                  SizedBox(height: 15),
                  _buildPasswordField(),
                  SizedBox(height: 15),
                  _buildSignInButton(),
                  SizedBox(height: 15),
                  _buildSignUpNavigation(context),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmailField() {
    return AuthField(
      hintText: 'Email',
      controller: _emailController,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Email không được để trống';
        }
        if (!value.contains('@')) {
          return 'Email không hợp lệ';
        }
        return null;
      },
    );
  }

  Widget _buildPasswordField() {
    return AuthField(
      hintText: 'Password',
      controller: _passwordController,
      obsecureText: true,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Mật khẩu không được để trống';
        }
        if (value.length < 6) {
          return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        return null;
      },
    );
  }

  Widget _buildSignInButton() {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        return AuthGradientButton(
          buttonText: 'Sign In',
          onPressed: state is AuthLoading
              ? null // Disable button when loading
              : () => _signIn(context),
          isLoading: state is AuthLoading,
        );
      },
    );
  }

  Widget _buildSignUpNavigation(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SignUpPage()),
        );
      },
      child: RichText(
        text: TextSpan(
          text: 'Don\'t have an account? ',
          style: Theme.of(context).textTheme.titleMedium,
          children: [
            TextSpan(
              text: 'Sign Up',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppPalette.gradient2,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _signIn(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text.trim();
      final password = _passwordController.text;

      print('🔐 Attempting login for email: $email');

      context.read<AuthBloc>().add(
        AuthLoginRequested(email: email, password: password),
      );
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}

void _handleAuthState(BuildContext context, AuthState state) {
  if (state is AuthLoading) {
    // Show loading indicator
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );
  } else if (state is AuthAuthenticated) {
    // Đóng dialog loading nếu có
    if (Navigator.canPop(context)) {
      Navigator.pop(context);
    }

    // Điều hướng đến trang chủ
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const HomePage()),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đăng nhập thành công!'),
        backgroundColor: Colors.green,
      ),
    );
  } else if (state is AuthError) {
    // Đóng dialog loading nếu có
    if (Navigator.canPop(context)) {
      Navigator.pop(context);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(state.message), backgroundColor: Colors.red),
    );
  }
}

// Helper methods để lấy controllers (trong thực tế nên dùng TextEditingController riêng)
TextEditingController _getEmailController(BuildContext context) {
  // Trong thực tế, bạn nên quản lý controllers trong state
  return TextEditingController();
}

TextEditingController _getPasswordController(BuildContext context) {
  // Trong thực tế, bạn nên quản lý controllers trong state
  return TextEditingController();
}

String? _getEmailError(AuthState state) {
  if (state is AuthError) {
    final error = state.message.toLowerCase();
    if (error.contains('email')) {
      return state.message;
    }
  }
  return null;
}

String? _getPasswordError(AuthState state) {
  if (state is AuthError) {
    final error = state.message.toLowerCase();
    if (error.contains('mật khẩu') || error.contains('password')) {
      return state.message;
    }
  }
  return null;
}
