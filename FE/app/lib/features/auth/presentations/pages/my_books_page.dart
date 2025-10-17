import 'package:flutter/material.dart';
import 'package:book_tech/core/theme/app_palette.dart';

class MyBooksPage extends StatefulWidget {
  const MyBooksPage({super.key});

  @override
  State<MyBooksPage> createState() => _MyBooksPageState();
}

class _MyBooksPageState extends State<MyBooksPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sách của tôi'),
        backgroundColor: AppPalette.gradient1,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Tab bar for different categories
            DefaultTabController(
              length: 3,
              child: Column(
                children: [
                  TabBar(
                    labelColor: AppPalette.gradient1,
                    unselectedLabelColor: Colors.grey,
                    indicatorColor: AppPalette.gradient1,
                    tabs: const [
                      Tab(text: 'Đang đọc'),
                      Tab(text: 'Yêu thích'),
                      Tab(text: 'Đã đọc'),
                    ],
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.6,
                    child: TabBarView(
                      children: [
                        // Đang đọc
                        _buildEmptyState(
                          'Chưa có sách đang đọc',
                          Icons.menu_book,
                        ),
                        // Yêu thích
                        _buildEmptyState(
                          'Chưa có sách yêu thích',
                          Icons.favorite,
                        ),
                        // Đã đọc
                        _buildEmptyState(
                          'Chưa có sách đã đọc',
                          Icons.check_circle,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: const Color.fromARGB(255, 208, 51, 51)),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              // TODO: Navigate to search page
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppPalette.gradient1,
              foregroundColor: Colors.white,
            ),
            child: const Text('Khám phá sách'),
          ),
        ],
      ),
    );
  }
}
