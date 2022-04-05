
# Inicialització

A consola: npm i - per la instalació dels moduls
            node app/app.js - per la inicialització del server

# Endpoints

POST /players: crea un jugador
PUT /players: modifica el nom del jugador
POST /players/{id}/games: un jugador específic realitza una tirada
DELETE /players/{id}/games: elimina les tirades del jugador
GET /players: retorna el llistat de tots els jugadors del sistema amb el seu percentatge mig d’èxits
GET /players/{id}/games: retorna el llistat de jugades per un jugador.
GET /players/ranking: retorna el percentatge mig d’èxits del conjunt de tots els jugadors
GET /players/ranking/loser: retorna el jugador amb pitjor percentatge d’èxit
GET /players/ranking/winner: retorna el jugador amb millor percentatge d’èxit
GET /players/playerRanking: retorna les tirades del jugador (enviant el nom pel body com a json) y el numero de victories que te

# Postman

L'arxiu postman esta guardat a la carpeta postman del propi projecte

# Com utilitzar

Per poder pasar pel middleware de la verificacio de JWT s ha de registrar un user i logejarte (amb nom i password, res mes) per rebre el header, colocar el header al postman Type: Bearer Token dins de la part d'Authorization i configurar el postman per que rebi el header a tots els requests.

Post players games y Delete players ambods fan servir la :id a la ruta, no al body, s'ha de modificar i posar una id de la database que existeixi.



