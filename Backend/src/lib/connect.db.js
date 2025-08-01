import mongoose from "mongoose";

export const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected' + conn.connection.host);
    } catch (error) {
        console.log('MongoDB connection failed' + error);
    }
}