const request = require('supertest');

const create = (app, book, token) =>
  new Promise((resolve, reject) => {
    request(app)
      .post('/books')
      .set('Authorization', token)
      .send(book)
      .end((error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
  });

const createMany = (app, books, token) => Promise.all(books.map(book => create(app, book, token)));

module.exports = {
  create,
  createMany,
};
