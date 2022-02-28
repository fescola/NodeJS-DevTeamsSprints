const express = require('express');
const router = express.Router();
//const Joc = require('../models/Joc')
const db = require('../models/sqlDB')


const postPlayers = async (req,res)=>{
    let params = req.body
    console.log(db.Jugador)
    if (await db.Jugador.findOne({ where: { nom: params.nom } })) {
        res.send( 'Username "' + params.nom + '" is already taken')
    }
    if(params.nom == ''){
        params.nom = 'Anonim'
    }
    await db.Jugador.create(params)
    res.send('postPlayers')
}

const games = async (req,res)=>{
    const data = {}
    const player = await db.Jugador.findOne({ where: { id: req.params.id } })
    data.tirada = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1 )
    data.JugadorId = req.params.id
    if(player){
        console.log(req.params.id)
        db.Joc.create(data)
        res.send(`Jugador: ${player.nom} Nova tirada ${data.tirada}`)
    }
    if(!player){
        res.send('player id not found')
    }
}
//
const putPlayers = async (req,res)=>{
    const user = await db.Jugador.findOne({ where: { id: req.body.id } })
    if(!user){
        res.send('This ID doesnt exist')
    }
    else{
        try{
            db.Jugador.update({nom:req.body.nom},{where:{id:req.body.id}})
            res.send(await db.Jugador.findOne({where:{id:req.body.id}}))
        }
        catch(e){
            console.log(e);
        }
    }
}
const deletePlayers = async (req,res)=>{
    if(!await db.Joc.findOne({ where: { JugadorId: req.params.id } })){
        res.send('player id not found')
    }
    await db.Joc.destroy({where:{JugadorId: req.params.id}})
    res.send('jugades destruides')
}
//GET /players: retorna el llistat de tots els jugadors del sistema amb el seu percentatge mig d’èxits
const getPlayers = async (req,res)=>{
    try{
        const players = await db.Jugador.findAll()
        if(!players){
            res.send('table is empty')
        }
        for(const player of players){
            const jugades = await db.Joc.findAll({where:{JugadorId: player.id}})
            let mitja = 0;
            jugades.forEach(jugada => {
                mitja = mitja+jugada.tirada
            });
            mitja = mitja/jugades.length;
            player.dataValues.mitja = mitja;
        }
        res.send(players)
    }
    catch(e){
        console.log(e)
        res.send(`Error ${e}`)
    }
}
const getGames = async (req,res)=>{
    let data = await db.Jugador.findOne({where:{id: req.params.id}})
    if(!data){
        res.send('player id not found')
    }
    try{
    let jugades = await db.Joc.findAll({where:{JugadorId: data.id}})
    res.send(jugades)
    }
    catch(e){
        console.log(e)
    }
}
//GET /players/ranking: retorna el percentatge mig d’èxits del conjunt de tots els jugadors
const ranking = async (req,res)=>{
    try{
        const mitjanes = await mitjanes()
        let init = 0;
        let mitja = mitjanes.reduce((pV,cV)=>pV+cV,init);
        mitja = mitja/mitjanes.length;
        res.send(`La mitjana de tots els jugadors es: ${mitja} %`)
    }
    catch(e){
        console.log(e)
        res.send(`Error ${e}`)
    }
}
//GET /players/ranking/loser: retorna el jugador amb pitjor percentatge d’èxit
const loser = async (req,res)=>{
    const players = await mitjanes()
    console.log(players)
    let loser ={}
    for(const player of players){
        if(player.mitja<loser.mitja){
            loser = player;
        }
    }
    console.log(`el looser es: ${loser} amb mitja de: ${loser.mitja}`)
}
const winner = async (req,res)=>{
    res.send('winner')
}
const mitjanes = async()=>{
    try{
        const players = await db.Jugador.findAll()
       // let mitjanes=[];
        if(!players){
            res.send('table is empty')
        }
        for(const player of players){
            const jugades = await db.Joc.findAll({where:{JugadorId: player.id}})
            let victories = 0;
            jugades.forEach(jugada => {
                if(jugada.tirada == 7){
                    victories++;
                }
            });
            player.mitja = (victories/jugades.length)*100
        }
        return players;
    }
    catch(e){
        console.log(e)
    }
}
module.exports = {
    postPlayers,
    games,
    putPlayers,
    deletePlayers,
    getPlayers,
    getGames,
    ranking,
    loser,
    winner
};

/*
router.get('/user',function(req,res){
    const tirada = 4;
    const test = new Joc(tirada)
    test.guardar(tirada)
    res.status(200).send('get working');
})
*/
//module.exports = router;