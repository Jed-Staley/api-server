'use strict';

const express = require('express');
const { Food } = require('../models/food');
const router = express.Router();

// Create a record
router.post('/food', async (req, res) => {
  try {
    const newFood = await Food.create(req.body);
    res.status(201).json(newFood);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all records
router.get('/food', async (req, res) => {
  try {
    const allFood = await Food.findAll();
    res.status(200).json(allFood);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get one record
router.get('/food/:id', async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (food) {
      res.status(200).json(food);
    } else {
      res.status(404).json({ error: 'Food not found' });
    }
  } catch (error) {
    console.error('Error fetching food by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a record
router.put('/food/:id', async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (food) {
      const updatedFood = await food.update(req.body);
      res.status(200).json(updatedFood);
    } else {
      res.status(404).json({ error: 'Food not found' });
    }
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a record
router.delete('/food/:id', async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (food) {
      await food.destroy();
      res.status(204).json(null);
    } else {
      res.status(404).json({ error: 'Food not found' });
    }
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
