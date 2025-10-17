class AppBanner {
  final String imageUrl;
  final String title;
  final String description;

  AppBanner({
    required this.imageUrl,
    required this.title,
    required this.description,
  });

  static List<AppBanner> appBannerList = [
    AppBanner(
      imageUrl:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Khám phá thế giới sách',
      description: 'Hàng ngàn cuốn sách đang chờ bạn',
    ),
    AppBanner(
      imageUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Sách mới nhất',
      description: 'Cập nhật những cuốn sách hot nhất',
    ),
    AppBanner(
      imageUrl:
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Đọc mọi lúc mọi nơi',
      description: 'Trải nghiệm đọc sách tuyệt vời',
    ),
  ];
}
