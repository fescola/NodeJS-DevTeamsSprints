const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer  = require('multer');
const cors = require('cors')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    }
});
const upload = multer({ 
    storage: storage ,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('../models/User');
const { json } = require('body-parser');

//Get per aconseguir la URL (http://localhost:3000/user)
router.get('/user', function (req, res) {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let jsonSend ={
        "nom":"ferran",
        "edat": 27,
        "URL": fullUrl
    }
    console.log(jsonSend)
    res.status(200).send(jsonSend);
});

//Post per pujar un arxiu
router.post('/upload',upload.single('image'),function(req,res,next){
    try{
        if(!req.file) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        }
        else {
            res.send({
                status: true,
                message: 'File is uploaded',
            });
        }
    }
    catch(e){
        res.json(e)
    }
});


//Nivell 2, config de CORS i post /time
const cacheMW = (req,res,next) =>{
    res.set('Cache-control','no-cache')
    next()
}
const authMW =(req,res,next)=>{
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
      }
      next();
}

//Nivell 2 i 3, cors, cache middleware y authentication middleware
router.post('/time',cors(),cacheMW,authMW,function(req,res,next){
    const {user} = req.body
    dateNow = {
        user,
        date: new Date().toLocaleString()
    }
    res.status(200).send(dateNow)
})

module.exports = router;