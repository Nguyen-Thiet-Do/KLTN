import '../entities/book_entity.dart';

/// Repository Interface - Domain Layer
/// Định nghĩa contract cho business logic
/// Không phụ thuộc vào implementation cụ thể
abstract class BookRepository {
  // Core CRUD operations
  Future<List<BookEntity>> getBooks();
  Future<BookEntity> getBookById(String id);
  Future<List<BookEntity>> searchBooks(String query);
  Future<BookEntity> createBook(BookEntity book);
  Future<BookEntity> updateBook(BookEntity book);
  Future<void> deleteBook(String id);

  // Category operations
  Future<List<BookEntity>> getBooksByCategory(String category);
  Future<List<String>> getCategories();

  // User-specific operations
  Future<List<BookEntity>> getFavoriteBooks();
  Future<List<BookEntity>> getReadingBooks();
  Future<List<BookEntity>> getCompletedBooks();
  
  // Status updates
  Future<void> toggleFavorite(String bookId);
  Future<void> updateReadingStatus(String bookId, ReadingStatus status);
  
  // Statistics
  Future<Map<String, dynamic>> getUserStatistics();
  
  // Offline support
  Future<bool> isConnected();
  Future<void> syncData();
}

/// Result wrapper for error handling
abstract class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}

class Failure<T> extends Result<T> {
  final String message;
  final Exception? exception;
  const Failure(this.message, [this.exception]);
}

/// Repository với error handling
abstract class BookRepositoryWithResult {
  Future<Result<List<BookEntity>>> getBooks();
  Future<Result<BookEntity>> getBookById(String id);
  Future<Result<List<BookEntity>>> searchBooks(String query);
  Future<Result<BookEntity>> createBook(BookEntity book);
  Future<Result<BookEntity>> updateBook(BookEntity book);
  Future<Result<void>> deleteBook(String id);
}
