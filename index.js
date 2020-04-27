const mongoose = require('mongoose');
const app = require('./src/app');
require('dotenv').config();

mongoose
  .connect(process.env.DATABASE_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('App listening on port 3000');
    });
  })
  .catch(err => {
    console.log(`${err.message}`);
  });
