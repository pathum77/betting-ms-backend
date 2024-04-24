const mongoose = require('mongoose');

const dburl = 'mongodb+srv://admin-pathum:m5RvIapo2du8ZagI@cluster0.e3bij.mongodb.net/betting-management-system?retryWrites=true&w=majority';

function connectDatabase() {
  mongoose.connect(dburl);

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.log(err);
  });

  db.once('open', () => {
    console.log('mongodb connection established');
  });
}

module.exports = connectDatabase;