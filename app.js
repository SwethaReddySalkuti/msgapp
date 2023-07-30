const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config();


const sequalize=require('./util/database')




const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin:'*',  
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}));
app.use(express.json());




const signupRouter=require('./route/signupRouter');
const loginRouter=require('./route/loginRoute');
const messageRouter=require('./route/messageRouter');
const groupRouter=require('./route/groupRouter');
const resetPasswordRoutes = require('./route/resetpassword');


const User=require('./module/signup');
const Message=require('./module/message');
const Group = require('./module/group')
const userGroup = require('./module/userGroup');
const Forgotpassword = require('./module/forgotpassword');

app.use("/signup",signupRouter);
app.use(loginRouter);
app.use('/user',messageRouter);
app.use("/group",groupRouter)
app.use('/password', resetPasswordRoutes);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
User.hasMany(Message);
Message.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});
User.belongsToMany(Group,{through:userGroup});
Group.belongsToMany(User,{through:userGroup});
Group.hasMany(Message);
Message.belongsTo(Group,{constraints: true, onDelete: 'CASCADE'});


sequalize.sync(
  //  {force : true}
).then(()=>{
    console.log('sync');
    app.listen(3000);
    /*
    const server = app.listen(3000);
    const io = require('socket.io')(server,{
        pingTimeout:60000,     //waits 60 seconds to close the connection to save band width
        cors:{
            origin:"http://localhost:3000",
        }
    })
    io.on("connection" , (socket) => {
        console.log('connected to socket.io');
    })
    
    const io = require('socket.io')(3000)

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

    */
}).catch((err)=>console.log(err));

