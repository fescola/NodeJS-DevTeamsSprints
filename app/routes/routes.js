var express = require('express');
var router = express.Router();
const controller = require('../controller/controller');
const verifyToken = require('./validate-token');



router.get('/', controller.html)
router.get('/google', controller.google)
router.get('/google-auth', controller.googleAuth)
router.post('/room', controller.createRoom)
router.get('/rooms', controller.getRooms)
router.get('/rooms/:name', controller.getRoomData)
    // :name -> name of the room
router.post('/:name/addUser', controller.addUser)
router.delete('/:name/deleteUser', controller.deleteUserFromRoom)
router.post('/login', verifyToken, controller.loged)

module.exports = router;