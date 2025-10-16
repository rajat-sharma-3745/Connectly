import jwt from 'jsonwebtoken';
import { asyncHandler, errorHandler } from '../utils/handler.js';


export const auth = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.instaToken;
    if(!token) return next(new errorHandler('User not authenticated',401));
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
})
export const socketAuth = asyncHandler(async(err,socket,next)=>{
    if(err) return next(new errorHandler(err, 400));
    const token = socket.request.cookies.instaToken;
    if(!token) return next(new errorHandler('User not authenticated',401));
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
})

