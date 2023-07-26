//core module import
const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require('path');
const fs=require('fs')
require('dotenv').config();

//database import
const sequalize=require('./util/database')



//module imort function
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin:'*', //origin not found in my pc
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}));
app.use(express.json());



//router import
const signupRouter=require('./route/signupRouter');
const loginRouter=require('./route/loginRoute');
const messageRouter=require('./route/messageRouter');
const groupRouter=require('./route/groupRouter');
const resetPasswordRoutes = require('./route/resetpassword');

//module import
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
   // {force : true}
).then(()=>{
    console.log('sync');
    app.listen(3000);
}).catch((err)=>console.log(err));

