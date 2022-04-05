const { Sequelize, DataTypes } = require('sequelize');


const model = (sequelize) => {
  return sequelize.define('Joc', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tirada:{
      type: DataTypes.INTEGER
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  //return sequelize.define('Jugador', attributes, options);
}
  module.exports = model;