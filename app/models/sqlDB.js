const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config')
const mysql = require('mysql2/promise');
const db = {}
initialize()
async function initialize(){
  
  const connection = await mysql.createConnection({ host:config.host, port:config.port, user:config.user, password:config.password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
  const sequelize = new Sequelize(config.database, config.user,config.password , {
    host: config.host,
    dialect: config.dialect
});

  db.Jugador = require('./daus')(sequelize)
  db.Joc = require('./Joc')(sequelize)
   
 db.Joc.belongsTo(db.Jugador)
  
  await sequelize.sync();
}

module.exports = db;