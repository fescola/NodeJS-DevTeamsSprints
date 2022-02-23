const { Sequelize, DataTypes } = require('sequelize');


const model = (sequelize) => {
  return sequelize.define('Jugador', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom:{
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.DATE
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  //return sequelize.define('Jugador', attributes, options);
}
  module.exports = model;