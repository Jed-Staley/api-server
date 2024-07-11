'use strict';

const { Author } = require('./author');
const { Book } = require('./book');

Author.hasMany(Book, { foreignKey: 'authorId' });
Book.belongsTo(Author, { foreignKey: 'authorId' });

module.exports = {
  Author,
  Book,
};
