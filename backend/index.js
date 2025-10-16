import cookieParser from 'cookie-parser';
import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './utils/db.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import userRouter from './routes/userRoute.js'
import messageRouter from './routes/messageRoute.js'
import postRouter from './routes/postRoute.js'
import { app, server } from './socket/socket.js';
dotenv.config({
    path: './.env'
});

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true
}
app.use(cors(corsOptions));

app.use('/api/v1/user',userRouter)
app.use('/api/v1/post',postRouter)
app.use('/api/v1/message',messageRouter)

const PORT = process.env.PORT






app.use(errorMiddleware);

connectDb().then(() =>
    server.listen(PORT, () => 
        console.log('Server running on port ', PORT)))




