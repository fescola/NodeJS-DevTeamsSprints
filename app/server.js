/*var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
*/

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

try {
   // sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  module.exports = server;