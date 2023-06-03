const Book = require('../models/book');
const Joi = require('joi');
const { validationResult } = require('express-validator');

// Валідація книги
function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
  });

  console.log(book);
  return schema.validate(book);
}

// Отримання всіх книг з можливою пагінацією (параметри page та limit)
exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select('id title author');

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// Отримання однієї книги за id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select('id title author');

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

// Додавання книги з валідацією тіла запиту
exports.addBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author } = req.body;
    const book = new Book({ title, author });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
};

// Оновлення книги за id
exports.updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.stsatus(400).json({ errors: errors.array() });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('id title author');

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
};

// Видалення книги за id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
