import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { io, userSocketMap } from "../socket/socket.js";
import { asyncHandler } from "../utils/handler.js";

export const sendMessage = asyncHandler(async(req,res,next)=>{
    const sender = req.userId;
    const reciever = req.params.id;
    const {message} = req.body;

    let conversation = await Conversation.findOne({participants:{$all:[sender,reciever]}});
    if(!conversation){
       conversation = await Conversation.create({participants:[sender,reciever]})
    }
    const newMessage = await Message.create({message,senderId:sender,receiverId:reciever});
    if(newMessage) conversation.messages.push(newMessage._id)
    await conversation.save();

    const receiverSocketId = userSocketMap.get(reciever);
    if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage',newMessage)
        io.to(receiverSocketId).emit('newMessageAlert',{userId:sender})
    }

    return res.status(200).json({
        success:true,
        newMessage
    })
})

export const getMessages = asyncHandler(async(req,res,next)=>{
    const myId = req.userId;
    const otherPersonId = req.params.id;

    if(!myId || !otherPersonId ){
        return next(new errorHandler('All fields are required',400))
    }

    let conversation = await Conversation.findOne({
        participants: {$all : [myId, otherPersonId]}
    }).populate('messages')

    if(!conversation){
        return res.status(200).json({success:true,messages:[]})
    }
    
    res.status(200).json({
        success:true,
        messages:conversation?.messages
    })
})