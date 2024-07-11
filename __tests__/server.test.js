'use strict';

const request = require('supertest');
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const foodRouter = require('../routes/food');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
console.log('URL:', DATABASE_URL);

// Setup a real database connection
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Food = sequelize.define('Food', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ['fruit', 'vegetable', 'protein'],
    allowNull: false,
  },
});

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset the database
  // Populate the database with initial data if necessary
  await Food.bulkCreate([
    { name: 'Apple', calories: 95, type: 'fruit' },
    { name: 'Banana', calories: 105, type: 'fruit' },
    { name: 'Carrot', calories: 25, type: 'vegetable' },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

const appForTest = express();
appForTest.use(express.json());
appForTest.use(foodRouter);

describe('API Server', () => {
  it('should return 404 on a bad route', async () => {
    const response = await request(appForTest).get('/badroute');
    expect(response.status).toBe(404);
  });

  it('should return 404 on a bad method', async () => {
    const response = await request(appForTest).put('/food');
    expect(response.status).toBe(404);
  });

  it('should create a record using POST', async () => {
    const response = await request(appForTest)
      .post('/food')
      .send({
        name: 'Tomato',
        calories: 20,
        type: 'vegetable',
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Tomato');
  });

  it('should read a list of records using GET', async () => {
    const response = await request(appForTest).get('/food');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should read a record using GET', async () => {
    const food = await Food.findOne({ where: { name: 'Banana' } });
    const response = await request(appForTest).get(`/food/${food.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Banana');
  });

  it('should update a record using PUT', async () => {
    const food = await Food.findOne({ where: { name: 'Carrot' } });
    const response = await request(appForTest)
      .put(`/food/${food.id}`)
      .send({ name: 'Carrot', calories: 30, type: 'vegetable' });
    expect(response.status).toBe(200);
    expect(response.body.calories).toBe(30);
  });

  it('should delete a record using DELETE', async () => {
    const food = await Food.findOne({ where: { name: 'Apple' } });
    const response = await request(appForTest).delete(`/food/${food.id}`);
    expect(response.status).toBe(204);
    const notFoundResponse = await request(appForTest).get(`/food/${food.id}`);
    expect(notFoundResponse.status).toBe(404);
  });
});
