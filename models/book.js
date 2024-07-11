'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./author');

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

module.exports = { Book };
