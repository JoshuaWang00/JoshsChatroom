const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MessageModel = require("./models/Messages");
const http = require("http");
const{Server}= require("socket.io");
const cors = require('cors');
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = new Server(server,{
cors:{origin:"http://localhost:3000",
    methods:["GET","POST"],
},
});

//make sure to fill in USERNAME, PASSWORD, and COLLECTION with your own values
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@projects.8zoofid.mongodb.net/COLLECTION?retryWrites=true&w=majority");

app.get("/getMessages", async(req, res) => {
    await MessageModel.find()
    .then((data)=>{res.send(data);})
    .catch((err)=>res.send(err));
});

app.post("/createMessage", async(req, res) => {
const message = req.body;
const newMessage = new MessageModel(message);
await newMessage.save();
res.json(message);
});

io.on("connection", (socket)=> {
    console.log(`User Connected: ${socket.id}`);
    socket.on("send_message", (data) =>{
        io.sockets.emit("receive_message", data);      
    });
});

server.listen(3001, () => {
    console.log("socket server runs");   
    });