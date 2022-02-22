
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
    async editar(data){

    }
}
 /*
  const Partida = sequelize.define('Partida',{
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    resultat:{
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: false
    }
  })
  */
module.exports = Joc