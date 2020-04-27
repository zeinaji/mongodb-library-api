const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/users');
const UserHelpers = require('../tests/helpers/user-helpers');
const DataFactory = require('../tests/helpers/data-factory');

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
      const data = DataFactory.user({ email: 'zeinaji97@gmail.com' });
      UserHelpers.signUp(app, data).then(res => {
        expect(res.status).toBe(201);
        User.findById(res.body._id, (_, user) => {
          expect(user.firstName).not.toEqual(null);
          expect(user.lastName).not.toEqual(null);
          expect(user.email).toEqual('zeinaji97@gmail.com');
          expect(res.body).not.toHaveProperty('password');
          done();
        }).catch(error => done(error));
      });
    });
  });

  it('responds with an error if the email entered is not valid', done => {
    const data = DataFactory.user({ email: 'zein@' });
    UserHelpers.signUp(app, data)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.errors.email).toBe('Invalid email address');
        User.countDocuments((_, count) => {
          expect(count).toBe(0);
          done();
        });
      })
      .catch(error => done(error));
  });
  it('responds with an error if the password is not long enough', done => {
    const data = DataFactory.user({ password: 'hjhjfg' });
    UserHelpers.signUp(app, data)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.errors.password).toBe('Password must be at least 8 characters long');
        User.countDocuments((_, count) => {
          expect(count).toBe(0);
          done();
        });
      })
      .catch(error => done(error));
  });
});
