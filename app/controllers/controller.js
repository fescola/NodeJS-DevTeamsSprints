const express = require('express');
const router = express.Router();
const db = require('../models/sqlDB')


const postPlayers = async (req,res)=>{
    try{
        let params = req.body
        params.data = Date.now()
        if (await db.Jugador.findOne({ where: { nom: params.nom } })) {
            res.status(400).send( 'Username ' + params.nom + ' is already taken')
            return
        }
        if(params.nom == ''){
            params.nom = 'Anonim'
        }
        else{
        await db.Jugador.create(params)
        res.status(200).send('Player created')
        }
    }
    catch(e){
        res.status(500).json(e);
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
            res.status(200).send(`Jugador: ${player.nom} Nova tirada ${data.tirada}`)
        }
        if(!player){
            res.status(404).send('player id not found')
        }
    }
    catch(e){
        res.status(500).json(e);    }
}

const putPlayers = async (req,res)=>{
    const user = await db.Jugador.findOne({ where: { id: req.body.id } })
    if(!user){
        res.status(404).send('This ID doesnt exist')
    }
    else{
        try{
            db.Jugador.update({nom:req.body.nom},{where:{id:req.body.id}})
            res.send(await db.Jugador.findOne({where:{id:req.body.id}}))
        }
        catch(e){
            res.status(500).json(e);
        }
    }
}

const deletePlayers = async (req,res)=>{
    try{
        if(!await db.Joc.findOne({ where: { JugadorId: req.params.id } })){
            res.status(404).send('player id not found')
        }
        await db.Joc.destroy({where:{JugadorId: req.params.id}})
        res.status(200).send('jugades destruides')
    }
    catch(e){
        res.status(500).json(e);
    }
}

const getPlayers = async (req,res)=>{
    try{
        const players = await db.Jugador.findAll()
        if(!players){
            res.status(404).send('table is empty')
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
        res.status(500).json(e);
    }
}

const getGames = async (req,res)=>{
    let data = await db.Jugador.findOne({where:{id: req.params.id}})
    if(!data){
        res.status(404).send('player id not found')
    }
    try{
    let jugades = await db.Joc.findAll({where:{JugadorId: data.id}})
    res.send(jugades)
    }
    catch(e){
        res.status(500).json(e);
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
        res.status(200).send(`La mitjana de tots els jugadors es: ${mitja_} %`)
    }
    catch(e){
        res.status(500).json(e);
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
        res.status(200).send(`el looser es: ${loser.nom} amb mitja de: ${loser.mitja}`)
        }
        if(losers.length>1){
            res.status(200).send(`els losers son: ${losers}`)
        }
    }
    catch(e){
        res.status(500).json(e);
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
        res.status(200).send(`el winner es: ${winner.nom} amb mitja de: ${winner.mitja}`)
    }
    catch(e){
        res.status(500).json(e);
    }
}

const mitjanes = async()=>{
    try{
        const players = await db.Jugador.findAll()
        if(!players){
            res.status(404).send('table is empty')
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
        res.status(500).json(e);
    }
}
const getRanking = async(req,res)=>{
    try{
        const player = await db.Jugador.findOne({ where: { nom: req.body.nom } })
        if(!player){
            res.send('player name not found')
            return
        }
        else{
            const jugades = await db.Joc.findAll({where:{JugadorId: player.id}})
            let tirades = []
            player.victories = 0;
            for(const jugada of jugades){
                tirades.push(jugada.tirada)
                if(jugada.tirada == 7){
                    player.victories +=1;
                }
            }
            res.status(200).send(`tirades: ${tirades} | Victories: ${player.victories}`)
        }
    }
    catch(e){
        res.status(500).json(e);
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
    winner,
    getRanking
};
