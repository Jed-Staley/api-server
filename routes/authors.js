'use strict';

const express = require('express');
const { Author } = require('../models');
const router = express.Router();

// Create an author
router.post('/authors', async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all authors
router.get('/authors', async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get one author
router.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    console.error('Error fetching author by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update an author
router.put('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (author) {
      const updatedAuthor = await author.update(req.body);
      res.status(200).json(updatedAuthor);
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete an author
router.delete('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (author) {
      await author.destroy();
      res.status(204).json(null);
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
