const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('isemail');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    validate: [isEmail.validate, 'Invalid email address'],
  },
  password: {
    type: String,
    validate: [
      password => {
        return password.length >= 8;
      },
      'Password must be at least 8 characters long',
    ],
  },
});

userSchema.pre('save', function encryptPassword(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    bcrypt.hash(this.password, 10, (error, hash) => {
      if (error) {
        next(error);
      } else {
        this.password = hash;
        return next();
      }
    });
  }
});

userSchema.methods.sanitise = function() {
  const { password, ...modifiedUser } = this.toObject();
  return modifiedUser;
};

userSchema.methods.validatePassword = function(guess) {
  return bcrypt.compareSync(guess, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
