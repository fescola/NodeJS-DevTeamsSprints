const express = require('express');
const sequelize = require('../models/sqlDB');
const router = express.Router();
const Joc = require('../models/sqlDB')

const joc = new Joc()

const test = (req,res,next) =>{
    res.json({message: "test"})
    joc.guardar({ nom: 'ferran',tirades: [3,5]})
}
const postPlayers = (req,res,next)=>{

}
const games = (req,res,next)=>{
    let ID = req.params.id;
}
const putPlayers = (req,res,next)=>{

}
const deletePlayers = (req,res,next)=>{
    let ID = req.params.id;
}
const getPlayers = (req,res,next)=>{

}
const getGames = (req,res,next)=>{
    let ID = req.params.id;
}
const ranking = (req,res,next)=>{

}
const loser = (req,res,next)=>{

}
const winner = (req,res,next)=>{

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