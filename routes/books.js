'use strict';

const express = require('express');
const { Book } = require('../models');
const router = express.Router();

// Create a book
router.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get one book
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      const updatedBook = await book.update(req.body);
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a book
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.status(204).json(null);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
