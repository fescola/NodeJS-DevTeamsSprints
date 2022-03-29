const controller = require('../controller/controller')
const Room = require('../models/Room')
let users = []

function socket(io) {
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    io.sockets.on('connection', function(socket) {
        socket.on('userConnected', (name) => {
                if (typeof name === 'string') {
                    //TODO this can get a object object that we dont wanna save or accept, only string
                    let data = {
                        name: name,
                        id: socket.id
                    }
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].name === name) users.splice(i, 1)
                    }
                    users.push(data)
                    console.log(users)
                } else console.log('no user')
            })
            //room creation server side test
        socket.on('connectRoom', async function(room, user) {
            let searchRoom = await Room.findOne({ name: room })
            let [, oldRoom] = socket.rooms
            try {
                if (searchRoom) {
                    if (socket.rooms.size > 1) {
                        socket.leave(oldRoom)
                        console.log(`leaving ${oldRoom}`)
                    }
                    socket.join(room)
                    let roomUsers = io.sockets.adapter.rooms.get(room)
                    let arr = []
                    if (roomUsers != undefined) {
                        arr = [...roomUsers];
                    }
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = (users.find(u => u.id === arr[i])).name
                    }
                    io.to(room).emit("room connection", `${socket.id} connected`, arr)
                        //io.to(searchRoom.id).emit('message', `user: ${socket.id} has joined`);
                    console.log(`${user} joined room: ${room}`)
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

module.exports = socket;