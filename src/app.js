const express = require('express');
const userController = require('./controllers/users');
const authController = require('./controllers/auth');
const bookController = require('./controllers/books');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

app.post('/users', userController.create);
app.post('/auth/login', authController.auth);
app.post('/books', auth, bookController.create);
app.get('/books', bookController.list);

module.exports = app;
