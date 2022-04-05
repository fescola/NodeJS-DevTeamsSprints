const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db?serverSelectionTimeoutMS=5000')
    .then(() => console.log('connected to mongodb'))
    .catch(() => {
        console.log("Conexió a MongoDB ha trigat massa")
        process.exit()
    });

const Schema = mongoose.Schema;

const dausSchema = new Schema({
    _id: Number,
    nom: String,
    data: Date
});

const DausModel = mongoose.model('daus', dausSchema)


//module.exports = db;
