const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Отримання всіх книг з можливою пагінацією (параметри page та limit)
router.get('/books', bookController.getAllBooks);

// Отримання однієї книги за id
router.get('/books/:id', bookController.getBookById);

// Додавання книги з валідацією тіла запиту
router.post('/books', bookController.addBook);

// Оновлення книги за id
router.put('/books/:id', bookController.updateBook);

// Видалення книги за id
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;

