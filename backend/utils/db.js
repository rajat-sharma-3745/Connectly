import mongoose from "mongoose"




export const connectDb = async () => {
    try {
        const instance = await mongoose.connect(process.env.MONGO_URI);
        console.log('Db connected ',instance.connection.host)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}