const Book = require('../models/books');

exports.create = (req, res) => {
  const book = new Book({
    user: req.authorizer._id,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    isbn: req.body.isbn,
  });

  book
    .save()
    .then(() => {
      res.status(201).json(book);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        const titleError = error.errors.title ? error.errors.title.message : null;
        const authorError = error.errors.author ? error.errors.author.message : null;
        res.status(400).json({
          errors: {
            title: titleError,
            author: authorError,
          },
        });
      } else {
        res.sendStatus(500);
      }
    });
};

exports.list = (req, res) => {
  const query = Book.find();

  if (req.query.genre) {
    query.where('genre').equals(req.query.genre);
  } else if (req.query.author) {
    query.where('author', new RegExp(req.query.author, 'i'));
  }
  query
    .exec()
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.sendStatus(500);
    });
};
