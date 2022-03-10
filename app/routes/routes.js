var express = require('express');
var router = express.Router();
const controller = require('../controller/controller');



router.get('/',controller.test)
router.post('/room',controller.createRoom)
// :name -> name of the room
router.post('/:name/addUser',controller.addUser)
router.delete('/:name/deleteUser',controller.deleteUserFromRoom)
//router.post('/',controller.test)
//router.put('/',controller.a)
//router.delete(`/`,controller.a)


module.exports = router;