'use strict';

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(DATABASE_URL, {
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

module.exports = { Author, sequelize };
