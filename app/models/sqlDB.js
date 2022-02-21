const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:')/*
const sequelize = new Sequelize('database', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});
*/
try {
   // sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


class Joc{
    constructor(data){
        console.log(data);
        Object.assign(this, data);
        //this.dbo = DauSQL.build(data);
    }

    async guardar(data){
        const test = DauSQL.build({
          nom: data.nom
        })
        await test.save()
        console.table( await DauSQL.findAll({ raw: true }))
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

  module.exports = Joc;