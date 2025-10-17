import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/book_model.dart';

/// Remote DataSource - Tương tác với API
/// Chỉ chịu tr책nhiệm gọi API và parse response
abstract class BookRemoteDataSource {
  Future<List<BookModel>> getBooks();
  Future<BookModel> getBookById(String id);
  Future<List<BookModel>> searchBooks(String query);
  Future<BookModel> createBook(BookModel book);
  Future<BookModel> updateBook(BookModel book);
  Future<void> deleteBook(String id);
}

class BookRemoteDataSourceImpl implements BookRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  BookRemoteDataSourceImpl({
    required this.client,
    this.baseUrl = 'https://api.booktech.com/v1',
  });

  @override
  Future<List<BookModel>> getBooks() async {
    final response = await client.get(
      Uri.parse('$baseUrl/books'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body)['data'];
      return jsonList.map((json) => BookModel.fromJson(json)).toList();
    } else {
      throw ServerException('Failed to fetch books: ${response.statusCode}');
    }
  }

  @override
  Future<BookModel> getBookById(String id) async {
    final response = await client.get(
      Uri.parse('$baseUrl/books/$id'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body)['data'];
      return BookModel.fromJson(jsonData);
    } else if (response.statusCode == 404) {
      throw NotFoundException('Book not found');
    } else {
      throw ServerException('Failed to fetch book: ${response.statusCode}');
    }
  }

  @override
  Future<List<BookModel>> searchBooks(String query) async {
    final response = await client.get(
      Uri.parse('$baseUrl/books/search?q=${Uri.encodeComponent(query)}'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body)['data'];
      return jsonList.map((json) => BookModel.fromJson(json)).toList();
    } else {
      throw ServerException('Failed to search books: ${response.statusCode}');
    }
  }

  @override
  Future<BookModel> createBook(BookModel book) async {
    final response = await client.post(
      Uri.parse('$baseUrl/books'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(book.toJson()),
    );

    if (response.statusCode == 201) {
      final Map<String, dynamic> jsonData = json.decode(response.body)['data'];
      return BookModel.fromJson(jsonData);
    } else {
      throw ServerException('Failed to create book: ${response.statusCode}');
    }
  }

  @override
  Future<BookModel> updateBook(BookModel book) async {
    final response = await client.put(
      Uri.parse('$baseUrl/books/${book.id}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(book.toJson()),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonData = json.decode(response.body)['data'];
      return BookModel.fromJson(jsonData);
    } else {
      throw ServerException('Failed to update book: ${response.statusCode}');
    }
  }

  @override
  Future<void> deleteBook(String id) async {
    final response = await client.delete(
      Uri.parse('$baseUrl/books/$id'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 204) {
      throw ServerException('Failed to delete book: ${response.statusCode}');
    }
  }
}

/// Custom Exceptions
class ServerException implements Exception {
  final String message;
  ServerException(this.message);
}

class NotFoundException implements Exception {
  final String message;
  NotFoundException(this.message);
}
