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
const socket = require('./sockets/sockets')
dotenv.config();
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard")
const verifyToken = require("./routes/validate-token")
const cors = require('cors')

app.use(cors())
app.use(express.json());

// route middlewares
app.use("/api/user", authRoutes);
//sending a GET here with our header "auth-token" set to a JWT will get us access
app.use("/api/dashboard", verifyToken, dashboardRoutes)
app.use('/', routes)

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

socket(io);