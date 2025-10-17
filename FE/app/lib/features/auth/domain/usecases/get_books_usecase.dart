import '../entities/book_entity.dart';
import '../repositories/book_repository.dart';

/// Use Case - Business Logic Layer
/// Sử dụng Repository interface, không biết về DataSources
class GetBooksUseCase {
  final BookRepository repository;

  GetBooksUseCase(this.repository);

  Future<List<BookEntity>> call() async {
    try {
      // Repository sẽ handle:
      // - Kiểm tra cache
      // - Gọi API nếu cần
      // - Fallback logic
      // - Error handling
      return await repository.getBooks();
    } catch (e) {
      throw Exception('Failed to get books: $e');
    }
  }
}

/// Use Case với parameters
class SearchBooksUseCase {
  final BookRepository repository;

  SearchBooksUseCase(this.repository);

  Future<List<BookEntity>> call(String query) async {
    if (query.trim().isEmpty) {
      throw Exception('Search query cannot be empty');
    }

    try {
      return await repository.searchBooks(query);
    } catch (e) {
      throw Exception('Failed to search books: $e');
    }
  }
}

/// Use Case phức tạp hơn
class GetRecommendedBooksUseCase {
  final BookRepository repository;

  GetRecommendedBooksUseCase(this.repository);

  Future<List<BookEntity>> call() async {
    try {
      // 1. Lấy sách yêu thích của user
      final favoriteBooks = await repository.getFavoriteBooks();
      
      // 2. Lấy categories từ sách yêu thích
      final favoriteCategories = favoriteBooks
          .map((book) => book.category)
          .toSet()
          .toList();
      
      // 3. Lấy tất cả sách
      final allBooks = await repository.getBooks();
      
      // 4. Filter và recommend
      final recommendedBooks = allBooks
          .where((book) => 
              favoriteCategories.contains(book.category) &&
              book.isBestseller &&
              !favoriteBooks.any((fav) => fav.id == book.id))
          .take(10)
          .toList();
      
      return recommendedBooks;
    } catch (e) {
      throw Exception('Failed to get recommended books: $e');
    }
  }
}
