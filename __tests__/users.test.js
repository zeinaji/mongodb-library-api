const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/users');

describe('/users', () => {
  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  afterEach(done => {
    User.deleteMany({}, () => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  });

  describe('POST /users', () => {
    it('creates a new user in the database', done => {
      request(app)
        .post('/users')
        .send({
          firstName: 'Zein',
          lastName: 'Aji',
          email: 'zeinaji97@gmail.com',
          password: 'zeinaji97',
        })
        .then(res => {
          expect(res.status).toBe(201);
          User.findById(res.body._id, (_, user) => {
            expect(user.firstName).toEqual('Zein');
            expect(user.lastName).toEqual('Aji');
            expect(user.email).toEqual('zeinaji97@gmail.com');
            expect(res.body).not.toHaveProperty('password');
            done();
          });
        });
    });
  });
});
