const express = require('express');
const db = require('../models/sqlDB')


const postPlayers = async(req, res) => {
    try {
        let params = req.body
        params.data = Date.now()
        if (params.nom == '' || params.nom == undefined) {
            params.nom = 'Anonim'
            await db.Jugador.create(params)
            res.status(200).json({ msg: 'Player created' })
            return
        }
        if (await db.Jugador.findOne({ where: { nom: params.nom } })) {
            res.status(400).json({ msg: 'Username ' + params.nom + ' is already taken' })
            return
        } else {
            await db.Jugador.create(params)
            res.status(200).json({ msg: 'Player created' })
        }
    } catch (e) {
        res.status(500).json(e);
    }
}


const putPlayers = async(req, res) => {
    const user = await db.Jugador.findOne({ where: { id: req.body.id } })
    if (!user) {
        res.status(404).json({ error: 'This ID doesnt exist' })
    } else {
        try {
            if (await db.Jugador.findOne({ where: { nom: req.body.nom } })) {
                return res.status(200).json({ error: 'This username already exists' })
            }
            db.Jugador.update({ nom: req.body.nom }, { where: { id: req.body.id } })
            res.json(await db.Jugador.findOne({ where: { id: req.body.id } }))
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

const deletePlayers = async(req, res) => {
    try {
        if (!await db.Joc.findOne({ where: { JugadorId: req.params.id } })) {
            res.status(404).json({ error: 'player id not found' })
        }
        await db.Joc.destroy({ where: { JugadorId: req.params.id } })
        res.status(200).json({ msg: 'jugades destruides' })
    } catch (e) {
        res.status(500).json(e);
    }
}

const getPlayers = async(req, res) => {
    try {
        const players = await db.Jugador.findAll()
        if (!players) {
            res.status(404).json({ error: 'table is empty' })
        }
        for (const player of players) {
            const jugades = await db.Joc.findAll({ where: { JugadorId: player.id } })
            let mitja = 0;
            jugades.forEach(jugada => {
                mitja = mitja + jugada.tirada
            });
            mitja = mitja / jugades.length;
            player.dataValues.mitja = mitja;
        }
        res.json(players)
    } catch (e) {
        res.status(500).json(e);
    }
}

module.exports = {
    postPlayers,
    putPlayers,
    deletePlayers,
    getPlayers
};