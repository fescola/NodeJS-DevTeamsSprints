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
    // save user
    else(
    await db.Jugador.create(params)
    )
    res.send('postPlayers')
}
const games = (req,res,next)=>{
    if(await db.Jugador.findOne({ where: { id: req.params.id } })){
        
    }
    res.send('games')
}
const putPlayers = (req,res,next)=>{
    let ID = req.params.id
    res.send('putPlayers')
}
const deletePlayers = (req,res,next)=>{
    let ID = req.params.id;
    res.send('deletePlayers')
}
const getPlayers = async (req,res,next)=>{
    res.send(await db.Jugador.findAll())
}
const getGames = async (req,res,next)=>{
    let data = await db.Jugador.findOne({where:{id: req.params.id}})
    res.send(data)
}
const ranking = (req,res,next)=>{
    console.log("ranking console")
    res.send('ranking')
}
const loser = (req,res,next)=>{
    console.log("loser console")
    res.send('loser')
}
const winner = (req,res,next)=>{
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