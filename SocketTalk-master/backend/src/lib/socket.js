import { Server} from "socket.io"
import http from "http"
import express from "express"

const app=express()
const server=http.createServer(app)

//connecting the frontend 
const io=new Server(server,{
    cors: {
        origin:["http://localhost:5173"]
    },
});

//exporting the userID socket id from map to make 1-1 real time chat
export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

//used to store online users
const  userSocketMap={}; //{userId:sockeId}


//socket.on(eventName, callback) on connection 
io.on("connection",(socket)=>{
console.log("A user connected",socket.id)

//
const userId=socket.handshake.query.userId;

//validation of userid , if true then store in key value pair in the map
if(userId) userSocketMap[userId]=socket.id;

//emit function to let other connected users to the socket server  who is newly joined 
io.emit("getOnlineUsers",Object.keys(userSocketMap))

socket.on("disconnect",()=>{
    console.log("a user id disconnected",socket.id)
    //delete the user from the map if disconnected 
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

})


})

export {io,app,server}