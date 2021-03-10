const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {addUser, getUser, getUsersInRoom, removeUser} = require('./utils/users');
const app = express();

const server = http.createServer(app);
const io = socketio(server);
const {genrateMessages } = require('./utils/message');

const port = process.env.port || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) =>{
    socket.emit('message', genrateMessages('Admin','Welcome to Geexu Booking Protal!!'));

    socket.on('join', ({ username, room }) =>{
        const {error, user} = addUser({id: socket.id, username, room});
        if(error){
            return error;
        }

        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message', genrateMessages(user.username,` has joined!`));

        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })


    socket.on('sendMessage',(message) =>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message',genrateMessages(user.username, message));
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', genrateMessages(user.username,` has left!`));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, ()=>{
    console.log(`Application is running on port ${port}`);
})