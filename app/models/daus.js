const { Sequelize, DataTypes } = require('sequelize');
const db = require('./sqlDB')

const DauSQL = db.sequelize.define('Jugador', {
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
 
  (async () => {
    const date = new Date();
    await sequelize.sync();
    await DauSQL.bulkCreate([
      { nom: 'pep',tirades: [3,5],data: date},
      { nom: 'pap',tirades: [7],data: date }
    ]);
  })();

  module.exports = DauSQL;