

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  module.exports = server;