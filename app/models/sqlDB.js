const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config')
const mysql = require('mysql2/promise');
const Joc = require('./Joc');
//const sequelize = new Sequelize('sqlite::memory:')
const db = {}
initialize()

async function initialize(){
  
  const connection = await mysql.createConnection({ host:config.host, port:config.port, user:config.user, password:config.password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

  const sequelize = new Sequelize(config.database, config.user,config.password , {
    host: config.host,
    dialect: config.dialect
});


class Joc{
  constructor(data){
      console.log(data);
      Object.assign(this, data);
      //this.dbo = DauSQL.build(data);
  }

  async guardar(data){
    console.log('guardar' + data)
      const test = DauSQL.build({
        nom: data.nom
      })
      await test.save()
      console.table( await DauSQL.findAll({ raw: true }))
  }
  async editar(data){

  }
}

const DauSQL = sequelize.define('Jugador', {
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
}

  module.exports = Joc;