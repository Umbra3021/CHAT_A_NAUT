const express = require('express');
const chat = require("./data/data");
const connectDB = require("./config/db")
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const dotenv = require("dotenv");
const { notfound,errorHandler } = require('./middleware/error');
const cors = require('cors');
const pack = require('socket.io');
const path = require('path');
dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);



const __dirname1 = path.resolve(); 

if(process.env.NodeENV === 'production'){
  app.use(express.static(path.join(__dirname1,'/frontend/build')));

  app.get('*',(req,res) =>{
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
  });
}
else{
  app.get('/',(req,res) =>{
    res.send('API is now WOrking');
  })
}





app.use(notfound);
app.use(errorHandler);

const expressserver = app.listen(5000,
    console.log("Server is up on")
);

const io = new pack.Server(expressserver,{
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection", (socket) => {
  console.log("IO socket up & running");

  socket.on('setup',(userData) =>{
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat',(room) =>{
    socket.join(room);
    console.log('User joined ' + room);
  })

  socket.on('new message',(messageReceived) =>{
    var chat  = messageReceived.chat;

    if(!chat.users){
        return console.log('chat.users not defined');
    }

    chat.users.forEach(user => {
        if(user._id === messageReceived.sender._id){
            return;
        }

        socket.in(user._id).emit("message recieved",messageReceived); 
    });
  
  })

  socket.off('setup',() => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  })
});


