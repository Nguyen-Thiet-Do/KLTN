import '../../domain/entities/book_entity.dart';

/// Data Model - Data Layer
/// Xử lý serialization/deserialization với database/API
/// Extends từ BookEntity để kế thừa business logic
class BookModel extends BookEntity {
  const BookModel({
    required super.id,
    required super.title,
    required super.author,
    required super.imageUrl,
    required super.rating,
    required super.description,
    required super.category,
    required super.pages,
    super.publishedDate,
    super.isFavorite,
    super.readingStatus,
  });

  /// Factory constructor từ JSON (API response)
  factory BookModel.fromJson(Map<String, dynamic> json) {
    return BookModel(
      id: json['id'] as String,
      title: json['title'] as String,
      author: json['author'] as String,
      imageUrl: json['image_url'] as String,
      rating: (json['rating'] as num).toDouble(),
      description: json['description'] as String,
      category: json['category'] as String,
      pages: json['pages'] as int,
      publishedDate: json['published_date'] != null
          ? DateTime.parse(json['published_date'] as String)
          : null,
      isFavorite: json['is_favorite'] as bool? ?? false,
      readingStatus: _readingStatusFromString(
        json['reading_status'] as String?,
      ),
    );
  }

  /// Convert to JSON (để gửi lên API)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'author': author,
      'image_url': imageUrl,
      'rating': rating,
      'description': description,
      'category': category,
      'pages': pages,
      'published_date': publishedDate?.toIso8601String(),
      'is_favorite': isFavorite,
      'reading_status': _readingStatusToString(readingStatus),
    };
  }

  /// Factory constructor từ Database Map (SQLite)
  factory BookModel.fromDatabase(Map<String, dynamic> map) {
    return BookModel(
      id: map['id'] as String,
      title: map['title'] as String,
      author: map['author'] as String,
      imageUrl: map['image_url'] as String,
      rating: map['rating'] as double,
      description: map['description'] as String,
      category: map['category'] as String,
      pages: map['pages'] as int,
      publishedDate: map['published_date'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['published_date'] as int)
          : null,
      isFavorite: (map['is_favorite'] as int) == 1,
      readingStatus: _readingStatusFromString(map['reading_status'] as String?),
    );
  }

  /// Convert to Database Map (SQLite)
  Map<String, dynamic> toDatabase() {
    return {
      'id': id,
      'title': title,
      'author': author,
      'image_url': imageUrl,
      'rating': rating,
      'description': description,
      'category': category,
      'pages': pages,
      'published_date': publishedDate?.millisecondsSinceEpoch,
      'is_favorite': isFavorite ? 1 : 0,
      'reading_status': _readingStatusToString(readingStatus),
    };
  }

  /// Convert từ Entity sang Model
  factory BookModel.fromEntity(BookEntity entity) {
    return BookModel(
      id: entity.id,
      title: entity.title,
      author: entity.author,
      imageUrl: entity.imageUrl,
      rating: entity.rating,
      description: entity.description,
      category: entity.category,
      pages: entity.pages,
      publishedDate: entity.publishedDate,
      isFavorite: entity.isFavorite,
      readingStatus: entity.readingStatus,
    );
  }

  /// Helper methods cho ReadingStatus conversion
  static ReadingStatus _readingStatusFromString(String? status) {
    switch (status) {
      case 'reading':
        return ReadingStatus.reading;
      case 'completed':
        return ReadingStatus.completed;
      case 'paused':
        return ReadingStatus.paused;
      default:
        return ReadingStatus.notStarted;
    }
  }

  static String _readingStatusToString(ReadingStatus status) {
    switch (status) {
      case ReadingStatus.reading:
        return 'reading';
      case ReadingStatus.completed:
        return 'completed';
      case ReadingStatus.paused:
        return 'paused';
      case ReadingStatus.notStarted:
        return 'not_started';
    }
  }

  /// Dữ liệu mẫu cho testing
  static List<BookModel> get sampleBooks => [
    const BookModel(
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      imageUrl:
          "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg",
      rating: 4.8,
      description: "A Handbook of Agile Software Craftsmanship",
      category: "Programming",
      pages: 464,
    ),
    const BookModel(
      id: "2",
      title: "Flutter in Action",
      author: "Eric Windmill",
      imageUrl:
          "https://m.media-amazon.com/images/I/51JjMQbOTpL._SX397_BO1,204,203,200_.jpg",
      rating: 4.6,
      description: "Build beautiful, cross-platform mobile apps with Flutter",
      category: "Mobile Development",
      pages: 368,
    ),
    BookModel(
      id: "3",
      title: "Design Patterns",
      author: "Gang of Four",
      imageUrl:
          "https://m.media-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
      rating: 4.7,
      description: "Elements of Reusable Object-Oriented Software",
      category: "Software Engineering",
      pages: 395,
    ),
    BookModel(
      id: "4",
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      imageUrl:
          "https://m.media-amazon.com/images/I/41as+WafrFL._SX396_BO1,204,203,200_.jpg",
      rating: 4.9,
      description: "Your Journey to Mastery",
      category: "Programming",
      pages: 352,
    ),
    BookModel(
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
