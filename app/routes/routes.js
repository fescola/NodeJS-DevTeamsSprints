var express = require('express');
var router = express.Router();
const controller = require('../controller/controller');
const verifyToken = require('./validate-token');



router.get('/', controller.html)
router.post('/test', controller.test)
router.post('/room', controller.createRoom)
router.get('/rooms', controller.getRooms)
    // :name -> name of the room
router.post('/:name/addUser', controller.addUser)
router.delete('/:name/deleteUser', controller.deleteUserFromRoom)
router.post('/login', verifyToken, controller.loged)
    //router.put('/',controller.a)
    //router.delete(`/`,controller.a)

module.exports = router;