const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const multer = require('multer');
const session = require('express-session');
const userRoute = require("./routes/userRoute");
const path = require('path');
const User = require('./models/user');
const ChatMessage = require('./models/chat');
const chatRoute=require("./routes/chatRoute");
const dotenv = require('dotenv');
var fs = require('fs');

app.set('view engine', 'ejs');

//app.use(express.static('public'));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb(null, 'static/uploads/');
    cb(null, 'public/uploads/');
  },
  filename:function(req,file,cb){
    //return cb(null,Date.now()+'-'+file.originalname);
    return cb(null,file.originalname);
  },
});

const upload = multer({storage});
 app.use('/static/upload', express.static(path.join(__dirname, 'public/uploads')));

 app.use(session({
  secret:"personal",
    resave: false,
    saveUninitialized: false, 
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    },
}));

app.use(express.static('public'));


app.post('/upload', upload.single('file'), (req, res) => {
 // const filePath = '/uploads/' + req.file.filename; 
  const filePath = '/static/upload/' + req.file.filename; 
  console.log(filePath);
  res.json({ filePath });
  // const Sender = req.session.User || 'Guest';
 // io.emit('fileUploaded', { sender: Sender.name, filePath: filePath });
});

//Redirecting all chat routes
app.use('/chat', chatRoute);

// Redirecting all user routes
app.use('/', userRoute);

app.get('/', (req, res) => {
  res.render('index');
});


const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('A user connected');


  // Handle private chat setup
  socket.on('privateChat', (data) => {
    const { user, chatUser } = data;
     const room = 'private';
    socket.join(room);
    connectedUsers[user] = room;
    connectedUsers[chatUser] = room;
  });
  
 

  // Handle private messages
  socket.on('sendPrivateMessage', (data) => {
    const { sender, receiver, message } = data;

    const room = 'private';
    // Emit the private message to the specified room
    io.to(room).emit('privateMessage', { sender, message });
  });
  

  socket.on('joinGroup',async (groupName,username) => {
  
    const room = `group-${groupName}`;
    
    socket.join(room);
     
    const previousMessages = await ChatMessage.find({groupName}).sort('timestamp');

    socket.emit('previousMessages', previousMessages);
    // broadcast a message to the group to notify others about the new user joining
    socket.to(room).emit('groupMessage', { message: `${username} joined the group.` });
  });

  socket.on('sendGroupMessage',async (data) => {
    const { sender, message,type, groupName } = data;
    const room = `group-${groupName}`;
    console.log(room);

    // Save the message to the database
    const chatMessage = new ChatMessage({ sender, message,type, groupName });
    await chatMessage.save();
    // Emit the group message to the specified room
    io.to(room).emit('groupMessage', { sender, message });
  });
   
  //Private file Transfer
  socket.on('sendprivateFile',(data)=>{
    io.to('private').emit('privatefileUploaded',data);
  });

  //Group file transer 
  socket.on('sendGroupFile',async (data) => {
    const { message, sender, type ,groupName } = data;

    const chatMessage = new ChatMessage({sender,message,type,groupName});
     await chatMessage.save();

     io.to(`group-${data.groupName}`).emit('fileUploaded', data);
   });

  //to get username
  socket.on('setUserName', (userName) => {
    socket.userName = userName;
    });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
    
  });
});

dotenv.config({
  path: "./config.env"
})

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
