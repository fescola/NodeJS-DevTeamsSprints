
var express = require('express');
var router = express.Router();
const controller = require('../controllers/controller');


router.post('/players',controller.postPlayers)
router.post(`/players/:id/games`,controller.games) //ID part to fix
router.put('/players',controller.putPlayers)
router.delete(`/players/:id/games`,controller.deletePlayers)
router.get('/players',controller.getPlayers)
router.get('/players/:id/games',controller.getGames)
router.get('/players/ranking',controller.ranking)
router.get('/players/ranking/loser',controller.loser)
router.get('/players/ranking/winner',controller.winner)
router.get('/players/playerRanking',controller.getRanking)
module.exports = router;

/*
POST /players: crea un jugador
PUT /players: modifica el nom del jugador
POST /players/{id}/games: un jugador específic realitza una tirada
DELETE /players/{id}/games: elimina les tirades del jugador
GET /players: retorna el llistat de tots els jugadors del sistema amb el seu percentatge mig d’èxits
GET /players/{id}/games: retorna el llistat de jugades per un jugador.
GET /players/ranking: retorna el percentatge mig d’èxits del conjunt de tots els jugadors
GET /players/ranking/loser: retorna el jugador amb pitjor percentatge d’èxit
GET /players/ranking/winner: retorna el jugador amb millor percentatge d’èxit
*/