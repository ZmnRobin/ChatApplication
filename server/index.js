const express=require('express')
const app=express()
const http=require('http').createServer(app)
const io = require('socket.io')(http,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const {addUser , removeUser , getUser , getUsersInRoom}=require('./manageUser.js')


const PORT = process.env.PORT || 5000;
const router=require('./router');

io.on('connection',(socket)=>{
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
    
        if(error) return callback(error);
    
        socket.join(user.room);
    
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
      });
    
      socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
    
        io.to(user.room).emit('message', { user: user.name, text: message });
    
        callback();
      });


    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left.`})
        }
    });
});



app.use(router);

http.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}`);
})

