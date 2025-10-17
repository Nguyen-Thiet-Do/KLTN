import 'package:equatable/equatable.dart';

/// Domain Entity - Business Logic Layer
/// Đại diện cho Book trong business logic thuần túy
/// Không phụ thuộc vào framework hay database
class BookEntity extends Equatable {
  final String id;
  final String title;
  final String author;
  final String imageUrl;
  final double rating;
  final String description;
  final String category;
  final int pages;
  final DateTime? publishedDate;
  final bool isFavorite;
  final ReadingStatus readingStatus;

  const BookEntity({
    required this.id,
    required this.title,
    required this.author,
    required this.imageUrl,
    required this.rating,
    required this.description,
    required this.category,
    required this.pages,
    this.publishedDate,
    this.isFavorite = false,
    this.readingStatus = ReadingStatus.notStarted,
  });

  /// Business Logic: Kiểm tra sách có phải bestseller không
  bool get isBestseller => rating >= 4.5;

  /// Business Logic: Kiểm tra sách có dài không
  bool get isLongBook => pages > 400;

  /// Business Logic: Tính thời gian đọc ước tính (phút)
  int get estimatedReadingTime => (pages * 2); // 2 phút/trang

  /// Business Logic: Validation
  bool get isValid {
    return title.isNotEmpty &&
           author.isNotEmpty &&
           rating >= 0 && rating <= 5 &&
           pages > 0;
  }

  /// Business Logic: Copy with changes
  BookEntity copyWith({
    String? id,
    String? title,
    String? author,
    String? imageUrl,
    double? rating,
    String? description,
    String? category,
    int? pages,
    DateTime? publishedDate,
    bool? isFavorite,
    ReadingStatus? readingStatus,
  }) {
    return BookEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      author: author ?? this.author,
      imageUrl: imageUrl ?? this.imageUrl,
      rating: rating ?? this.rating,
      description: description ?? this.description,
      category: category ?? this.category,
      pages: pages ?? this.pages,
      publishedDate: publishedDate ?? this.publishedDate,
      isFavorite: isFavorite ?? this.isFavorite,
      readingStatus: readingStatus ?? this.readingStatus,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        author,
        imageUrl,
        rating,
        description,
        category,
        pages,
        publishedDate,
        isFavorite,
        readingStatus,
      ];
}

/// Enum cho trạng thái đọc sách
enum ReadingStatus {
  notStarted,
  reading,
  completed,
  paused,
}
