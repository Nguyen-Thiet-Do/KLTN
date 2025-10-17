class Book {
  final String id;
  final String title;
  final String author;
  final String imageUrl;
  final double rating;
  final String description;
  final String category;
  final int pages;

  const Book({
    required this.id,
    required this.title,
    required this.author,
    required this.imageUrl,
    required this.rating,
    required this.description,
    required this.category,
    required this.pages,
  });

  // Dữ liệu mẫu cho sách nổi bật
  static List<Book> featuredBooks = [
    Book(
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      imageUrl: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg",
      rating: 4.8,
      description: "A Handbook of Agile Software Craftsmanship",
      category: "Programming",
      pages: 464,
    ),
    Book(
      id: "2",
      title: "Flutter in Action",
      author: "Eric Windmill",
      imageUrl: "https://m.media-amazon.com/images/I/51JjMQbOTpL._SX397_BO1,204,203,200_.jpg",
      rating: 4.6,
      description: "Build beautiful, cross-platform mobile apps with Flutter",
      category: "Mobile Development",
      pages: 368,
    ),
    Book(
      id: "3",
      title: "Design Patterns",
      author: "Gang of Four",
      imageUrl: "https://m.media-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
      rating: 4.7,
      description: "Elements of Reusable Object-Oriented Software",
      category: "Software Engineering",
      pages: 395,
    ),
    Book(
      id: "4",
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      imageUrl: "https://m.media-amazon.com/images/I/41as+WafrFL._SX396_BO1,204,203,200_.jpg",
      rating: 4.9,
      description: "Your Journey to Mastery",
      category: "Programming",
      pages: 352,
    ),
    Book(
      id: "5",
      title: "Effective Dart",
      author: "Dart Team",
      imageUrl: "https://dart.dev/assets/img/dart-logo-for-shares.png?2",
      rating: 4.5,
      description: "Best practices for Dart programming",
      category: "Programming",
      pages: 280,
    ),
  ];
}
