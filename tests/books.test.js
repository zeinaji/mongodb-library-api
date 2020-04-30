const request = require('supertest');
const UsersHelpers = require('./helpers/user-helpers');
const DataFactory = require('./helpers/data-factory');
const Book = require('../src/models/books');
const app = require('../src/app');
const BookHelpers = require('./helpers/book-helpers');

const data = DataFactory.user();
let userBody;
let token;

beforeEach(done => {
  UsersHelpers.signUp(app, data).then(user => {
    UsersHelpers.login(app, data.email, data.password).then(credentials => {
      userBody = user.body;
      token = credentials.body.token;
      done();
    });
  });
});

describe('POST /books', () => {
  it('creates a book listing', done => {
    const book = DataFactory.book();
    BookHelpers.create(app, book, token)
      .then(res => {
        expect(res.status).toBe(201);
        Book.findById(res.body._id, (_, book) => {
          expect(book.title).toBe(book.title);
          expect(book.author).toBe(book.author);
          expect(book.genre).toBe(book.genre);
          expect(book.isbn).toBe(book.isbn);
          done();
        });
      })
      .catch(error => done(error));
  });

  it('responds with an error if a title was not included', done => {
    const book = DataFactory.book();
    const { title, ...rest } = book;
    BookHelpers.create(app, rest, token)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.errors.title).toBe('Path `title` is required.');
        Book.countDocuments((_, count) => {
          expect(count).toBe(0);
        });
        done();
      })
      .catch(error => done(error));
  });

  it('responds with an error if an author was not included', done => {
    const book = DataFactory.user();
    const { author, ...rest } = book;
    BookHelpers.create(app, rest, token)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.errors.author).toBe('Path `author` is required.');
        Book.countDocuments((_, count) => {
          expect(count).toBe(0);
        });
        done();
      })
      .catch(error => done(error));
  });

  it('responds with an error if the user does not exist', done => {
    request(app)
      .post('/books')
      .send({
        title: 'One Hundred Years of Solitude',
        genre: 'Fiction',
        isbn: 8601417133002,
      })
      .then(res => {
        expect(res.status).toBe(401);
        Book.countDocuments((_, count) => {
          expect(count).toBe(0);
        });
        done();
      });
  });
});

describe('GET /books', () => {
  it('lists all books', done => {
    const books = [DataFactory.book(), DataFactory.book(), DataFactory.book()];
    BookHelpers.createMany(app, books, token)
      .then(() => {
        request(app)
          .get('/books')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(books.length);
            res.body.forEach((item, i) => {
              expect(item.user).toBe(userBody._id);
              expect(item.title).toBe(books[i].title);
              expect(item.author).toBe(books[i].author);
              expect(item.isbn).toBe(books[i].isbn);
              expect(item.genre).toBe(books[i].genre);
            });
            done();
          });
      })
      .catch(error => done(error));
  });

  it('filters books by genre', done => {
    const books = [
      DataFactory.book({ genre: 'Not Comedy' }),
      DataFactory.book({ genre: 'Comedy' }),
      DataFactory.book({ genre: 'Not Comedy' }),
      DataFactory.book({ genre: 'Comedy' }),
    ];

    const comedies = books.filter(book => book.genre === 'Comedy');

    BookHelpers.createMany(app, books, token)
      .then(() => {
        request(app)
          .get('/books')
          .query({ genre: 'Comedy' })
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(comedies.length);
            res.body.forEach(item => {
              expect(item.genre).toBe('Comedy');
              done();
            });
          });
      })
      .catch(error => done(error));
  });

  it('filters books by authors first or second name', done => {
    const books = [
      DataFactory.book({ author: 'Richard Smith' }),
      DataFactory.book({ author: 'Sam Roberts' }),
      DataFactory.book({ author: 'Amy smith' }),
      DataFactory.book({ author: 'Beth Smith' }),
    ];

    const filteredBooks = books.filter(book => book.author.toLowerCase().includes('smith'));

    BookHelpers.createMany(app, books, token)
      .then(() => {
        request(app)
          .get('/books')
          .query({ author: 'Smith' })
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(filteredBooks.length);
            res.body.forEach(item => {
              expect(item.author.toLowerCase().includes('smith')).toBe(true);
              done();
            });
          });
      })
      .catch(error => done(error));
  });
});
