var express = require('express');
var app = express();
const routes = require('./routes/routes')
const bp = require('body-parser')
const authRoutes = require('./auth/auth')
const dotenv = require("dotenv");
dotenv.config();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use('/', routes);
app.use("/", authRoutes);
//const mongo = require('./models/MongoDB')

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});