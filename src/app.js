const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Welcome ban do1234!',
  });
});

console.log('123 : test git');

module.exports = app;
