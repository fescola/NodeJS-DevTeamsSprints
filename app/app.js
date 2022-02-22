var express = require('express');
var app = express();
var UserController = require('./controllers/controller');
const routes = require('./routes/routes')
const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use('/', routes);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

