const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    }
});

const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('./User');
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

module.exports = router;