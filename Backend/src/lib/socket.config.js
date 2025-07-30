import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
  origin: [process.env.originName],
  credentials: true
}
});
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }
const userSocketMap={};

io.on("connection", (socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId)userSocketMap[userId]=socket.id;
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
    })
})   


export { app, io, server };

