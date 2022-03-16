const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "http://127.0.0.1:5501"
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
app.use("/api/dashboard",verifyToken,dashboardRoutes)

app.use('/',routes)

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

server.listen(3000, () => {
    console.log('listening on *:3000');
  });

mongoose.connect(
    process.env.DB_CONNECT,
    {
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
     console.log('message: ' + msg);
    });
  });

  io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      let data = {
        msg: msg
      }
      controller.saveMsg(data)
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