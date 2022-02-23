const db = requiere('../models/sqlDB')

async function test(){
    console.log( await db.Jugador.findAll())
}