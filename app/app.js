var express = require('express');
var app = express();
var UserController = require('./controllers/userController');


var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

app.use('/', UserController);