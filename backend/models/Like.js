import mongoose from "mongoose";



const likeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
})

export const Like = mongoose.model('Like',likeSchema)