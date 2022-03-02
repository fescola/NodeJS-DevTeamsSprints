class Joc {
    constructor(players){
        this.players = players;
    }
    llistarTots(){
        console.table(this.players)
    }
    tirada(player){
        let novaTirada = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1 )
        player.tirades.push(novaTirada)
    }
}

const testing = []
const jugador1 = {
    nom: "pep",
    ID: 2,
    data: '21/02/2022',
    tirades: []
}
const jugador2 = {
    nom: "pep0",
    ID: 1,
    data: '21/02/2022',
    tirades: []
}

testing.push(jugador2,jugador1)
const jocTest = new Joc(testing)
jocTest.tirada(jugador1)
jocTest.llistarTots()