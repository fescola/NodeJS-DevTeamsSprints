const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fetch =require("node-fetch");
const port = process.env.PORT || 3001;

//socket io client

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    fetch('http://localhost:3000/', {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    }).then((data)=>{
        console.log(data)
    })
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
    });
  });

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
