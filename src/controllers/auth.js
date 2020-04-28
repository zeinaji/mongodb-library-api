const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  User.findOne({ email }, (_, user) => {
    if (user !== null && user.validatePassword(password)) {
      jwt.sign(user.toObject(), process.env.JWT_SECRET, { expiresIn: '1w' }, (err, token) => {
        res.json({ token });
      });
    } else {
      res.sendStatus(401);
    }
  });
};
