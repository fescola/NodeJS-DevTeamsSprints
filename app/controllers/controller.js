const express = require('express');
const router = express.Router();
//const Joc = require('../models/Joc')
const db = require('../models/sqlDB')


const test = (req,res,next) =>{
    res.json({message: "test"})
    //joc.guardar({ nom: 'ferran',tirades: [3,5]})
}
const postPlayers = async (req,res)=>{
    //joc.guardar(req.body)
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
//POST /players/{id}/games: un jugador específic realitza una tirada
const games = async (req,res,next)=>{
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
    let ID = req.params.id
    res.send('putPlayers')
}
const deletePlayers = async (req,res)=>{
    if(!await db.Joc.findOne({ where: { JugadorId: req.params.id } })){
        res.send('player id not found')
    }
    await db.Joc.destroy({where:{JugadorId: req.params.id}})
    res.send('jugades destruides')
}
const getPlayers = async (req,res)=>{
    const tirades = await db.Joc.findAll()
    let players = []
    tirades.forEach(roll => {
        players.push(roll.tirada)
        })
        console.log(players)
    // while(players.length() > 0){
    //     llista.push(players)
    // }
    //res.send(await db.Jugador.findAll())
    res.send('a')
}
const getGames = async (req,res)=>{
    let data = await db.Jugador.findOne({where:{id: req.params.id}})
    res.send(data)
}
const ranking = (req,res)=>{
    console.log("ranking console")
    res.send('ranking')
}
const loser = (req,res)=>{
    console.log("loser console")
    res.send('loser')
}
const winner = (req,res)=>{
    res.send('winner')
}
module.exports = {
    test,
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