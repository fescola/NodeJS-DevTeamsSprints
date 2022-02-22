const express = require('express');
const sequelize = require('../models/sqlDB');
const router = express.Router();
const Joc = require('../models/Joc')

const joc = new Joc()

const test = (req,res,next) =>{
    res.json({message: "test"})
    joc.guardar({ nom: 'ferran',tirades: [3,5]})
}
const postPlayers = (req,res,next)=>{
    res.send('postPlayers')
}
const games = (req,res,next)=>{
    let ID = req.params.id;
    res.send('games')
}
const putPlayers = (req,res,next)=>{
    //modificar nom jugador
    let ID = req.params.id
    res.send('putPlayers')
    
}
const deletePlayers = (req,res,next)=>{
    let ID = req.params.id;
    res.send('deletePlayers')
}
const getPlayers = (req,res,next)=>{
    res.send('getPlayers')

}
const getGames = (req,res,next)=>{
    let ID = req.params.id;
    res.send('getGames')
}
const ranking = (req,res,next)=>{
    res.send('ranking')
}
const loser = (req,res,next)=>{
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