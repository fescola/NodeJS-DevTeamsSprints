const controller = require('../controller/controller')
const Room = require('../models/Room')
let users = []

function socket(io) {
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {});
    });

    io.sockets.on('connection', function(socket) {
        socket.on('userConnected', (name) => {
            try {
                if (typeof name === 'string') {
                    let data = {
                        name: name,
                        id: socket.id
                    }
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].name === name) {
                            io.to(users[i].id).emit('disconnectOldUser');
                            users.splice(i, 1)
                        }
                    }
                    users.push(data)
                } else return
            } catch (error) { console.log(error); }
        })

        socket.on('connectRoom', async function(room, user) {
            let searchRoom = await Room.findOne({ name: room })
            let [, oldRoom] = socket.rooms
            try {
                if (searchRoom) {
                    if (socket.rooms.size > 1) {
                        socket.leave(oldRoom)
                    }
                    socket.join(room)
                    let roomUsers = io.sockets.adapter.rooms.get(room)
                    let arr = []
                    if (roomUsers != undefined) {
                        arr = [...roomUsers];
                    }
                    for (let i = 0; i < arr.length; i++) {
                        let found = users.find(u => u.id === arr[i])
                        arr[i] = found.name
                    }
                    io.to(room).emit("room connection", `${user} connected`, arr)
                }
            } catch (e) { console.log(e) };
        });
        socket.on('chat message', (data) => {
            try {
                let [, room] = socket.rooms
                    //emiting to all sockets in room
                io.to(room).emit('chat message', data)
                    //save msg to db
                let time = new Date();
                data.date = time.toLocaleString()
                controller.saveMsg(room, data)
            } catch (error) { console.log(error) }
        })
        socket.on('addRoom', () => {
            io.sockets.emit('refreshRooms')
        })
    });
}

module.exports = socket;