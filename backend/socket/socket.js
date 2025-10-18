import { Server } from 'socket.io'
import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser';
import { socketAuth } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
export const app = express();//req listener

export const server = http.createServer(app);  // http server

dotenv.config({
    path:'./.env'
})
export const io = new Server(server,{
    cors:{
        origin:process.env.CLIENT_URL,
        methods:['POST',"GET"],
        credentials:true
    }
});

export const userSocketMap = new Map(); //map user id with socket id
const onlineUsers = new Set();

io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,async(err)=>{
        await socketAuth(err,socket,next)
    })
})

io.on('connection',(socket)=>{
    const userId = socket.userId
    if(userId){
        userSocketMap.set(userId,socket.id)
        onlineUsers.add(userId);
        console.log('user connected ',[...userSocketMap])
         //[...userSocketMap.keys()] keys() returns a map iterator which contains all the keys of the map , we can use that iterator inside a for of loop or spread it inside the array , spreading the iterator , collects all the keys into a plain array
    }
    io.emit('getOnlineUsers',Array.from(onlineUsers)); 




    socket.on('disconnect',()=>{
      if(userSocketMap.get(userId)===socket.id) {
          userSocketMap.delete(userId)
          onlineUsers.delete(userId);

      }
        

    io.emit('getOnlineUsers',Array.from(onlineUsers)); 

    })
})



