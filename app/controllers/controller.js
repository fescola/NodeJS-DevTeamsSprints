const express = require('express');
const router = express.Router();
const db = require('../models/sqlDB')


const postPlayers = async (req,res)=>{
    try{
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
    catch(e){
        console.log(e);
    }
}

const games = async (req,res)=>{
    try{
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
    catch(e){
        console.log(e);
    }
}

const putPlayers = async (req,res)=>{
    try{
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
    catch(e){
        console.log(e);
    }
}

const deletePlayers = async (req,res)=>{
    try{
        if(!await db.Joc.findOne({ where: { JugadorId: req.params.id } })){
            res.send('player id not found')
        }
        await db.Joc.destroy({where:{JugadorId: req.params.id}})
        res.send('jugades destruides')
    }
    catch(e){
        console.log(e);
    }
}

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

const ranking = async (req,res)=>{
    try{
        const players = await mitjanes()
        let mitjanes_ = []
        for(const player of players){
            if(player.mitja >= 0) {
            mitjanes_.push(player.mitja)
            console.log(mitjanes_)
            }
        }
        let init = 0;
        let mitja_ = mitjanes_.reduce((pV,cV)=>pV+cV,init);
        mitja_ = mitja_/mitjanes_.length;
        res.send(`La mitjana de tots els jugadors es: ${mitja_} %`)
    }
    catch(e){
        console.log(e)
        res.send(`Error ${e}`)
    }
}

const loser = async (req,res)=>{
    try{
        const players = await mitjanes()
        let loser ={}
        let losers = []
        for(const player of players){
            if(loser.mitja == undefined && player.mitja >= 0){
                loser = player
            }
            if(player.mitja<loser.mitja){
                loser = player;
            }
            if(player.mitja == 0 && loser.mitja == 0){
                losers.push(player.nom)
            }
        }
        if(losers.length<=1){
        res.send(`el looser es: ${loser.nom} amb mitja de: ${loser.mitja}`)
        }
        if(losers.length>1){
            res.send(`els losers son: ${losers}`)
        }
    }
    catch(e){
        console.log(e)
    }
}

const winner = async (req,res)=>{
    try{
        const players = await mitjanes()
        let winner ={}
        for(const player of players){
            if(winner.mitja == undefined && player.mitja >= 0){
                winner = player
            }
            if(player.mitja>winner.mitja){
                winner = player;
            }
        }
        res.send(`el winner es: ${winner.nom} amb mitja de: ${winner.mitja}`)
    }
    catch(e){
        console.log(e)
    }
}

const mitjanes = async()=>{
    try{
        const players = await db.Jugador.findAll()
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
