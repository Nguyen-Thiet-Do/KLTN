import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:book_tech/core/theme/app_palette.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_bloc.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_event.dart';
import 'package:book_tech/features/auth/presentations/bloc/auth_state.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tài khoản'),
        backgroundColor: AppPalette.gradient1,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Profile Header với thông tin thực tế từ Bloc
            BlocBuilder<AuthBloc, AuthState>(
              builder: (context, state) {
                String userName = 'Người dùng';
                String userEmail = 'user@example.com';

                if (state is AuthAuthenticated) {
                  // Lấy thông tin user từ state nếu có
                  userName = state.account?.fullName ?? 'Người dùng';
                  userEmail = state.account?.email ?? 'user@example.com';
                }

                return Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.1),
                        spreadRadius: 1,
                        blurRadius: 10,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: AppPalette.gradient1,
                        child: const Icon(
                          Icons.person,
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              userName,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              userEmail,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 30),
            // Menu Items
            Expanded(
              child: ListView(
                children: [
                  _buildMenuItem(
                    icon: Icons.edit,
                    title: 'Chỉnh sửa thông tin',
                    onTap: () {
                      // TODO: Navigate to edit profile
                    },
                  ),
                  _buildMenuItem(
                    icon: Icons.notifications,
                    title: 'Thông báo',
                    onTap: () {
                      // TODO: Navigate to notifications settings
                    },
                  ),
                  _buildMenuItem(
                    icon: Icons.security,
                    title: 'Bảo mật',
                    onTap: () {
                      // TODO: Navigate to security settings
                    },
                  ),
                  _buildMenuItem(
                    icon: Icons.help,
                    title: 'Trợ giúp1',
                    onTap: () {
                      // TODO: Navigate to help
                    },
                  ),
                  _buildMenuItem(
                    icon: Icons.info,
                    title: 'Về ứng dụng',
                    onTap: () {
                      // TODO: Show about dialog
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildMenuItem(
                    icon: Icons.logout,
                    title: 'Đăng xuất',
                    textColor: Colors.red,
                    onTap: () {
                      _showLogoutDialog();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Color? textColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: Icon(icon, color: textColor ?? AppPalette.gradient1),
        title: Text(
          title,
          style: TextStyle(color: textColor ?? Colors.black, fontSize: 16),
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: Colors.grey,
        ),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        tileColor: Colors.white,
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Đăng xuất'),
          content: const Text('Bạn có chắc chắn muốn đăng xuất?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Hủy'),
            ),
            TextButton(
              onPressed: () {
                _performLogout(context);
              },
              child: const Text(
                'Đăng xuất',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }

  void _performLogout(BuildContext context) {
    // Đóng dialog
    Navigator.of(context).pop();

    // Hiển thị loading indicator
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    // Dispatch logout event
    context.read<AuthBloc>().add(AuthLogoutRequested());

    // Đợi một chút rồi đóng loading và điều hướng
    Future.delayed(const Duration(milliseconds: 500), () {
      // Đóng loading dialog
      if (Navigator.canPop(context)) {
        Navigator.of(context).pop();
      }

      // Hiển thị thông báo thành công
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Đăng xuất thành công!'),
          backgroundColor: Colors.green,
        ),
      );

      // AuthWrapper sẽ tự động chuyển về SignInPage
    });
  }
}
