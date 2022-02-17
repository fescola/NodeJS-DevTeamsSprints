const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:') 

try {
   // sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


class Daus{
    constructor(data){
        console.log(data);
        Object.assign(this, data);
        //this.dbo = DauSQL.build(data);
    }

    async guardar(data){
        const test = DauSQL.build({tirada: data})
        await test.save()
        console.log(this.dbo.tirada)
        console.table( await DauSQL.findAll({ raw: true }))
    }
}

const DauSQL = sequelize.define('Dau', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tirada: {
    type: DataTypes.INTEGER
    //allowNull: false
  }
}, {
  createdAt: false,
  updatedAt: false
});

(async () => {
  await sequelize.sync();
  await DauSQL.bulkCreate([
    { tirada: 3},
    { tirada: 7 }
  ]);
})();

  module.exports = Daus;