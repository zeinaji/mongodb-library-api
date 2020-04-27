const User = require('../models/users');

exports.create = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, doc) => {
    res.status(201).json(user.sanitise(doc));
  });
};
