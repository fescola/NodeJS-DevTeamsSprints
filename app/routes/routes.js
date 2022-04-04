var express = require('express');
var router = express.Router();
const players = require('../controllers/players');
const games = require('../controllers/games')
const verifyToken = require('../middlewares/validate-token');

router.post('/players', verifyToken, players.postPlayers)
router.post(`/players/:id/games`, verifyToken, games.games) //
router.put('/players', verifyToken, players.putPlayers)
router.delete(`/players/:id/games`, verifyToken, players.deletePlayers)
router.get('/players', verifyToken, players.getPlayers)
router.get('/players/:id/games', verifyToken, games.getGames)
router.get('/players/ranking', verifyToken, games.ranking)
router.get('/players/ranking/loser', verifyToken, games.loser)
router.get('/players/ranking/winner', verifyToken, games.winner)
router.get('/players/playerRanking', verifyToken, games.getRanking)
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