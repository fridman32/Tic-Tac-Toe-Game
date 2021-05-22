const express = require('express');
const app = express();
const cors = require('cors')
const socket = require("socket.io")
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { create } = require('domain');
var cookie = require('cookie');

const database = path.join(__dirname, "UserDB.json");
const listOfUsers = []; //name  
const listofUsersNames = []; //id by name
const listOfRooms = [] //the index are users and vlue is roomnumber
const listOfRoomNameS = []
let userName = "";
let RoomNumber = 0;

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json({ limit: "50mb" }))

const server = app.listen(1000, () => {
    console.log('server is working')
})

const io = socket(server, {
    cors: {
        origin: '*',
    }
})

app.post('/login', (req, res, next) => {
    const stream = fs.readFileSync(database);
    var jsonTmp = JSON.parse(stream)
    const findUser = jsonTmp.User.find(user => user.name == req.body.name)
    //if user dosnt exsit send error
    if (findUser == null) {
        console.log("no user found")
        const error = new Error('username and password inncorect')
        error.httpStatusCode = 400
        return next(error)
    }
    console.log("logged in");
    userName = req.body.name;

    // res.statusCode === 200;-
    res.status(200).send({
        statusCode: 200,
        status: 'success'
    })
    res.status(500).send(err)
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

app.post('/signUp', function (req, res, next) {
    const stream = fs.readFileSync(database);
    var jsonTmp = JSON.parse(stream);
    var useTmp = { "name": req.body.name, "pass": req.body.pass }
    const userExist = jsonTmp.User.find(user => user.name == req.body.name)
    if (userExist != null) {
        //send to user that user taken not working--------------------
        console.log("user already exist pick another name");
        const error = new Error('user already exist pick another name')
        error.httpStatusCode = 400
        return next(error)
    }
    jsonTmp.User.push(useTmp)
    fs.writeFile(database, JSON.stringify(jsonTmp), function () {
        console.log("user saved to json");
        // res.statusCode === 200;
        res.status(200).send({
            statusCode: 200,
            status: 'success'
        })
    })
    // res.send("user already exist pick another name"); 
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

io.on('connection', async (socket) => {
    console.log('user conected');
    console.log(socket.id);
    //save id
    const userId = socket.id;
    //open prive room for new user
    socket.join(userId);
    // and then later
    io.to(userId).emit('hi', 'this is privet');
    //send the list of the users
    io.emit('newUser', listOfUsers)

    //when user disconnect
    socket.on('disconnect', () => {
        console.log(socket.id + 'user disconnected');
        const userId = socket.id;
        for (var i = 0; i < listOfUsers.length; i++) {

            if (listofUsersNames[listOfUsers[i]] == socket.id) {
                listOfUsers.splice(i, 1);
                listofUsersNames.splice(listOfUsers[i], 1);
            }
        }
        io.emit("login", listOfUsers)
    });

    //game invit
    socket.on('emitInvite', (data) => {
        //put sender in room 
        listOfRooms[data.sender] = `room-${RoomNumber}`
        listOfRooms[data.reciver] = `room-${RoomNumber}`
        RoomNumber = RoomNumber + 1
        listOfRoomNameS[data.sender + data.reciver] = data;
        socket.join(listOfRooms[data.sender]);
        //find reciver and invite them to the room
        var socketid = listofUsersNames[data.reciver];
        io.to(socketid).emit("gameInvite", data);
        //socket.join("room");
        //io.to(id).emit('gameInvite', socket.id);
    })

    socket.on('InviteAccapted', (data) => {
        socket.join(listOfRooms[data.sender])
        console.log(data);
        //find sender to tell them join game
        var socketid = listofUsersNames[data.sender];
        io.to(socketid).emit("joinGame", data);
        io.to(listOfRooms[data.sender]).emit("getMySign", data)
    })

    socket.on("user_conncted", (data) => {
        listofUsersNames[data] = socket.id;
        listOfUsers.push(data)
        io.emit("login", listOfUsers)
        // io.emit('newUser', listOfUsers)
    })

    //grop msg in game
    // socket.on('send_message_ingame', (data) => {
    //     //find room to send msg to
    //     console.log(data);
    //     var socketRoom = listOfRooms[data.sender]
    //     console.log(socketRoom);
    //     io.to(socketRoom).emit("new_message_ingame", data);
    // })

    socket.on('emitMove', (data) =>{
        io.to(listOfRooms[data.sender]).emit("move", data);
    })
    socket.on('emitNewGame', (data) =>{
        io.to(listOfRooms[data.sender]).emit("newGame", data);
    })
    socket.on('emitTurn', (data)=>{
        io.to(listOfRooms[data.sender].emit('turn'))
    })

    socket.on('emitMessage', (data) =>{
        console.log(data.message);
        io.to(listOfRooms[data.sender]).emit('message', data )
    })
});