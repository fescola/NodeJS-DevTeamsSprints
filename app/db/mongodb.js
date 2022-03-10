const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

server.listen(3000, () => {
    console.log('listening on *:3000');
  });

mongoose.connect('mongodb://localhost:27017/chat?serverSelectionTimeoutMS=5000')
    .then(() => console.log('connected to mongodb'))
    .catch(() => {
        console.log("Conexió a MongoDB ha trigat massa")
        process.exit()
    });

// mongoose.connect(
//     process.env.DB_CONNECT,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     },
//     () => console.log("connected to db")
//     );