var express = require('express');
var app = express();
var db = require('./routes/db')
var UserController = require('./controllers/UserController');

app.use('/', UserController);
module.exports = app;