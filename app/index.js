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
// this
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log("sending msg from " + socket.id + ": " + msg);
        //console.log('message: ' + msg);
    });
});

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
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
    socket.on('connectRoom', function(room) {
        socket.join(room);
        console.log(`${socket.id} joined room: ${socket.rooms}`)
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