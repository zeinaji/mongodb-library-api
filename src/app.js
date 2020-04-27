const express = require('express');
const userController = require('./controllers/users');

const app = express();
app.use(express.json());

app.post('/users', userController.create);

module.exports = app;
