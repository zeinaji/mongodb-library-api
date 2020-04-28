const request = require('supertest');
const jwt = require('jsonwebtoken');
const DataFactory = require('./helpers/data-factory');
const UsersHelpers = require('./helpers/user-helpers');
const app = require('../src/app');
const User = require('../src/models/users');

describe('POST /auth/login', () => {
  it('issues a json web token', done => {
    const data = DataFactory.user();
    UsersHelpers.signUp(app, data)
      .then(() => {
        UsersHelpers.login(app, data.email, data.password).then(res => {
          expect(res.status).toBe(200);
          const decodedToken = jwt.decode(res.body.token);
          User.findOne({ email: decodedToken.email }, (_, user) => {
            expect(decodedToken._id).toBe(user.id);
            expect(decodedToken.firstName).toBe(user.firstName);
            expect(decodedToken.lastName).toBe(user.lastName);
            done();
          });
        });
      })
      .catch(error => done(error));
  });
  it('responds with an error if the user does not exist', done => {
    const data = DataFactory.user();
    UsersHelpers.signUp(app, data)
      .then(() => {
        UsersHelpers.login(app, 'wrongemail', data.password).then(res => {
          expect(res.status).toBe(401);
          done();
        });
      })
      .catch(error => done(error));
  });
  it('responds with an error if the password is incorrect', done => {
    const data = DataFactory.user();
    UsersHelpers.signUp(app, data)
      .then(() => {
        UsersHelpers.login(app, data.email, 'wrongpass').then(res => {
          expect(res.status).toBe(401);
          done();
        });
      })
      .catch(error => done(error));
  });
});
