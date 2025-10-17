import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/book_model.dart';

/// Database helper cho Books
/// Xử lý tất cả operations với SQLite database
class BookDatabase {
  static Database? _database;
  static const String _tableName = 'books';
  static const String _dbName = 'book_tech.db';
  static const int _dbVersion = 1;

  /// Singleton pattern
  static final BookDatabase _instance = BookDatabase._internal();
  factory BookDatabase() => _instance;
  BookDatabase._internal();

  /// Get database instance
  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  /// Initialize database
  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), _dbName);
    return await openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  /// Create tables
  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $_tableName (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        image_url TEXT NOT NULL,
        rating REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        pages INTEGER NOT NULL,
        published_date INTEGER,
        is_favorite INTEGER NOT NULL DEFAULT 0,
        reading_status TEXT NOT NULL DEFAULT 'not_started',
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    ''');

    // Create indexes for better performance
    await db.execute('CREATE INDEX idx_books_category ON $_tableName (category)');
    await db.execute('CREATE INDEX idx_books_author ON $_tableName (author)');
    await db.execute('CREATE INDEX idx_books_rating ON $_tableName (rating)');
    await db.execute('CREATE INDEX idx_books_favorite ON $_tableName (is_favorite)');
    await db.execute('CREATE INDEX idx_books_status ON $_tableName (reading_status)');
  }

  /// Handle database upgrades
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle future database schema changes
    if (oldVersion < 2) {
      // Example: Add new column in version 2
      // await db.execute('ALTER TABLE $_tableName ADD COLUMN new_column TEXT');
    }
  }

  /// Insert a book
  Future<int> insertBook(BookModel book) async {
    final db = await database;
    final data = book.toDatabase();
    data['created_at'] = DateTime.now().millisecondsSinceEpoch;
    data['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    
    return await db.insert(
      _tableName,
      data,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Get all books
  Future<List<BookModel>> getAllBooks() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tableName,
      orderBy: 'updated_at DESC',
    );

    return List.generate(maps.length, (i) {
      return BookModel.fromDatabase(maps[i]);
    });
  }

  /// Get book by ID
  Future<BookModel?> getBookById(String id) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tableName,
      where: 'id = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return BookModel.fromDatabase(maps.first);
    }
    return null;
  }

  /// Get books by category
  Future<List<BookModel>> getBooksByCategory(String category) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tableName,
      where: 'category = ?',
      whereArgs: [category],
      orderBy: 'rating DESC',
    );

    return List.generate(maps.length, (i) {
      return BookModel.fromDatabase(maps[i]);
    });
  }

  /// Get favorite books
  Future<List<BookModel>> getFavoriteBooks() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tableName,
      where: 'is_favorite = ?',
      whereArgs: [1],
      orderBy: 'updated_at DESC',
    );

    return List.generate(maps.length, (i) {
      return BookModel.fromDatabase(maps[i]);
    });
  }

  /// Get books by reading status
  Future<List<BookModel>> getBooksByStatus(String status) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tableName,
      where: 'reading_status = ?',
      whereArgs: [status],
      orderBy: 'updated_at DESC',
    );

    return List.generate(maps.length, (i) {
      return BookModel.fromDatabase(maps[i]);
    });
  }

  /// Search books by title or author
  Future<List<BookModel>> searchBooks(String query) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tableName,
      where: 'title LIKE ? OR author LIKE ?',
      whereArgs: ['%$query%', '%$query%'],
      orderBy: 'rating DESC',
    );

    return List.generate(maps.length, (i) {
      return BookModel.fromDatabase(maps[i]);
    });
  }

  /// Update book
  Future<int> updateBook(BookModel book) async {
    final db = await database;
    final data = book.toDatabase();
    data['updated_at'] = DateTime.now().millisecondsSinceEpoch;
    
    return await db.update(
      _tableName,
      data,
      where: 'id = ?',
      whereArgs: [book.id],
    );
  }

  /// Update book favorite status
  Future<int> updateFavoriteStatus(String id, bool isFavorite) async {
    final db = await database;
    return await db.update(
      _tableName,
      {
        'is_favorite': isFavorite ? 1 : 0,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Update reading status
  Future<int> updateReadingStatus(String id, String status) async {
    final db = await database;
    return await db.update(
      _tableName,
      {
        'reading_status': status,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Delete book
  Future<int> deleteBook(String id) async {
    final db = await database;
    return await db.delete(
      _tableName,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Delete all books
  Future<int> deleteAllBooks() async {
    final db = await database;
    return await db.delete(_tableName);
  }

  /// Get books count
  Future<int> getBooksCount() async {
    final db = await database;
    final result = await db.rawQuery('SELECT COUNT(*) FROM $_tableName');
    return Sqflite.firstIntValue(result) ?? 0;
  }

  /// Get statistics
  Future<Map<String, dynamic>> getStatistics() async {
    final db = await database;
    
    final totalBooks = await getBooksCount();
    final favoriteCount = await db.rawQuery(
      'SELECT COUNT(*) FROM $_tableName WHERE is_favorite = 1'
    );
    final readingCount = await db.rawQuery(
      'SELECT COUNT(*) FROM $_tableName WHERE reading_status = "reading"'
    );
    final completedCount = await db.rawQuery(
      'SELECT COUNT(*) FROM $_tableName WHERE reading_status = "completed"'
    );

    return {
      'total_books': totalBooks,
      'favorite_books': Sqflite.firstIntValue(favoriteCount) ?? 0,
      'currently_reading': Sqflite.firstIntValue(readingCount) ?? 0,
      'completed_books': Sqflite.firstIntValue(completedCount) ?? 0,
    };
  }

  /// Close database
  Future<void> close() async {
    final db = _database;
    if (db != null) {
      await db.close();
      _database = null;
    }
  }
}
