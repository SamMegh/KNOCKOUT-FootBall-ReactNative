import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
dotenv.config();
const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.ORIGIN_NAMES
  ? process.env.ORIGIN_NAMES.split(",")
  : [];
  
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const userSocketMap={};
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }

io.on("connection", (socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId)userSocketMap[userId]=socket.id;
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
    })
})   


export { app, io, server };

