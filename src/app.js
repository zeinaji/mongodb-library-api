const express = require('express');
const userController = require('./controllers/users');
const authController = require('./controllers/auth');

const app = express();
app.use(express.json());

app.post('/users', userController.create);
app.post('/auth/login', authController.authenticate);

module.exports = app;
