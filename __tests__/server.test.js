'use strict';

const request = require('supertest');
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const authorRouter = require('../routes/authors');
const bookRouter = require('../routes/books');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
console.log('URL:', DATABASE_URL);

// Setup a real database connection
const sequelize = new Sequelize(DATABASE_URL, {
  logging: console.log,  // Enable detailed logging
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Author = sequelize.define('Author', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Authors',
      key: 'id',
    },
  },
});

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset the database
  const author = await Author.create({ name: 'Author 1' });
  console.log('Author created:', author);
  const books = await Book.bulkCreate([
    { title: 'Book 1', authorId: author.id },
    { title: 'Book 2', authorId: author.id },
  ]);
  console.log('Books created:', books);
});

afterAll(async () => {
  await sequelize.close();
});

const appForTest = express();
appForTest.use(express.json());
appForTest.use(authorRouter);
appForTest.use(bookRouter);

describe('API Server', () => {
  it('should return 404 on a bad route', async () => {
    const response = await request(appForTest).get('/badroute');
    expect(response.status).toBe(404);
  });

  it('should return 404 on a bad method', async () => {
    const response = await request(appForTest).put('/authors');
    expect(response.status).toBe(404);
  });

  it('should create an author using POST', async () => {
    const response = await request(appForTest)
      .post('/authors')
      .send({ name: 'Author 2' });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Author 2');
  });

  it('should read a list of authors using GET', async () => {
    const response = await request(appForTest).get('/authors');
    console.log('Authors list:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should read an author using GET', async () => {
    const response = await request(appForTest).get('/authors');
    const author = response.body.find(a => a.name === 'Author 1');
    console.log('Author fetched for GET:', author);
    const authorResponse = await request(appForTest).get(`/authors/${author.id}`);
    console.log('GET /authors/:id response:', authorResponse.body);
    expect(authorResponse.status).toBe(200);
    expect(authorResponse.body.name).toBe('Author 1');
  });

  it('should update an author using PUT', async () => {
    const response = await request(appForTest).get('/authors');
    const author = response.body.find(a => a.name === 'Author 1');
    const updateResponse = await request(appForTest)
      .put(`/authors/${author.id}`)
      .send({ name: 'Updated Author 1' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Author 1');
  });

  it('should create a book using POST', async () => {
    const authorResponse = await request(appForTest).post('/authors').send({ name: 'Author 3' });
    const response = await request(appForTest)
      .post('/books')
      .send({ title: 'New Book', authorId: authorResponse.body.id });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Book');
  });

  it('should read a list of books using GET', async () => {
    const response = await request(appForTest).get('/books');
    console.log('Books list:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should read a book using GET', async () => {
    const response = await request(appForTest).get('/books');
    const book = response.body.find(b => b.title === 'Book 1');
    console.log('Book fetched for GET:', book);
    const bookResponse = await request(appForTest).get(`/books/${book.id}`);
    console.log('GET /books/:id response:', bookResponse.body);
    expect(bookResponse.status).toBe(200);
    expect(bookResponse.body.title).toBe('Book 1');
  });

  it('should update a book using PUT', async () => {
    const response = await request(appForTest).get('/books');
    const book = response.body.find(b => b.title === 'Book 1');
    const updateResponse = await request(appForTest)
      .put(`/books/${book.id}`)
      .send({ title: 'Updated Book 1' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('Updated Book 1');
  });

  it('should delete a book using DELETE', async () => {
    const response = await request(appForTest).get('/books');
    console.log('Books list before DELETE:', response.body);
    const book = response.body.find(b => b.title === 'Updated Book 1');
    if (!book) {
      console.error('Book not found for DELETE');
      throw new Error('Book not found');
    }
    console.log('Book fetched for DELETE:', book);
    const deleteResponse = await request(appForTest).delete(`/books/${book.id}`);
    expect(deleteResponse.status).toBe(204);
    const notFoundResponse = await request(appForTest).get(`/books/${book.id}`);
    expect(notFoundResponse.status).toBe(404);
  });
});
