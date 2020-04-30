const faker = require('faker');

exports.user = (options = {}) => ({
  firstName: options.firstName || faker.name.firstName(),
  lastName: options.lastName || faker.name.lastName(),
  email: options.email || faker.internet.email(),
  password: options.password || faker.internet.password(),
});

exports.book = (options = {}) => ({
  title: options.title || faker.random.word(),
  author: options.author || faker.name.findName(),
  isbn: options.isbn || faker.random.number(),
  genre: options.genre || faker.random.word(),
});
