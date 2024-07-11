'use strict';

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
console.log('URL:', DATABASE_URL);

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

module.exports = { Food, sequelize };
