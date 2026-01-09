const Book = require("../models/Book.model");

// GET /books
exports.getAllBooks = async (req, res) => {
  const { userId } = req.user;

  const books = await Book.find({ userId }).sort({ createdAt: -1 });

  res.json({
    message: "Books fetched successfully",
    data: books
  });
};

// GET /books/active
exports.getActiveBooks = async (req, res) => {
  const { userId } = req.user;

  const activeBooks = await Book.find({ userId, isActive: true });

  res.json({
    message: "Active books fetched successfully",
    data: activeBooks
  });
};

// POST /books
exports.addBook = async (req, res) => {
  const { title, drivePreviewUrl } = req.body;
  const { userId } = req.user;

  if (!title || !drivePreviewUrl) {
    return res.status(400).json({ message: "Title and Drive link are required" });
  }

  const book = await Book.create({
    title,
    drivePreviewUrl,
    userId
  });

  res.status(201).json({
    message: "Book added successfully",
    data: book
  });
};

// POST /books/:id/read  (REAL LRU — unchanged)
exports.markBookAsRead = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const book = await Book.findOne({ _id: id, userId });
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const now = Date.now();

  // Activate selected book
  book.isActive = true;
  book.lastReadAt = now;
  await book.save();

  // Fetch active books for this user
  const activeBooks = await Book.find({ userId, isActive: true });

  // Enforce LRU (max 3)
  if (activeBooks.length > 3) {
    activeBooks.sort((a, b) => a.lastReadAt - b.lastReadAt);
    const lruBook = activeBooks[0];

    if (lruBook._id.toString() !== book._id.toString()) {
      lruBook.isActive = false;
      await lruBook.save();
    }
  }

  res.json({
    message: "Book marked as read (LRU enforced)",
    data: book
  });
};

// DELETE /books/:id
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  await Book.deleteOne({ _id: id, userId });

  res.json({ message: "Book deleted" });
};
