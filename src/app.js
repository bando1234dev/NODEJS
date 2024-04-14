require('dotenv').config;
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
const compression = require('compression');

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

require('./dbs/init.mongodb');
const { countConnect, checkOverload } = require('./helpers/check.connect');
countConnect();
// checkOverload();

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Welcome ban do1234!',
  });
});

module.exports = app;
