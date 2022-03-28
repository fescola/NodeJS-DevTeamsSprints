const controller = require('../controller/controller')
const Room = require('../models/Room')
let User = require('../sockets/user')
let users = []

function socket(io) {
    //SOCKET STUFF 
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    //room creation server side test
    //TODO 
    io.sockets.on('connection', function(socket) {
        socket.on('userConnected', (name) => {
            if (typeof name === 'string') {
                //TODO this can get a object object that we dont wanna save or accept, only string
                console.log(name)
                let data = {
                    name: name,
                    id: socket.id
                }
                let user = new User(data)
                users.push(user)
                console.log(users)
            } else console.log('no user')
        })
        socket.on('connectRoom', async function(data) {
            let searchRoom = await Room.findOne({ name: data })
            let [, oldRoom] = socket.rooms
            console.log(oldRoom)
            try {
                if (searchRoom) {
                    if (socket.rooms.size > 1) {
                        socket.leave(oldRoom)
                        console.log(`leaving ${oldRoom}`)
                    }
                    socket.join(data)
                    socket.broadcast.to(data).emit("room connection", `${socket.id} connected`)
                        //io.to(searchRoom.id).emit('message', `user: ${socket.id} has joined`);
                    console.log(`${socket.id} joined room: ${data}`)
                }
            } catch (e) { console.log(e) };
        });
        socket.on('chat message', (data) => {
            console.log(data)
            let [, room] = socket.rooms
                //emiting to all sockets in room
            io.to(room).emit('chat message', data)
                //save msg to db
            let time = new Date();
            data.date = time.toLocaleString()
            controller.saveMsg(room, data)
        })
        socket.on('addRoom', () => {
            io.sockets.emit('refreshRooms')
        })
    });
}
// users = [];
// io.on('connection', function(socket){
//    console.log('A user connected');
//    socket.on('setUsername', function(data){
//          users.push(data);
//          socket.emit('userSet', {username: data});
//    })
// });

module.exports = socket;