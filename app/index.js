const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const Room = require('./models/Room')
const User = require('./models/User')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require('./routes/routes')
dotenv.config();
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard")
const verifyToken = require("./routes/validate-token")
const controller = require("./controller/controller")
var cors = require('cors')

app.use(cors())
app.use(express.json());

// route middlewares
app.use("/api/user", authRoutes);
//sending a GET here with our header "auth-token" set to a JWT will get us access
app.use("/api/dashboard", verifyToken, dashboardRoutes)

app.use('/', routes)
    // app.get('/', (req, res) => {
    //   res.sendFile(__dirname + '/index.html');
    // });

server.listen(3000, () => {
    console.log('listening on *:3000');
});

mongoose.connect(
    process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log("connected to db")
);

//SOCKET STUFF 
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg, id) => {
        io.emit('chat message', msg, id);
        let time = new Date();
        let data = {
            msg: msg,
            date: time.toLocaleString()
        }
        controller.saveMsg(data)
    });
});
//room creation server side test
//TODO 
io.sockets.on('connection', function(socket) {
    socket.on('connectRoom', async function(data) {
        //socket.join(room);
        let searchRoom = await Room.findOne({ name: data })
        try {
            if (searchRoom) {
                socket.join(searchRoom.id)
                io.to(searchRoom.id).emit('message', `user: ${socket.id} has joined`);
                console.log(`${socket.id} joined room: ${searchRoom.name} with id: ${searchRoom.id}`)
            }
        } catch (e) { console.log(e) };

    });
});
io.sockets.on('connection', function(socket) {
    socket.on('createRoom', async function(data) {
        console.log(`this is data: ${data}`);
        try {
            let room = new Room({
                name: data
            });
            if (room.name = await Room.findOne({ name: data })) {
                return console.log('room already exists')
            }
            await room.save(); //TODO rooms are not getting saved
            console.log(`new room saved: ${room.name}`)
        } catch (error) {
            console.log(error)
        }
    });
});
// users = [];
// io.on('connection', function(socket){
//    console.log('A user connected');
//    socket.on('setUsername', function(data){
//          users.push(data);
//          socket.emit('userSet', {username: data});
//    })
// });