const express = require('express')
const { createServer } = require('http')
const app = express()
const path = require('path')
const { Server } = require('socket.io')
const cors = require('cors')
const { disconnect } = require('process')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true // For headers like cookies, etc.
    }
});

const secretKeyJWT = "asfduhrwfasd"

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/login', (req, res) => {
    const token = jwt.sign({_id:"asdafaddfs"}, secretKeyJWT);

    res.cookie('token', token, {httpOnly: true, secure:true, sameSite:"none"})
    .json({
        message : "Login Successfull"
    });
})

//JWT Auth
const user = false;
io.use((socket, next) => {
    cookieParser(socket.request, socket.request.res, (err) => {
        if(err) return next(err);

        const token = socket.request.cookies.token;

        if(!token) return next(new Error("Authentication Error"));

        const decode = jwt.verify(token, secretKeyJWT)
        next();
    })
})

io.on('connection', (socket) => {
    console.log(" User Connected Id :", socket.id);

    socket.emit('welcome',`welcome to server, Your ID : ${socket.id}`);

    socket.on('message', ( message, room )=>{
        console.log(message, room);
        io.to(room).emit('receive-message',message);
    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User Joined ${room}`);
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
});

server.listen(3000, () => [
    console.log("Server listening to port 3000")
]);