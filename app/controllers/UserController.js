const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer  = require('multer');
const cors = require('cors')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    }
});
const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('../models/User');
const { json } = require('body-parser');

//Get per aconseguir la URL (http://localhost:3000/user)
router.get('/user', function (req, res) {
    let jsonSend ={}
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    User.findById('6203a1ca69ac23b74ba3ab27', function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        jsonSend = users;
        jsonSend.url = fullUrl;
        res.status(200).send(jsonSend);
    });
});

//Post per pujar un arxiu
router.post('/upload', upload.single('image'),function(req,res,next){
    console.log(req.file)
    if(!req.file) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        res.send({
            status: true,
            message: 'File is uploaded',
        });
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
    res.status(200).send({dateNow})
})

module.exports = router;