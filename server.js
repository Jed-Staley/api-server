'use strict';

// dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Sequelize } = require('sequelize');

// middleware and handlers imports
const logger = require('./middleware/logger.js');
const timestamp = require('./middleware/timestamp.js');
const handleNotFound = require('./handlers/404.js');
const handleError = require('./handlers/500.js');

// router imports
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

const app = express();

const sequelize = new Sequelize(process.env.NODE_ENV === 'test' ? 'sqlite::memory:' : process.env.DATABASE_URL, {
  dialect: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You might need to set this to true in production
    },
  },
});

app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

// middleware implementation
app.use(timestamp);
app.use(logger);

// routes
app.get('/', proofOfLife);
app.use(authorRouter);
app.use(bookRouter);

// handlers implementation
app.use('*', handleNotFound);
app.use(handleError);

// ROUTE FUNCTIONS

// returns 'Hello World' when the default route is visited as a proof of life
function proofOfLife(req, res) {
  res.status(200).send('Hello World');
}

function start(port, domain) {
  sequelize.sync()
    .then(() => {
      app.listen(port, () => {
        if (domain) {
          console.log(`Server is running at ${domain}:${port}`);
        } else {
          console.log(`Server is running on port ${port}`);
        }
      });
    })
    .catch(err => {
      console.error('Failed to sync database:', err.message);
    });
}

module.exports = { app, start };
