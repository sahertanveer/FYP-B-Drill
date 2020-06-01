const express = require('express')
const connectDB = require('./config/db')
const app = express()
var bodyParser=require("body-parser"); 

//chat
// var socketServer = require('http').createServer(app)
// var io = module.exports.io = require('socket.io')(socketServer)

const PORT = process.env.PORT || 5000

const http = require("http").createServer(app);
const io =  module.exports.io = require("socket.io")(http);
// const SERVER_PORT = process.env.PORT || 3231

const Users = require('./routes/api/users')
const Profile = require('./routes/api/profile')
const AttackSessions = require('./routes/api/attacksessions')
const Authorization = require('./routes/api/authorization')
const Admin = require('./routes/api/admin')
const Manager = require('./routes/api/managers')
const AttackInventory = require('./routes/api/attackinventory')
const Organization = require('./routes/api/organization')
const DeleteUsers = require('./routes/api/deleteusers')
const Password = require('./routes/api/password')
const Visualization = require('./routes/api/visualization')
const GetLength = require('./routes/api/getlength')

const SocketManager = require('./routes/api/chat/SocketManager')

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
}));

//Connect Database
connectDB();

app.get('/', (req,res) => res.send('API Running'));

 //init middleware
 app.use(express.json({extended: false}))

 //chat app
io.on('connection', SocketManager)

//user connection

//dashboards
app.use('/api/getlength', GetLength)

//candidates
app.use('/api/users', Users)
app.use('/api/profile', Profile)
app.use('/api/attacksessions', AttackSessions)

//admin
app.use('/api/admin', Admin)

//manager
app.use('/api/managers', Manager) 
app.use('/api/attackinventory', AttackInventory) 

//organization
app.use('/api/organization', Organization) 

//authorization
app.use('/api/authorization', Authorization)

//deleteuser
app.use('/api/deleteusers', DeleteUsers)

//password
app.use('/api/password', Password)

//visualization
app.use('/api/visualization', Visualization)

http.listen(PORT, () => 
console.log(`Server started on port ${PORT}`));
