import 'dart:async';
import 'package:flutter/material.dart';
import 'package:book_tech/core/theme/app_palette.dart';
import 'package:book_tech/features/auth/data/models/appbanner.dart';
import 'package:book_tech/features/auth/data/models/book.dart';
import 'package:book_tech/features/auth/presentations/widgets/home/banner_item.dart';
import 'package:book_tech/features/auth/presentations/widgets/home/page_indicator.dart';
import 'package:book_tech/features/auth/presentations/widgets/home/featured_book_item.dart';

class MainHomePage extends StatefulWidget {
  const MainHomePage({super.key});

  @override
  State<MainHomePage> createState() => _MainHomePageState();
}

class _MainHomePageState extends State<MainHomePage> {
  int _currentBannerIndex = 0;
  late PageController _bannerPageController;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _bannerPageController = PageController(viewportFraction: 0.8);
    _startAutoScroll();
  }

  void _startAutoScroll() {
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_bannerPageController.hasClients) {
        int nextPage =
            (_currentBannerIndex + 1) % AppBanner.appBannerList.length;
        _bannerPageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _bannerPageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(
          255,
          34,
          133,
          225,
        ), // Màu xanh dương như trong hình
        leading: IconButton(
          icon: const Icon(Icons.menu, color: Colors.white),
          onPressed: () {
            // TODO: Implement menu functionality
          },
        ),
        title: Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(2),
          ),
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Tìm kiếm',
              prefixIcon: const Icon(Icons.search, color: Colors.grey),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
            style: const TextStyle(fontSize: 14),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: () {
              // TODO: Implement notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_circle, color: Colors.white),
            onPressed: () {
              // TODO: Implement profile
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 16.0),
                    height: 100,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: PageView.builder(
                      controller: _bannerPageController,
                      itemCount: AppBanner.appBannerList.length,
                      onPageChanged: (index) {
                        setState(() {
                          _currentBannerIndex = index;
                        });
                      },
                      itemBuilder: (context, index) {
                        return BannerItem(index: index);
                      },
                    ),
                  ),
                  const SizedBox(height: 10),
                  PageIndicator(
                    currentPage: _currentBannerIndex,
                    totalPages: AppBanner.appBannerList.length,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Featured Books Section
            Row(
              children: [
                Icon(
                  Icons.star, // hoặc Icons.menu_book
                  color: AppPalette.gradient1,
                  size: 26,
                ),
                const SizedBox(width: 8), // khoảng cách giữa icon và text
                const Text(
                  'Sách nổi bật',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppPalette.gradient1,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 15),
            SizedBox(
              height: 220,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: Book.featuredBooks.length,
                itemBuilder: (context, index) {
                  return FeaturedBookItem(book: Book.featuredBooks[index]);
                },
              ),
            ),
            const SizedBox(height: 30),

            // Recent Activity
            const Text(
              'Hoạt động gần đây',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 15),
            _buildActivityItem('Bạn đã thêm sách vào yêu thích', '2 giờ trước'),
            _buildActivityItem(
              'Bạn đã hoàn thành việc đọc sách',
              '1 ngày trước',
            ),
            _buildActivityItem('Bạn đã tìm kiếm "flutter"', '2 ngày trước'),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
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
        child: Column(
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              subtitle,
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(String activity, String time) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(Icons.history, color: AppPalette.gradient1, size: 20),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(activity, style: const TextStyle(fontSize: 14)),
                Text(
                  time,
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
