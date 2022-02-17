const express = require('express');
const sequelize = require('../models/sqlDB');
const router = express.Router();
const Daus = require('../models/sqlDB')

router.get('/user',function(req,res){
    const tirada = 4;
    const test = new Daus(tirada)
    test.guardar(tirada)
    res.status(200).send('get working');
})

module.exports = router;