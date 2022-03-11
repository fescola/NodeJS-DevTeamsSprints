var express = require('express');
var app = express();
var db = require('./routes/db')
var UserController = require('./controllers/UserController');
//var server = require('./config/server')

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


app.use('/', UserController);
//module.exports = app;