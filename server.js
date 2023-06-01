const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Joi = require('joi');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Підключення до бази даних MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@poliarnyolen.ppikl6h.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed:', error);
  });

// Схема книги
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

// Модель книги
const Book = mongoose.model('Book', bookSchema);

// Валідація книги
function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
  });

  return schema.validate(book);
}

// Отримання всіх книг з можливістю пагінації
app.get('/books', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select('id title author');

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Отримання однієї книги за id
app.get('/books/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findById(id)
      .select('id title author');;

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Додавання книги
app.post('/books', async (req, res) => {
  const { error } = validateBook(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, author } = req.body;

  const book = new Book({ title, author });

  try {
    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Оновлення книги за id
app.put('/books/:id', async (req, res) => {
  const id = req.params.id;
  const { error } = validateBook(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true })
      .select('id title author');

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Видалення книги за id
app.delete('/books/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
